# Analisis Teknologi

## Referensi (hanya yang dapat dibuktikan)
- Google Fonts (Manrope) dan Google Tag Manager terlihat langsung di HTML.
- HTML dirender server (konten terbaca tanpa menjalankan JS dalam fetch), `sitemap.xml` berformat namespace `ns0` yang biasa dihasilkan pustaka XML Python. Ini indikasi lemah, bukan bukti framework.
- Backend, database, hosting: **tidak dapat dipastikan** dari tampilan publik.

## Stack proyek ini (pilihan sendiri, bukan klaim tentang referensi)
| Lapisan | Pilihan | Alasan |
|---|---|---|
| Runtime | Node.js >= 22.13 | Sudah terpasang di mesin ini |
| Server | Express 4, EJS | Render server = SEO baik, tanpa build step |
| Database | SQLite (`node:sqlite` bawaan Node) | Tanpa server DB, tanpa kompilasi native, mudah di-backup. Mesin ini tidak punya MySQL/PHP |
| Frontend | HTML semantik, CSS murni, JS vanilla | Ringan, tanpa dependency berlebih |
| Keamanan | helmet, express-rate-limit, bcryptjs, sanitize-html, CSRF dan sesi buatan sendiri | |
| Email | nodemailer (SMTP opsional) | |
| Upload | multer 2 + cek magic bytes | |

Batasan: SQLite cocok untuk trafik situs company profile (ratusan ribu kunjungan/bulan). Untuk beban tulis tinggi atau banyak instance, migrasikan ke PostgreSQL/MySQL (skema di `DATABASE.md` portabel).
