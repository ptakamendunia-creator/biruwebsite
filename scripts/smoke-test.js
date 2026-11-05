// Tes asap end-to-end. Memakai database & folder upload sementara, tidak menyentuh data asli.
// Jalankan: npm test
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'site-test-'));
process.env.DB_PATH = path.join(tmp, 'test.db');
process.env.UPLOAD_DIR = path.join(tmp, 'uploads');
process.env.SITE_URL = 'http://127.0.0.1:0';
process.env.NODE_ENV = 'test';

const bcrypt = require('bcryptjs');
const { db, migrate } = require('../src/db');
migrate();
require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'seed.js')], { env: process.env, stdio: 'ignore' });

const PASS = crypto.randomBytes(12).toString('base64url');
db.prepare("INSERT INTO users (email,name,password_hash,role) VALUES ('tester@example.test','Tester',?, 'admin')").run(bcrypt.hashSync(PASS, 10));

process.env.NO_LISTEN = '1';
const app = require('../server');
let passed = 0, failed = 0;
const ok = (cond, name, extra = '') => { if (cond) { passed++; console.log('  ok   ', name); } else { failed++; console.log('  FAIL ', name, extra); } };

(async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = '';
  const req = async (p, opt = {}) => {
    const res = await fetch(base + p, { redirect: 'manual', ...opt, headers: { ...(cookie ? { cookie } : {}), ...(opt.headers || {}) } });
    const sc = res.headers.getSetCookie?.() || [];
    for (const c of sc) { const kv = c.split(';')[0]; if (kv.endsWith('=')) cookie = ''; else cookie = kv; }
    return res;
  };
  const text = async (p, o) => { const r = await req(p, o); return { r, t: await r.text() }; };
  const form = (o) => ({ method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', origin: base }, body: new URLSearchParams(o).toString() });

  console.log('\n[Halaman publik]');
  const paths = ['/', '/tentang-kami', '/portofolio', '/testimoni', '/artikel', '/kontak', '/member', '/kebijakan-privasi', '/syarat-ketentuan'];
  for (const s of db.prepare('SELECT slug FROM services').all()) paths.push('/layanan/' + s.slug);
  for (const a of db.prepare('SELECT slug FROM articles').all()) paths.push('/artikel/' + a.slug);
  const seen = new Set();
  for (const p of paths) {
    const { r, t } = await text(p);
    ok(r.status === 200, `GET ${p} = 200`, r.status);
    ok(/<title>[^<]{10,}<\/title>/.test(t), `${p} punya <title>`);
    ok(/<meta name="description" content="[^"]{30,}"/.test(t), `${p} punya meta description`);
    ok((t.match(/<h1[\s>]/g) || []).length === 1, `${p} tepat satu H1`);
    ok(/<link rel="canonical"/.test(t) && /application\/ld\+json/.test(t), `${p} canonical + JSON-LD`);
    ok(!/#1d5f4f|#174d40|greenwebsite/i.test(t), `${p} bebas sisa identitas hijau/referensi`);
    // semua link internal valid
    for (const m of t.matchAll(/href="(\/[^"#?]*)/g)) seen.add(m[1]);
  }
  for (const l of seen) {
    if (/^\/(css|js|img|uploads)\//.test(l) || l === '/') continue;
    const r = await req(l);
    ok(r.status === 200, `link internal ${l} valid`, r.status);
  }
  ok((await req('/tidak-ada')).status === 404, '404 untuk halaman tidak ada');
  const sm = await text('/sitemap.xml');
  ok(sm.r.status === 200 && sm.t.includes('/layanan/company-profile') && !sm.t.includes('/admin'), 'sitemap.xml valid');
  const rb = await text('/robots.txt');
  ok(rb.t.includes('Sitemap:') && rb.t.includes('Disallow: /admin'), 'robots.txt valid');
  for (const f of ['/css/main.css', '/js/main.js', '/img/logo.png', '/img/og-default.png', '/img/portfolio/1.svg', '/css/admin.css']) ok((await req(f)).status === 200, `aset ${f}`);

  console.log('\n[Header keamanan]');
  const h = (await req('/')).headers;
  ok(/script-src 'self'/.test(h.get('content-security-policy') || ''), 'CSP script-src self');
  ok(h.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options');
  ok(!h.get('x-powered-by'), 'tanpa X-Powered-By');
  ok(/frame-ancestors 'none'/.test(h.get('content-security-policy') || ''), 'anti-clickjacking');
  // Font lokal: tidak ada sumber eksternal, file font tersedia, dan CSP tidak membuka Google Fonts.
  const csp = h.get('content-security-policy') || '';
  ok(!/googleapis|gstatic/.test(csp), 'CSP tanpa Google Fonts');
  const homeHtml = await (await req('/')).text();
  ok(!/fonts\.(googleapis|gstatic)/.test(homeHtml), 'beranda tidak memuat font eksternal');
  for (const f of ['plus-jakarta-sans-latin', 'plus-jakarta-sans-latin-ext']) {
    const fr = await req(`/fonts/${f}.woff2`);
    ok(fr.status === 200 && (fr.headers.get('content-type') || '').includes('woff2'), `font lokal ${f} tersaji`);
  }
  const lg = await req('/img/logo.png');
  ok(lg.status === 200 && (await lg.arrayBuffer()).byteLength < 40 * 1024, 'logo.png ringan (< 40 KB)');

  console.log('\n[Form kontak]');
  const token = (await text('/kontak')).t.match(/name="t" value="([^"]+)"/)[1];
  const post = (body, hdr = {}) => req('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin: base, ...hdr }, body: JSON.stringify(body) });
  const tooFast = await (await post({ name: 'Budi', email: 'budi@example.test', message: 'Halo saya butuh website', t: token })).json();
  ok(tooFast.ok === true && db.prepare('SELECT COUNT(*) c FROM inquiries').get().c === 0, 'pengiriman terlalu cepat diabaikan (anti-bot)');
  await new Promise(r => setTimeout(r, 2700));
  const bad = await post({ name: 'B', email: 'salah', message: 'pendek', t: token });
  ok(bad.status === 422 && (await bad.json()).errors.email, 'validasi server-side menolak input salah');
  const hp = await (await post({ name: 'Bot', email: 'bot@example.test', message: 'pesan spam panjang sekali', website: 'x', t: token })).json();
  ok(hp.ok === true && db.prepare('SELECT COUNT(*) c FROM inquiries').get().c === 0, 'honeypot terisi tidak disimpan');
  const good = await (await post({ name: 'Budi Santoso', email: 'budi@example.test', phone: '0812 3456 7890', service: 'Website Company Profile', message: 'Saya ingin membuat company profile.', t: token })).json();
  ok(good.ok === true && good.whatsapp?.startsWith('https://wa.me/'), 'form valid tersimpan + tautan WhatsApp');
  ok(db.prepare('SELECT COUNT(*) c FROM inquiries').get().c === 1, 'pesan masuk database');
  const xs = await post({ name: 'X', email: 'x@example.test', message: 'lintas situs' }, { origin: 'https://evil.example' });
  ok(xs.status === 403, 'POST lintas-origin ditolak');
  // Regresi: form POST same-origin dapat membawa "Origin: null" (Referrer-Policy ketat). Harus lolos hanya bila Sec-Fetch-Site same-origin.
  const lf = (h) => fetch(base + '/admin/login', { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded', ...h }, body: 'email=tidak-ada%40example.test&password=salahsalah' });
  ok((await lf({ origin: 'null', 'sec-fetch-site': 'same-origin' })).status === 401, 'Origin null + same-origin diterima (lanjut ke pengecekan sandi)');
  ok((await lf({ origin: 'null' })).status === 403, 'Origin null tanpa Sec-Fetch-Site ditolak');
  ok((await lf({ origin: 'null', 'sec-fetch-site': 'cross-site' })).status === 403, 'Origin null + cross-site ditolak');
  // rate limit: batas 5 per 15 menit
  let limited = false;
  for (let i = 0; i < 8; i++) { const r = await post({ name: 'Spam', email: 's@example.test', message: 'pesan pengulangan ke ' + i, t: token }); if (r.status === 429) limited = true; }
  ok(limited, 'rate limit aktif pada form kontak');

  console.log('\n[Admin]');
  ok((await req('/admin')).status === 302, '/admin tanpa login dialihkan');
  ok((await req('/admin/r/services')).status === 302, '/admin/r/services tanpa login dialihkan');
  const wrong = await req('/admin/login', form({ email: 'tester@example.test', password: 'salah-salah-1' }));
  ok(wrong.status === 401, 'login salah ditolak');
  const login = await req('/admin/login', form({ email: 'tester@example.test', password: PASS }));
  ok(login.status === 302 && /sid=/.test(cookie), 'login benar membuat sesi');
  const dash = await text('/admin');
  ok(dash.r.status === 200 && dash.t.includes('Ringkasan'), 'dashboard terbuka');
  ok(/HttpOnly/i.test((await fetch(base + '/admin/login', { redirect: 'manual', ...form({ email: 'tester@example.test', password: PASS }) })).headers.get('set-cookie') || ''), 'cookie sesi HttpOnly');
  const csrf = dash.t.match(/name="_csrf" value="([^"]+)"/)[1];

  for (const p of ['/admin/settings', '/admin/pages', '/admin/pages/home', '/admin/pages/kebijakan-privasi', '/admin/inquiries', '/admin/media', '/admin/users', '/admin/audit', '/admin/account', '/admin/r/services/new', '/admin/r/packages/new', '/admin/r/service-items/new', '/admin/r/portfolio/new', '/admin/r/testimonials/new', '/admin/r/faqs/new', '/admin/r/articles/new']) {
    ok((await req(p)).status === 200, `admin GET ${p}`);
  }
  for (const k of ['services', 'service-items', 'packages', 'portfolio', 'testimonials', 'faqs', 'articles']) ok((await req('/admin/r/' + k)).status === 200, `admin list ${k}`);

  const noCsrf = await req('/admin/r/faqs/new', form({ question: 'Tes?', answer: 'Jawaban uji.' }));
  ok(noCsrf.status === 403, 'POST admin tanpa CSRF ditolak');

  const created = await req('/admin/r/faqs/new', form({ _csrf: csrf, question: 'Pertanyaan uji?', answer: 'Jawaban uji.', sort: '9', published: '1' }));
  ok(created.status === 302 && db.prepare("SELECT COUNT(*) c FROM faqs WHERE question='Pertanyaan uji?'").get().c === 1, 'CRUD: buat FAQ');
  ok((await text('/')).t.includes('Pertanyaan uji?'), 'FAQ baru tampil di website');
  const id = db.prepare("SELECT id FROM faqs WHERE question='Pertanyaan uji?'").get().id;
  await req(`/admin/r/faqs/${id}`, form({ _csrf: csrf, question: 'Pertanyaan diubah?', answer: 'Jawaban.', sort: '9', published: '1' }));
  ok(db.prepare('SELECT question FROM faqs WHERE id=?').get(id).question === 'Pertanyaan diubah?', 'CRUD: ubah FAQ');
  const invalid = await req('/admin/r/services/new', form({ _csrf: csrf, name: 'X', slug: 'Slug Salah!', hero_title: 'H', icon: 'globe' }));
  ok(invalid.status === 422, 'validasi slug server-side');
  // XSS: konten HTML disanitasi
  await req('/admin/r/articles/new', form({ _csrf: csrf, title: 'Artikel XSS', slug: 'artikel-xss', body_html: '<p>Aman</p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">x</a>', published_at: '2026-01-01', published: '1' }));
  const xss = (await text('/artikel/artikel-xss')).t;
  ok(xss.includes('<p>Aman</p>') && !/<script>alert|onerror|javascript:/i.test(xss), 'XSS pada body artikel dinetralkan');
  // XSS: nilai pengaturan di-escape
  await req('/admin/settings', form({ _csrf: csrf, site_name: 'Biru <script>alert(1)</script>' }));
  ok(!(await text('/')).t.includes('<script>alert(1)</script>'), 'nilai pengaturan di-escape di halaman');
  await req('/admin/settings', form({ _csrf: csrf, site_name: 'Biru Website Indonesia' }));
  await req(`/admin/r/faqs/${id}/delete`, form({ _csrf: csrf }));
  ok(db.prepare('SELECT COUNT(*) c FROM faqs WHERE id=?').get(id).c === 0, 'CRUD: hapus FAQ');

  // Upload: tolak file palsu, terima PNG asli
  const up = async (buf, name) => {
    const fd = new FormData(); fd.append('file', new Blob([buf]), name);
    return req('/admin/media?_csrf=' + encodeURIComponent(csrf), { method: 'POST', body: fd });
  };
  await up(Buffer.from('<?php echo 1; ?>'), 'shell.png');
  ok(db.prepare('SELECT COUNT(*) c FROM media').get().c === 0, 'upload file palsu (ekstensi png, isi php) ditolak');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGD4DwABBAEAHdLYdQAAAABJRU5ErkJggg==', 'base64');
  await up(png, 'ok.png');
  const m = db.prepare('SELECT filename FROM media').get();
  ok(!!m && (await req('/uploads/' + m.filename)).status === 200, 'upload PNG valid diterima & dapat diakses');
  ok((await req('/uploads/..%2f..%2fsite.db')).status !== 200, 'path traversal pada /uploads ditolak');

  // Lockout
  cookie = '';
  for (let i = 0; i < 5; i++) await req('/admin/login', form({ email: 'tester@example.test', password: 'salah-salah-' + i }));
  const locked = await req('/admin/login', form({ email: 'tester@example.test', password: PASS }));
  ok(locked.status === 401, 'akun terkunci setelah 5 kegagalan (kata sandi benar pun ditolak)');

  server.close();
  try { db.close(); fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* Windows dapat menahan berkas sementara */ }
  console.log(`\nHasil: ${passed} lulus, ${failed} gagal`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
