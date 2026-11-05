# Laporan Pengujian

Tanggal: 4 November 2026. Lingkungan: Windows 11, Node 24.22, Chrome (built-in browser pane + Lighthouse headless).

## Ringkasan
| Area | Hasil | Cara |
|---|---|---|
| Tes asap end-to-end | **198 lulus, 0 gagal** | `npm test` (database sementara) |
| Lighthouse (beranda) Accessibility | **100** | Lighthouse headless, setelah perbaikan label brand |
| Lighthouse Best Practices | **100** | idem |
| Lighthouse SEO | **100** | idem |
| Lighthouse Performance | **tidak terukur** | Gagal `NO_NAVSTART` pada dua percobaan (masalah alat di mesin ini). Tidak ada skor yang diklaim |
| Audit dependency | 0 kerentanan | `npm audit --omit=dev` (nodemailer dan ejs dinaikkan, multer ke 2.x) |
| Boot produksi | Lulus | HSTS dan CSP aktif, menolak start tanpa `SESSION_SECRET` |
| Form kontak di browser | Lulus | Dikirim lewat UI nyata, tersimpan, tautan WhatsApp muncul |
| Overflow horizontal 375 px | Tidak ada | Beranda, layanan, kontak, portofolio |
| Overflow horizontal 768 px | Tidak ada | Beranda, tentang, 2 layanan, kontak, artikel, privasi |
| Menu mobile | Berfungsi | Dibuka, 7 item tampil |
| Console error | Tidak ada | |

## Cakupan tes asap
- 9 halaman statis, 8 halaman layanan, 3 artikel: status 200, `<title>`, meta description, tepat satu H1, canonical + JSON-LD, tanpa sisa identitas hijau/referensi.
- Seluruh tautan internal yang muncul di halaman: valid.
- 404, `sitemap.xml`, `robots.txt`, aset statis, header keamanan (CSP, nosniff, frame-ancestors, tanpa X-Powered-By).
- Form kontak: anti-bot (terlalu cepat, honeypot), validasi server-side, tersimpan, lintas-origin ditolak, rate limit.
- Admin: akses tanpa login dialihkan, login salah/benar, cookie HttpOnly, semua halaman admin 200, POST tanpa CSRF ditolak, CRUD (buat/ubah/hapus), validasi slug, XSS pada artikel dan pengaturan dinetralkan, upload file palsu ditolak, PNG asli diterima, path traversal ditolak, akun terkunci setelah 5 kegagalan.

## Ukuran (proxy performa, bukan skor)
HTML beranda 48 KB (8,9 KB gzip), CSS 27 KB (6,2 KB gzip), JS 5,4 KB (1,9 KB gzip), tanpa framework dan tanpa gambar raster. Satu-satunya sumber eksternal adalah Google Fonts.

## Belum terverifikasi / keterbatasan
- **Skor performa dan Core Web Vitals**: ukur di domain produksi lewat PageSpeed Insights.
- **Perbandingan visual dengan referensi** dilakukan secara kualitatif: beranda (800 dan 1280 px) dan hero halaman layanan (1280 px). Tidak ada *pixel diff*. Dari perbandingan itu hero layanan disamakan (mock browser, poin, strip industri, anchor #harga). Halaman kontak, portofolio, artikel, dan legal dibandingkan dari struktur heading/CSS saja, bukan screenshot berdampingan.
- Tablet (768 px): tidak ada overflow horizontal di 7 halaman yang diperiksa, hero layanan diperiksa visual. Halaman lain belum dilihat visual di tablet. Mobile (375 px) hanya diperiksa overflow dan menu.
- **Email SMTP** belum diuji (tanpa kredensial). Jalur "tanpa SMTP" teruji (pesan tersimpan, notifikasi dilewati).
- **Admin diuji lewat HTTP**, tampilan visualnya tidak diperiksa di browser karena panel browser tersembunyi saat pengujian.
- Animasi reveal/marquee/float diperiksa bekerja, tetapi kehalusan tidak diukur.
- Isi layanan selain Company Profile, Landing Page, dan Toko Online lebih ringkas daripada referensi (naskah ditulis ulang, bukan disalin).
- Tidak ada Member Area fungsional (referensi juga belum).

---

# Versi PHP + MySQL (arsip: tidak dipelihara lagi, proyek memakai Node)

Tes: `cd php && PHP_BIN=<php 8.1> node tests/smoke.js` → **239 lulus, 0 gagal** (PHP 8.1.34 CLI server, database SQLite sementara).

| Pemeriksaan | Hasil |
|---|---|
| Lint seluruh 53 berkas PHP (`php -l`) | Lulus |
| 20 halaman publik: 200, title, meta description, 1 H1, canonical + JSON-LD, tanpa sisa identitas hijau, tanpa pesan error PHP | Lulus |
| Tautan internal, 404, normalisasi garis miring (301), sitemap, robots, aset | Lulus |
| Header keamanan (CSP, nosniff, frame-ancestors, tanpa X-Powered-By), installer terkunci setelah pasang | Lulus |
| Form kontak: terlalu cepat, honeypot, token palsu, validasi, tersimpan, lintas-origin, rate limit | Lulus |
| Admin: 19 halaman + 7 daftar resource, CSRF, lintas-origin, CRUD, slug tidak valid/duplikat (422), XSS artikel & pengaturan, edit SEO, status pesan | Lulus |
| Unggahan: file palsu ditolak, PNG asli diterima, berkas terhapus bersama media, path traversal & akses `/app` ditolak | Lulus |
| Hash bcrypt buatan Node dapat dipakai login di PHP; editor tidak dapat membuka Pengguna/Log | Lulus |
| Kunci akun setelah 5 kegagalan | Lulus |
| Browser nyata: beranda (warna #1261A0, tanpa overflow, tanpa console error), login admin → dashboard (sidebar, ikon, statistik) | Lulus (via DOM; screenshot gagal karena panel tersembunyi) |

**Bug yang ditemukan tes dan sudah diperbaiki:** `ld_json()` tidak meng-escape `<`, sehingga nama situs berisi `</script>` dapat keluar dari blok JSON-LD (XSS). Kini memakai `JSON_HEX_TAG|AMP|APOS`.

## Belum terverifikasi (versi PHP)
- **Seluruh jalur MySQL**: tidak ada server MySQL di mesin pengembangan. Skema `mysql.sql`, driver `pdo_mysql`, dan perilaku mode ketat MySQL belum pernah dijalankan. Tes memakai SQLite dengan kode aplikasi yang sama.
- `mail()` pada hosting sungguhan, dan `.htaccess` pada Apache sungguhan (tes memakai `php -S` dengan `router.php`, bukan Apache; aturan rewrite, proteksi `app/` dan `uploads/` belum diuji).
- Skor performa, perbandingan visual berdampingan, dan tampilan admin di berbagai lebar layar (hanya DOM/gaya yang diperiksa).
