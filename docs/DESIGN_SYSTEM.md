# Design System

Sistem desain referensi dipertahankan. Hanya palet hijau diganti biru. Token ada di `public/css/main.css` (`:root`).

## Warna
| Token | Referensi (hijau) | Proyek (biru) |
|---|---|---|
| `--brand` | `#1d5f4f` | `#1261A0` |
| `--brand-dark` | `#164b3f` | `#0B4778` |
| `--brand-deep` | `#153a31` | `#0A3A62` |
| `--accent` | (tidak ada) | `#36A9E1` |
| `--mint` / light | `#edf6f2` | `#EAF5FC` |
| `--mist` | `#f4f8f6` | `#F3F8FC` |
| `--ink` | `#20332c` | `#172B3A` |
| `--muted` | `#68756f` | `#64748B` |
| `--line` | `#dfe8e3` | `#E2E8F0` |

Kontras: teks utama `#172B3A` di atas putih = 14:1. Putih di atas `#1261A0` = 6.3:1 (lolos AA).

## Tipografi
Manrope, bobot 400-800. H1 46 px / 800 / -0.065em. H2 28 px / 800 / -0.05em. Body 15 px, line-height 1.8. Tombol 12.5 px / 800. Skala menyusut dengan `clamp()` di mobile.

## Bentuk dan jarak
Container 1180 px. Radius kartu 20 px, tombol 13 px. Section padding 88 px (desktop), 56 px (mobile). Shadow `0 24px 64px rgba(11,71,120,.08)` dan versi lembut.

## Komponen
Header sticky + progres scroll, tombol (primary, ghost), kartu layanan, kartu portofolio, badge/eyebrow, kartu paket harga, accordion FAQ (`<details>`), stepper proses, floating WhatsApp, footer 4 kolom, breadcrumb.

## Motion
Easing `cubic-bezier(.22,1,.36,1)`, durasi reveal 700 ms. Dinonaktifkan oleh `prefers-reduced-motion`.
