# Biru Website (website corporate + backend + admin)

Website jasa pembuatan website bergaya corporate biru. Struktur halaman, layout, dan sistem desain mengikuti referensi `greenwebsite.co.id`. Palet hijau diganti biru, dan seluruh naskah, aset, dan identitas ditulis ulang (lihat `docs/REFERENCE_AUDIT.md`).

**Identitas bisnis di proyek ini adalah placeholder** (`Biru Website Indonesia`, email `halo@example.com`, WhatsApp `6280000000000`). Ganti lewat **Admin > Pengaturan** sebelum dipublikasikan. Testimoni sengaja kosong, jadi tambahkan hanya yang asli.

## Fitur
- 8 halaman layanan dinamis, beranda, tentang, portofolio, testimoni, artikel (+detail), kontak, member (segera hadir), kebijakan privasi, syarat & ketentuan.
- Form kontak: validasi server-side, anti-spam (honeypot, token waktu, rate limit), tersimpan di database, email notifikasi (opsional), lanjut ke WhatsApp.
- Admin dashboard `/admin`: pengaturan, halaman & SEO, layanan, fitur layanan, paket harga, portofolio, testimoni, FAQ, artikel, media, pesan masuk, pengguna, log aktivitas.
- SEO: meta + Open Graph + Twitter Card, canonical, JSON-LD (Organization, WebSite, BreadcrumbList, Service, FAQPage, Article), `sitemap.xml`, `robots.txt`.
- Keamanan: CSP ketat, bcrypt, sesi bertanda tangan, CSRF, rate limit, lockout, sanitasi HTML, validasi upload.

## Mulai cepat
```bash
npm install
npm run migrate
npm run seed
node scripts/create-admin.js admin@domain-anda.com "Nama Anda"
npm start          # http://localhost:3000
```
Detail: [INSTALLATION.md](INSTALLATION.md). Produksi: [DEPLOYMENT.md](DEPLOYMENT.md).

## Struktur
```
server.js            titik masuk Express
src/                 config, db (skema+migrasi), security, seo, mailer, routes/, views/ (EJS)
public/              css, js, img (statis)
scripts/             migrate, seed, create-admin, backup, smoke-test
data/                database SQLite + upload + backup (tidak di-commit)
docs/                audit referensi dan desain
```

## Perintah
| Perintah | Fungsi |
|---|---|
| `npm start` | Jalankan server |
| `npm run dev` | Jalankan dengan auto-reload |
| `npm run migrate` / `seed` | Skema / data awal |
| `npm run backup` | Cadangan database + upload |
| `npm test` | Tes asap end-to-end (198 pemeriksaan) |

## Dependency (runtime)
express, ejs, helmet, compression, express-rate-limit, bcryptjs, multer, nodemailer, sanitize-html. Tidak ada build step. Database memakai `node:sqlite` bawaan Node >= 22.13.

## Dokumen
[INSTALLATION](INSTALLATION.md) · [DEPLOYMENT](DEPLOYMENT.md) · [DATABASE](DATABASE.md) · [SECURITY](SECURITY.md) · [SEO_CHECKLIST](SEO_CHECKLIST.md) · [TEST_REPORT](TEST_REPORT.md) · [docs/](docs/)
