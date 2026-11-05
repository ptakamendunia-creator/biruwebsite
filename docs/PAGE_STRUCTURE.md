# Struktur Halaman

Sitemap referensi (16 URL) dan padanannya di proyek ini.

| URL referensi | URL proyek | Catatan |
|---|---|---|
| `/` | `/` | Hero, klien/industri, tentang, 8 layanan, portofolio, pendekatan, proses, after sales, artikel, FAQ, CTA |
| `/tentang-kami` | `/tentang-kami` | Hero, cerita, layanan, proses 5 tahap, tim, standar |
| `/layanan/company-profile` | sama | Halaman layanan dinamis |
| `/layanan/landing-page` | sama | |
| `/layanan/toko-online` | sama | |
| `/layanan/website-custom` | sama | |
| `/layanan/portal-berita` | sama | |
| `/layanan/web-application` | sama | |
| `/layanan/mobile-app` | sama | |
| `/layanan/managed-hosting-server` | sama | |
| `/portofolio` | `/portofolio` | Grid + filter kategori |
| `/artikel` | `/artikel` | Daftar artikel |
| `/artikel/{slug}` x3 | `/artikel/{slug}` | Detail artikel dari database |
| `/kontak` | `/kontak` | Form tersimpan ke database + tautan WhatsApp |
| `/member` | `/member` | Halaman "segera hadir" (sama seperti referensi) |
| `/kebijakan-privasi` | sama | Isi dapat diedit di admin |
| `/syarat-ketentuan` | sama | Isi dapat diedit di admin |
| (tidak ada) | `/testimoni` | Diminta pada brief, referensi menampilkannya hanya sebagai bagian |
| (tidak ada) | `/admin/*` | Dashboard admin |
| (tidak ada) | `/sitemap.xml`, `/robots.txt` | Dihasilkan dinamis |

## Komponen halaman layanan (template tunggal)
Hero + CTA, strip industri, intro, kartu "use case" (`audience`), kartu fitur (`feature`), langkah (`step`), paket harga, contoh proyek, FAQ, CTA akhir.
