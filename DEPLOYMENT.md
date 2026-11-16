# Deployment

Aplikasi adalah satu proses Node.js dengan database SQLite berbasis berkas. Platform yang sudah dipakai: **hosting cPanel Gapurahoster (menu Node.js)**. Alternatif: VPS atau hosting lain yang mendukung Node 22.13+.

## Gapurahoster (cPanel Node.js) — yang sedang dipakai
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
Setelah disiapkan satu kali, revisi cukup: **buat branch -> Pull Request -> tes CI lulus -> Merge**. Workflow `.github/workflows/deploy.yml` lalu mengunggah file ke hosting dan me-restart aplikasi.

Penyiapan satu kali:
1. Di cPanel > **FTP Accounts**, buat akun FTP khusus yang terbatas pada folder aplikasi (`domains/biruwebsite.my.id/app`).
2. Di GitHub: **Settings > Environments > New environment** bernama `production` (opsional: aktifkan *Required reviewers* sebagai persetujuan akhir). Tambahkan *secrets* di environment itu:
   | Secret | Isi |
   |---|---|
   | `FTP_SERVER` | host FTP dari cPanel (mis. `ftp.biruwebsite.my.id`) |
   | `FTP_USERNAME` / `FTP_PASSWORD` | akun FTP di atas |
   | `FTP_APP_DIR` | folder aplikasi, mis. `domains/biruwebsite.my.id/app/` (diakhiri `/`) |
3. **Settings > Branches**: lindungi `master` (wajib Pull Request dan status check `node` lulus).

Catatan:
- `data/`, `.env`, dan `node_modules/` tidak pernah disentuh oleh deploy, jadi database dan unggahan aman.
- Bila `package.json` berubah (dependensi baru), buka cPanel > Node.js dan klik **Run NPM Install** satu kali.
- Rollback: *revert* PR di GitHub, lalu merge; deploy berjalan lagi.
- Deploy manual: tab **Actions > Deploy > Run workflow**.

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
