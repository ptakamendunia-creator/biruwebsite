# Keamanan

## Yang diterapkan
| Risiko | Penanganan | Lokasi |
|---|---|---|
| XSS | EJS meng-escape semua output; HTML dari admin disanitasi (`sanitize-html`, allowlist); JSON-LD di-escape; CSP `script-src 'self'` (tanpa inline script) | `server.js`, `src/routes/admin.js`, `src/seo.js` |
| CSRF | Token per sesi wajib pada semua POST admin; cookie `SameSite=Lax`; form publik memeriksa `Origin` dan `Sec-Fetch-Site` | `src/security.js` |
| SQL injection | Semua query memakai prepared statement; nama tabel/kolom hanya dari konfigurasi server | `src/routes/*.js`, `src/admin-config.js` |
| Password | bcrypt cost 12; minimal 10 karakter; tidak pernah disimpan atau dicatat dalam teks biasa | `scripts/create-admin.js`, admin |
| Brute force | Rate limit login 10/15 menit/IP; kunci akun 15 menit setelah 5 gagal; waktu respons seragam untuk email tak dikenal | `src/routes/admin.js` |
| Sesi | ID acak 256-bit, cookie bertanda tangan HMAC, `HttpOnly`, `Secure` + prefix `__Host-` di produksi, 8 jam, dirotasi saat login, sesi lain dicabut saat ganti password | `src/security.js` |
| Spam form | Honeypot, token waktu (min 2,5 dtk), rate limit 5/15 menit/IP, validasi server-side, batas panjang | `src/routes/public.js` |
| Upload | Maks 3 MB, validasi *magic bytes* (JPG/PNG/WebP/GIF; SVG tidak diizinkan), nama file acak, disajikan dengan `nosniff` + CSP `sandbox` | `src/routes/admin.js`, `server.js` |
| Header | helmet: CSP, HSTS (produksi), `frame-ancestors 'none'`, `nosniff`, tanpa `X-Powered-By`; admin `no-store` + `noindex` | `server.js` |
| Rahasia | Hanya dari environment (`.env`, di-gitignore); produksi menolak start tanpa `SESSION_SECRET` | `src/config.js` |
| Kebocoran error | Handler error mencatat detail di log server, pengguna hanya melihat pesan umum | `server.js` |
| Audit | Aksi admin dicatat di `audit_log` | `src/security.js` |
| Dependency | `npm audit --omit=dev`: 0 kerentanan saat penyusunan | |

## Yang perlu Anda lakukan
- Jalankan di belakang HTTPS (certbot/Cloudflare) dan atur `TRUST_PROXY=1` agar IP klien dan rate limit akurat.
- Ganti kata sandi admin awal, jangan bagikan akun.
- Jadwalkan `npm run backup` dan simpan salinannya di luar server.
- Batasi akses `/admin` lewat firewall/IP allowlist bila memungkinkan.
- Tinjau Kebijakan Privasi dengan penasihat hukum (UU PDP), termasuk masa simpan data pesan.

## Batasan yang diketahui
- Rate limit disimpan di memori proses (hilang saat restart; tidak berbagi antar-instance).
- Tidak ada autentikasi dua faktor.
- Login tidak memakai CSRF token (dilindungi `SameSite=Lax` + pemeriksaan `Origin`).
- Font dimuat dari Google Fonts (mengirim IP pengunjung ke Google). Host mandiri bila itu penting bagi kebijakan privasi Anda.
- Pemindaian virus pada upload tidak ada (hanya gambar yang divalidasi bentuknya).
