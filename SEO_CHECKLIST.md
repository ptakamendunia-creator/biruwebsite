# Checklist SEO

Tidak ada jaminan peringkat tertentu. Daftar ini mencakup kualitas teknis dan konten yang dapat Anda kendalikan.

## Teknis (sudah diterapkan, diverifikasi oleh `npm test`)
- [x] URL bersih (`/layanan/company-profile`), satu canonical per halaman
- [x] `sitemap.xml` dinamis (layanan, artikel), `robots.txt` (memblokir `/admin`, `/api/`)
- [x] Title dan meta description unik pada semua halaman, dapat diubah di admin
- [x] Tepat satu H1 per halaman, hierarki H2/H3
- [x] Open Graph + Twitter Card
- [x] JSON-LD: Organization/ProfessionalService, WebSite, BreadcrumbList, Service, FAQPage, Article
- [x] HTML semantik, `lang="id"`, tautan lewati-ke-konten, breadcrumb
- [x] Responsif (tanpa horizontal scroll pada 375 px)
- [x] Admin: `noindex` dan `X-Robots-Tag`
- [x] 404 dan 500 bermerek dengan `noindex`

## Performa
- [x] Tanpa framework JS; JS 5 KB (1,8 KB gzip), CSS 27 KB (6 KB gzip), HTML beranda 9 KB gzip
- [x] Kompresi gzip, cache statis 7 hari (produksi), `font-display: swap`, `preconnect` font
- [x] Reveal/animasi ringan, mati pada `prefers-reduced-motion`
- [ ] Gambar portofolio asli: unggah dalam WebP/AVIF, lebar maks 1200 px (belum ada konversi otomatis)
- [ ] Ukur Lighthouse/PageSpeed pada domain produksi (lihat TEST_REPORT.md)

## Yang harus Anda lengkapi
- [ ] Ganti semua placeholder (nama, alamat, telepon, WhatsApp) agar cocok dengan data Google Business Profile
- [x] Gambar berbagi `og-default.png` (PNG 1200x630, sudah tersedia; ganti dengan foto/merek Anda bila perlu)
- [ ] Verifikasi di Google Search Console + kirim sitemap; Bing Webmaster Tools
- [ ] Buat/klaim Google Business Profile (SEO lokal)
- [ ] Ganti portofolio contoh dan tambahkan testimoni asli (jangan fiktif)
- [ ] Tambahkan analytics sesuai kebijakan privasi Anda

## Pemetaan kata kunci (awal, validasi dengan data pencarian Anda)
| Halaman | Kata kunci utama |
|---|---|
| `/` | jasa pembuatan website profesional |
| `/layanan/company-profile` | jasa website company profile |
| `/layanan/landing-page` | jasa landing page |
| `/layanan/toko-online` | jasa website toko online |
| `/layanan/website-custom` | jasa website custom |
| `/layanan/portal-berita` | jasa website portal berita |
| `/layanan/web-application` | jasa pembuatan web application |
| `/layanan/mobile-app` | jasa pembuatan aplikasi mobile |
| `/layanan/managed-hosting-server` | managed hosting server |
| `/artikel/memilih-jenis-website` | memilih jenis website |
| `/artikel/persiapan-membuat-website` | persiapan membuat website |

Kata kunci hanya hasil pemikiran, bukan riset volume pencarian. Validasi dengan Google Keyword Planner atau Search Console sebelum dijadikan dasar konten.
