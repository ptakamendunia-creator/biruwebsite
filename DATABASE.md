# Database

SQLite (`node:sqlite`), mode WAL, `foreign_keys=ON`. Skema dan migrasi ada di `src/db.js` (daftar `MIGRATIONS`). Migrasi dicatat di `schema_migrations` dan dijalankan otomatis saat start atau lewat `npm run migrate`. Untuk perubahan skema, **tambahkan migrasi baru**, jangan mengubah yang lama.

## Tabel
| Tabel | Isi |
|---|---|
| `settings` | key/value: identitas, kontak, hero, media sosial |
| `pages` | meta SEO per halaman + isi dokumen legal (`body_html`) |
| `services` | 8 layanan (slug, hero, intro, meta SEO) |
| `service_items` | `audience` / `feature` / `step` per layanan |
| `packages` | paket harga per layanan (`price_label` teks bebas) |
| `portfolio` | proyek (kategori, industri, gambar, nada warna) |
| `testimonials` | testimoni (rating 1-5) |
| `faqs` | pertanyaan umum |
| `articles` | artikel (slug, body HTML tersanitasi, tanggal) |
| `inquiries` | pesan form kontak (status: baru, dibaca, selesai, spam) |
| `media` | metadata file upload |
| `users` | admin/editor (hash bcrypt, penghitung gagal login, kunci) |
| `sessions` | sesi login (id acak, token CSRF, kedaluwarsa) |
| `audit_log` | jejak aksi admin |

Relasi: `service_items.service_id` dan `packages.service_id` mengacu ke `services(id)` dengan `ON DELETE CASCADE`. `sessions.user_id` mengacu ke `users(id)` dengan `ON DELETE CASCADE`.

## Seed
`npm run seed` mengisi pengaturan, halaman, layanan (+ fitur dan paket), 8 portofolio contoh, 5 FAQ, 3 artikel. Tabel yang sudah berisi tidak ditimpa. **Testimoni sengaja tidak diisi.** Portofolio contoh berlabel "Contoh" dan dapat dihapus.

## Operasi
- Cadangan: `npm run backup` (`VACUUM INTO`, konsisten walau server berjalan).
- Lihat data: `sqlite3 data/site.db` atau alat seperti DB Browser for SQLite.
- Reset total: hentikan server, hapus `data/site.db*`, jalankan `migrate`, `seed`, `create-admin`.
