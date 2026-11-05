# Instalasi

## Prasyarat
- Node.js **22.13 atau lebih baru** (diuji pada 24). Tidak perlu MySQL/PHP.
- npm.

## Langkah
1. `npm install`
2. Salin `.env.example` menjadi `.env`. Untuk lokal cukup biarkan kosong. Untuk produksi lihat [DEPLOYMENT.md](DEPLOYMENT.md).
3. `npm run migrate` membuat database di `data/site.db`.
4. `npm run seed` mengisi konten awal (aman dijalankan ulang, tidak menimpa data yang sudah ada).
5. Buat admin pertama:
   ```bash
   node scripts/create-admin.js admin@domain-anda.com "Nama Anda"
   ```
   Tanpa `ADMIN_PASSWORD`, kata sandi acak dicetak sekali. Simpan, lalu ganti di **Admin > Akun saya**. Untuk menentukan sendiri (min. 10 karakter) tanpa meninggalkan jejak di riwayat shell, atur variabel lingkungan `ADMIN_PASSWORD` untuk satu perintah itu saja.
6. `npm start` lalu buka `http://localhost:3000` (admin di `/admin`).

## Konfigurasi setelah pertama jalan
1. **Admin > Pengaturan**: nama bisnis, email, WhatsApp, alamat, jam kerja, media sosial.
2. **Admin > Halaman & SEO**: meta title/description tiap halaman. Tinjau dokumen legal bersama penasihat hukum.
3. **Admin > Layanan / Paket harga**: isi harga yang sebenarnya (default "Hubungi kami").
4. **Admin > Portofolio / Testimoni**: ganti contoh dengan proyek dan testimoni asli (portofolio contoh berlabel "Contoh").
5. **Admin > Media**: unggah gambar, lalu pilih pada form.
6. Ganti `public/img/og-default.png` dengan gambar PNG/JPG 1200x630 milik Anda agar pratinjau media sosial tampil di semua platform (banyak platform tidak menampilkan SVG). Unggah lewat Media lalu pilih sebagai "Gambar berbagi" per halaman.

## Email notifikasi (opsional)
Isi `SMTP_*`, `MAIL_FROM`, `MAIL_TO` di `.env`. Tanpa SMTP, pesan tetap tersimpan di **Admin > Pesan masuk** dan peringatan tampil di dashboard.

## Admin
Peran `admin` (penuh) dan `editor` (konten, tanpa pengguna/log). Panduan lengkap penggunaan ada pada menu masing-masing, dan setiap field memiliki keterangan bantuan.

## Backup dan restore
- Backup: `npm run backup` (membuat `data/backups/<waktu>/site.db` + `uploads/`, menyimpan 14 terakhir). Jadwalkan harian lewat cron/Task Scheduler.
- Restore: hentikan server, salin `site.db` dari folder backup ke `data/site.db` (hapus `site.db-wal` dan `site.db-shm` jika ada), salin `uploads/` ke `data/uploads/`, jalankan server.
- Simpan salinan backup di luar server.

## Pemeliharaan
- `npm audit --omit=dev` secara berkala, `npm update` lalu `npm test`.
- Pantau `GET /healthz`.
- Tinjau **Admin > Log aktivitas** dan pesan berstatus spam.
- Saat mengubah `public/css/main.css` atau `public/js/main.js`, naikkan `?v=` pada `partials/head.ejs` dan `partials/footer.ejs` agar cache peramban diperbarui.
