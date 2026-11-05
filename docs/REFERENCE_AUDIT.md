# Audit Website Referensi

Referensi: https://greenwebsite.co.id/ (diaudit 4 November 2026 melalui browser, hanya data publik).

## Ringkasan
Situs agensi pembuatan website dengan 16 URL publik. Halaman kontak punya satu form (diteruskan ke WhatsApp). Halaman `/member` hanya "segera hadir". Tidak ada form lain, modal, atau area login yang berfungsi di sisi publik.

## Metode
- Membuka beranda, membaca teks, mengambil screenshot per bagian.
- Mengambil daftar tautan, stylesheet, dan script dari DOM.
- Mengambil `sitemap.xml`, `robots.txt`, dan heading + meta tiap halaman.
- Membaca CSS variable dan computed style elemen utama.

## Temuan utama
| Aspek | Temuan |
|---|---|
| Font | Manrope 400-800 (Google Fonts), fallback Inter/Arial |
| Warna | Hijau tua `#1d5f4f` + putih + mint `#edf6f2`, teks `#20332c`, garis `#dfe8e3` |
| Container | 1180 px |
| Radius | kartu 17-20 px, tombol 13 px |
| Shadow | `0 24px 64px rgba(27,67,53,.08)` dan versi lembut |
| H1 / H2 | 46 px / 28 px, bobot 800, letter-spacing negatif (sekitar -0.06em / -0.05em) |
| Header | sticky, putih 97%, tinggi 79 px, garis progres scroll, tombol "Login Member" |
| Tombol | tinggi 48 px, bobot 800, ukuran 12.5 px |
| Floating | tombol WhatsApp melayang kanan bawah |
| Analytics | Google Tag Manager `gtag` (G-8ZDJVSHMYY) milik referensi, **tidak dipakai** di proyek ini |
| SEO | title + meta description per halaman, JSON-LD di hampir semua halaman, sitemap + robots |

## Bagian yang tidak dapat diverifikasi
- Backend, database, dan framework: tidak ada bukti dari tampilan publik.
- Detail animasi scroll (durasi variabel `--gw-slow: 880ms`, easing `cubic-bezier(.22,1,.36,1)` terlihat di CSS, dipakai sebagai acuan).
- Isi lengkap tiga artikel, tabel paket (nama paket terlihat, rincian harga tidak diperiksa satu per satu).
- Halaman layanan dibaca melalui heading dan meta, bukan screenshot satu per satu.

## Keputusan hak cipta dan identitas
Proyek ini meniru **struktur, layout, dan sistem desain**. Yang tidak disalin:
- Nama, logo, dan alamat perusahaan referensi.
- Teks naskah (semua copy ditulis ulang).
- Daftar klien dan portofolio nyata (logo Toyota, Indosat, kementerian, dll.). Diganti contoh proyek orisinal berlabel "contoh".
- Nomor WhatsApp, email, ID analytics referensi.

Identitas bisnis di proyek ini adalah **placeholder** (`Biru Website Indonesia`) dan diganti lewat Admin > Pengaturan.
