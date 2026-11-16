# Deployment

Aplikasi adalah satu proses Node.js dengan database SQLite berbasis berkas. Platform yang sudah dipakai: **hosting DirectAdmin Gapurahoster (plugin Node.js)**. Alternatif: VPS atau hosting lain yang mendukung Node 22.13+.

## Gapurahoster (DirectAdmin > Node.js) — yang sedang dipakai
1. **Node.js > Create Application**: Node 24, mode `production`, Application root `domains/biruwebsite.my.id/app` (satu folder dengan `public_html` domain), URL `biruwebsite.my.id` (kolom path kosong), startup file `server.js`.
2. **Environment variables** (satu variabel per baris; `NODE_ENV` otomatis dari mode):
   | Name | Value |
   |---|---|
   | `SITE_URL` | `https://biruwebsite.my.id` |
   | `SESSION_SECRET` | acak 64 karakter (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `TRUST_PROXY` | `1` |
   | `ADMIN_EMAIL`, `ADMIN_PASSWORD` | hanya untuk membuat admin pertama (min. 10 karakter) |
3. Unggah isi proyek ke folder aplikasi **tanpa** `node_modules/`, `data/`, dan `.env`, lalu **Run NPM Install** dan **Restart**.
4. Saat start pertama, `src/bootstrap.js` mengisi data awal dan membuat admin dari `ADMIN_EMAIL`/`ADMIN_PASSWORD` (hanya bila belum ada pengguna). **Setelah bisa login, hapus `ADMIN_PASSWORD` dari panel, Save, lalu ganti kata sandi di Admin > Pengguna.**
5. Hapus file placeholder (`index.html`/`index.php`) di folder dokumen subdomain bila halaman bawaan hosting masih muncul.
6. Log kesalahan: `stderr.log` di folder aplikasi. Penolakan lintas-asal ditulis dengan awalan `[sameOrigin]`.
7. Pindah ke domain utama: ubah `SITE_URL` dan Application URL, lalu Restart. Kode tidak perlu diubah.

## Alur revisi otomatis (GitHub Pull Request -> hosting)
Revisi: **buat branch -> Pull Request -> tes CI lulus -> Merge**. Workflow `.github/workflows/deploy.yml` lalu menjalankan tes, membuat zip kode, mengunggahnya lewat API DirectAdmin (port 2222), mengekstrak ke folder aplikasi, dan me-restart aplikasi (FTP dan SSH diblokir firewall hosting).

Penyiapan satu kali:
1. DirectAdmin > **Login Keys**: buat key dengan izin hanya `CMD_API_FILE_MANAGER` (tanpa batasan IP, karena IP GitHub berubah).
2. `gh secret set DA_LOGIN_KEY --env production --repo ptakamendunia-creator/biruwebsite`
3. Host dan user DirectAdmin diatur di bagian `env:` pada `deploy.yml`.

Catatan:
- `data/`, `.env`, dan `node_modules/` tidak pernah disentuh deploy, jadi database dan unggahan aman.
- Bila `package.json` berubah, klik **Run NPM Install** di DirectAdmin > Node.js satu kali.
- Rollback: *revert* PR lalu merge. Deploy manual: Actions > Deploy > Run workflow.
- Login Key bisa menulis ke seluruh akun hosting; simpan hanya sebagai secret GitHub dan putar ulang bila bocor.

## Build produksi
Tidak ada langkah build (HTML dirender server, CSS/JS statis):
```bash
npm ci --omit=dev
npm run migrate
```

## Variabel lingkungan wajib
```
NODE_ENV=production
SITE_URL=https://biruwebsite.my.id
SESSION_SECRET=<32+ karakter acak>
TRUST_PROXY=1
```
Server menolak start di produksi tanpa `SESSION_SECRET`.

## VPS Linux (Nginx + systemd)
1. Pasang Node 22+ dan Nginx. Salin proyek ke `/srv/biru-website`, buat `.env` (`chmod 600`).
2. `/etc/systemd/system/biru-website.service`:
   ```ini
   [Unit]
   Description=Biru Website
   After=network.target

   [Service]
   WorkingDirectory=/srv/biru-website
   ExecStart=/usr/bin/node server.js
   Restart=always
   User=www-data
   NoNewPrivileges=true
   ProtectSystem=full
   ReadWritePaths=/srv/biru-website/data

   [Install]
   WantedBy=multi-user.target
   ```
3. Nginx (terminasi HTTPS lewat certbot):
   ```nginx
   server {
     server_name biruwebsite.my.id;
     client_max_body_size 4m;
     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $remote_addr;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```
4. `sudo certbot --nginx -d biruwebsite.my.id`, lalu `sudo systemctl enable --now biru-website`.
5. Cron harian: `0 2 * * * cd /srv/biru-website && /usr/bin/node scripts/backup.js`.

## Windows / PM2
`npm i -g pm2 && pm2 start server.js --name biru-website && pm2 save`. Backup lewat Task Scheduler.

## Setelah online
- Buka `/healthz`, `/sitemap.xml`, `/robots.txt`.
- Kirim `sitemap.xml` ke Google Search Console dan Bing Webmaster Tools.
- Uji HTTPS dan header: CSP, HSTS terpasang otomatis saat `NODE_ENV=production`.
- Uji form kontak sungguhan dan email notifikasi.
- Ganti kata sandi admin awal.

## Skala
SQLite dengan mode WAL melayani trafik situs company profile dengan nyaman. Untuk lebih dari satu instance atau beban tulis tinggi, pindahkan ke PostgreSQL/MySQL: skema di `src/db.js` portabel, dan semua query terpusat pada `src/routes/*.js`.

## Troubleshooting: situs 403/404 dari LiteSpeed
Buka DirectAdmin > **Node.js**. Bila status aplikasi `stopped`, klik tombol Start (kasus 16 Nov 2026). Bila `stderr.log` berisi `fork: Resource temporarily unavailable`, batas proses akun hosting tercapai (akun dipakai bersama beberapa situs): hentikan proses lain atau minta Gapurahoster menaikkan limit.
