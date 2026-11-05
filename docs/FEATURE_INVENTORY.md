# Inventaris Fitur

## Terlihat di referensi dan diimplementasikan
- Navigasi sticky dengan dropdown Layanan, tombol Login Member, menu mobile.
- Strip klien bergerak (marquee), diganti strip industri karena logo klien milik pihak lain.
- Hero dengan mockup dashboard dan kartu melayang.
- 8 halaman layanan dengan paket (3 tingkat) dan FAQ.
- Portofolio dengan kategori.
- Artikel + detail artikel.
- FAQ (accordion).
- Form kontak.
- Floating tombol WhatsApp dan CTA WhatsApp per layanan.
- Halaman legal, halaman member "segera hadir".
- JSON-LD, sitemap, robots, meta per halaman.

## Ditambahkan sesuai brief (tidak terlihat di referensi)
- Database SQLite + migrasi + seed.
- Admin dashboard: pengaturan, halaman/SEO, layanan, fitur layanan, paket, portofolio, testimoni, FAQ, artikel, media, pesan masuk, pengguna.
- Form kontak tersimpan di database + email notifikasi (SMTP opsional).
- Autentikasi admin: bcrypt, sesi aman, CSRF, rate limit, lockout.
- Halaman `/testimoni`.
- Log audit admin, backup database.

## Tidak diimplementasikan
- Member Area (referensi juga belum, jadwal 1 November 2026 di sana). Halaman "segera hadir" dibuat.
- Pembayaran, hosting, dan layanan lain yang hanya diiklankan.
- Analytics. Tambahkan ID sendiri lewat Pengaturan jika perlu.
