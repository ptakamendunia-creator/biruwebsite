const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');
const config = require('../config');
const { db } = require('../db');
const security = require('../security');
const { RESOURCES, SETTING_FIELDS, PAGE_LABELS } = require('../admin-config');

const router = express.Router();
const all = (sql, ...p) => db.prepare(sql).all(...p);
const get = (sql, ...p) => db.prepare(sql).get(...p);
const run = (sql, ...p) => db.prepare(sql).run(...p);

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.locals.page = { ...res.locals.page, noindex: true };
  res.locals.flash = null;
  res.locals.resources = RESOURCES;
  res.locals.active = '';
  next();
});

const HTML_OPTS = {
  allowedTags: ['h2', 'h3', 'h4', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a', 'blockquote', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'code', 'pre'],
  allowedAttributes: { a: ['href', 'title', 'target', 'rel'], img: ['src', 'alt', 'width', 'height', 'loading'] },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  transformTags: { a: (tag, attribs) => ({ tagName: 'a', attribs: { ...attribs, ...(attribs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}) } }) }
};

function flashRedirect(req, res, url, msg, type = 'ok') {
  const q = new URLSearchParams({ m: msg, t: type });
  res.redirect(url + (url.includes('?') ? '&' : '?') + q);
}
router.use((req, res, next) => {
  if (req.query.m) res.locals.flash = { text: String(req.query.m).slice(0, 200), type: req.query.t === 'err' ? 'err' : 'ok' };
  next();
});

// ---------- Login / logout ----------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, skipSuccessfulRequests: true,
  handler: (req, res) => res.status(429).render('admin/login', { error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.', email: '', next: '' })
});

router.get('/login', (req, res) => {
  if (req.session) return res.redirect('/admin');
  res.render('admin/login', { error: '', email: '', next: '' });
});

// Dummy hash agar waktu respons sama untuk email yang tidak ada.
const DUMMY = bcrypt.hashSync('dummy-password-for-timing', 12);

router.post('/login', security.sameOrigin, loginLimiter, (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase().slice(0, 150);
  const password = String(req.body.password || '').slice(0, 200);
  const user = get('SELECT * FROM users WHERE email = ?', email);
  const fail = (msg) => res.status(401).render('admin/login', { error: msg, email, next: '' });

  if (user && user.locked_until > Date.now()) {
    bcrypt.compareSync(password, DUMMY);
    return fail('Akun dikunci sementara karena terlalu banyak percobaan. Coba lagi nanti.');
  }
  const ok = bcrypt.compareSync(password, user ? user.password_hash : DUMMY);
  if (!user || !ok) {
    if (user) {
      const n = user.failed_logins + 1;
      run('UPDATE users SET failed_logins = ?, locked_until = ? WHERE id = ?', n >= 5 ? 0 : n, n >= 5 ? Date.now() + 15 * 60 * 1000 : 0, user.id);
    }
    return fail('Email atau kata sandi salah.');
  }
  run('UPDATE users SET failed_logins = 0, locked_until = 0 WHERE id = ?', user.id);
  // Rotasi sesi untuk mencegah session fixation.
  security.endSession(req, res);
  security.startSession(res, user.id);
  req.session = { user: { id: user.id } };
  security.audit(req, 'login', email);
  res.redirect('/admin');
});

router.use(security.sessionLoader);

router.post('/logout', security.requireAuth, security.csrfCheck, (req, res) => {
  security.audit(req, 'logout');
  security.endSession(req, res);
  res.redirect('/admin/login');
});

// Semua rute di bawah ini wajib login + CSRF.
router.use(security.requireAuth);
router.use((req, res, next) => { res.locals.session = req.session; res.locals.csrf = req.session.csrf; res.locals.me = req.session.user; next(); });
router.use(security.csrfCheck);

// ---------- Dashboard ----------
router.get('/', (req, res) => {
  const count = (t, w = '') => get(`SELECT COUNT(*) c FROM ${t} ${w}`).c;
  res.render('admin/dashboard', {
    active: 'dashboard',
    stats: [
      ['Pesan baru', count('inquiries', "WHERE status = 'baru'"), '/admin/inquiries', 'inbox'],
      ['Layanan', count('services'), '/admin/r/services', 'layers'],
      ['Portofolio', count('portfolio'), '/admin/r/portfolio', 'layout'],
      ['Artikel', count('articles'), '/admin/r/articles', 'news'],
      ['Testimoni', count('testimonials'), '/admin/r/testimonials', 'star'],
      ['FAQ', count('faqs'), '/admin/r/faqs', 'list']
    ],
    latest: all('SELECT id, name, email, service, status, created_at FROM inquiries ORDER BY id DESC LIMIT 6'),
    smtp: !!config.smtp.host
  });
});

// ---------- Settings ----------
router.get('/settings', (req, res) => {
  res.render('admin/settings', { active: 'settings', groups: SETTING_FIELDS, values: res.locals.s });
});
router.post('/settings', (req, res) => {
  const upd = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const g of SETTING_FIELDS) for (const f of g.fields) {
    if (!(f.name in req.body)) continue;
    let v = String(req.body[f.name] ?? '').trim().slice(0, f.max || 300);
    if (f.name === 'whatsapp') v = v.replace(/\D/g, '');
    if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return flashRedirect(req, res, '/admin/settings', `Format email tidak valid: ${f.label}`, 'err');
    if (f.type === 'url' && v && !/^https?:\/\//.test(v)) return flashRedirect(req, res, '/admin/settings', `URL harus diawali http(s)://: ${f.label}`, 'err');
    upd.run(f.name, v);
  }
  security.audit(req, 'settings.update');
  flashRedirect(req, res, '/admin/settings', 'Pengaturan disimpan.');
});

// ---------- Halaman & SEO ----------
router.get('/pages', (req, res) => {
  res.render('admin/pages', { active: 'pages', rows: all('SELECT slug, title, meta_title, meta_description, noindex, updated_at FROM pages ORDER BY rowid'), labels: PAGE_LABELS });
});
router.get('/pages/:slug', (req, res, next) => {
  const row = get('SELECT * FROM pages WHERE slug = ?', req.params.slug);
  if (!row) return next();
  res.render('admin/page-form', { active: 'pages', row, legal: ['kebijakan-privasi', 'syarat-ketentuan'].includes(row.slug), media: all('SELECT filename FROM media ORDER BY id DESC'), error: '' });
});
router.post('/pages/:slug', (req, res, next) => {
  const row = get('SELECT * FROM pages WHERE slug = ?', req.params.slug);
  if (!row) return next();
  const b = req.body;
  const body = ['kebijakan-privasi', 'syarat-ketentuan'].includes(row.slug) ? sanitizeHtml(String(b.body_html || '').slice(0, 100000), HTML_OPTS) : row.body_html;
  run(`UPDATE pages SET title=?, meta_title=?, meta_description=?, og_image=?, body_html=?, noindex=?, updated_at=CURRENT_TIMESTAMP WHERE slug=?`,
    String(b.title || row.title).trim().slice(0, 120), String(b.meta_title || '').trim().slice(0, 70), String(b.meta_description || '').trim().slice(0, 170),
    String(b.og_image || '').trim().slice(0, 200), body, b.noindex ? 1 : 0, row.slug);
  security.audit(req, 'page.update', row.slug);
  flashRedirect(req, res, '/admin/pages', 'Halaman disimpan.');
});

// ---------- Resource CRUD generik ----------
function resolve(req, res, next) {
  const r = RESOURCES[req.params.res];
  if (!r) return next('route');
  req.r = r; res.locals.r = r; res.locals.opts = fieldOptions; res.locals.resKey = req.params.res; res.locals.active = req.params.res;
  next();
}

function fieldOptions(f) { return typeof f.options === 'function' ? f.options(db) : (f.options || []); }

function readRow(r, body, media) {
  const out = {}; const errors = {};
  for (const f of r.fields) {
    let v = body[f.name];
    if (f.type === 'checkbox') { out[f.name] = v ? 1 : 0; continue; }
    v = String(v ?? '').replace(/\r\n/g, '\n').trim();
    if (f.type === 'number') {
      const n = v === '' ? (f.default ?? 0) : Number(v);
      if (!Number.isInteger(n) || n < (f.min ?? -1e9) || n > (f.max ?? 1e9)) errors[f.name] = `${f.label} harus berupa bilangan bulat${f.min != null ? ` ${f.min}-${f.max}` : ''}.`;
      out[f.name] = n; continue;
    }
    if (f.type === 'html') v = sanitizeHtml(v.slice(0, 100000), HTML_OPTS);
    else v = v.slice(0, f.max || (f.type === 'textarea' ? 5000 : 200));
    if (f.type === 'select') { const opts = fieldOptions(f).map(o => String(o.value ?? o)); if (v === '' && f.required) errors[f.name] = `${f.label} wajib dipilih.`; else if (v !== '' && !opts.includes(v)) errors[f.name] = `${f.label} tidak valid.`; }
    if (f.type === 'image' && v && !/^\/uploads\/[\w.-]+$/.test(v)) errors[f.name] = 'Pilih gambar dari daftar media.';
    if (f.type === 'slug' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) errors[f.name] = `${f.label} hanya huruf kecil, angka, dan tanda hubung.`;
    if (f.type === 'url' && v && !/^https?:\/\/\S+$/.test(v)) errors[f.name] = `${f.label} harus diawali http:// atau https://.`;
    if (f.type === 'date' && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) errors[f.name] = `${f.label} harus berformat YYYY-MM-DD.`;
    if (f.required && v === '') errors[f.name] = `${f.label} wajib diisi.`;
    out[f.name] = v;
  }
  return { out, errors };
}

router.get('/r/:res', resolve, (req, res) => {
  const r = req.r;
  const rows = all(`SELECT * FROM ${r.table} ORDER BY ${r.order}`);
  const lookups = {};
  for (const c of r.columns) if (c.lookup) lookups[c.key] = Object.fromEntries(fieldOptions(r.fields.find(f => f.name === c.key)).map(o => [String(o.value), o.label]));
  res.render('admin/list', { rows, lookups });
});

router.get('/r/:res/new', resolve, (req, res) => {
  const row = {}; for (const f of req.r.fields) row[f.name] = f.default ?? (f.type === 'checkbox' ? 1 : '');
  if (req.query.service_id && 'service_id' in row) row.service_id = String(Number(req.query.service_id) || '');
  res.render('admin/form', { row, errors: {}, isNew: true, media: all('SELECT filename FROM media ORDER BY id DESC') });
});

router.post('/r/:res/new', resolve, (req, res) => {
  const { out, errors } = readRow(req.r, req.body);
  if (Object.keys(errors).length) return res.status(422).render('admin/form', { row: out, errors, isNew: true, media: all('SELECT filename FROM media ORDER BY id DESC') });
  const cols = Object.keys(out);
  try {
    const id = run(`INSERT INTO ${req.r.table} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`, ...cols.map(c => out[c])).lastInsertRowid;
    security.audit(req, `${req.params.res}.create`, id);
  } catch (err) {
    if (/UNIQUE/.test(err.message)) return res.status(422).render('admin/form', { row: out, errors: { slug: 'Slug sudah dipakai.' }, isNew: true, media: all('SELECT filename FROM media ORDER BY id DESC') });
    throw err;
  }
  flashRedirect(req, res, `/admin/r/${req.params.res}`, 'Data ditambahkan.');
});

router.get('/r/:res/:id(\\d+)', resolve, (req, res, next) => {
  const row = get(`SELECT * FROM ${req.r.table} WHERE id = ?`, req.params.id);
  if (!row) return next();
  res.render('admin/form', { row, errors: {}, isNew: false, media: all('SELECT filename FROM media ORDER BY id DESC') });
});

router.post('/r/:res/:id(\\d+)', resolve, (req, res, next) => {
  const existing = get(`SELECT * FROM ${req.r.table} WHERE id = ?`, req.params.id);
  if (!existing) return next();
  const { out, errors } = readRow(req.r, req.body);
  const rerender = (e) => res.status(422).render('admin/form', { row: { ...out, id: existing.id }, errors: e, isNew: false, media: all('SELECT filename FROM media ORDER BY id DESC') });
  if (Object.keys(errors).length) return rerender(errors);
  const cols = Object.keys(out);
  try {
    run(`UPDATE ${req.r.table} SET ${cols.map(c => c + ' = ?').join(', ')}${req.r.touch ? ', updated_at = CURRENT_TIMESTAMP' : ''} WHERE id = ?`, ...cols.map(c => out[c]), existing.id);
  } catch (err) {
    if (/UNIQUE/.test(err.message)) return rerender({ slug: 'Slug sudah dipakai.' });
    throw err;
  }
  security.audit(req, `${req.params.res}.update`, existing.id);
  flashRedirect(req, res, `/admin/r/${req.params.res}`, 'Perubahan disimpan.');
});

router.post('/r/:res/:id(\\d+)/delete', resolve, (req, res) => {
  run(`DELETE FROM ${req.r.table} WHERE id = ?`, req.params.id);
  security.audit(req, `${req.params.res}.delete`, req.params.id);
  flashRedirect(req, res, `/admin/r/${req.params.res}`, 'Data dihapus.');
});

// ---------- Pesan masuk ----------
router.get('/inquiries', (req, res) => {
  const status = ['baru', 'dibaca', 'selesai', 'spam'].includes(req.query.status) ? req.query.status : '';
  res.render('admin/inquiries', { active: 'inquiries', status, rows: status ? all('SELECT * FROM inquiries WHERE status = ? ORDER BY id DESC LIMIT 300', status) : all('SELECT * FROM inquiries ORDER BY id DESC LIMIT 300') });
});
router.get('/inquiries/:id(\\d+)', (req, res, next) => {
  const row = get('SELECT * FROM inquiries WHERE id = ?', req.params.id);
  if (!row) return next();
  if (row.status === 'baru') { run("UPDATE inquiries SET status = 'dibaca' WHERE id = ?", row.id); row.status = 'dibaca'; }
  res.render('admin/inquiry', { active: 'inquiries', row });
});
router.post('/inquiries/:id(\\d+)/status', (req, res) => {
  const st = String(req.body.status);
  if (!['baru', 'dibaca', 'selesai', 'spam'].includes(st)) return flashRedirect(req, res, '/admin/inquiries', 'Status tidak valid.', 'err');
  run('UPDATE inquiries SET status = ? WHERE id = ?', st, req.params.id);
  security.audit(req, 'inquiry.status', `${req.params.id}=${st}`);
  flashRedirect(req, res, '/admin/inquiries', 'Status diperbarui.');
});
router.post('/inquiries/:id(\\d+)/delete', security.requireRole('admin'), (req, res) => {
  run('DELETE FROM inquiries WHERE id = ?', req.params.id);
  security.audit(req, 'inquiry.delete', req.params.id);
  flashRedirect(req, res, '/admin/inquiries', 'Pesan dihapus.');
});

// ---------- Media ----------
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 3 * 1024 * 1024, files: 1 } });
const SIGS = [
  ['image/jpeg', 'jpg', b => b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF],
  ['image/png', 'png', b => b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))],
  ['image/gif', 'gif', b => b.slice(0, 4).toString('latin1') === 'GIF8'],
  ['image/webp', 'webp', b => b.slice(0, 4).toString('latin1') === 'RIFF' && b.slice(8, 12).toString('latin1') === 'WEBP']
];

router.get('/media', (req, res) => res.render('admin/media', { active: 'media', rows: all('SELECT * FROM media ORDER BY id DESC') }));
router.post('/media', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return flashRedirect(req, res, '/admin/media', err.code === 'LIMIT_FILE_SIZE' ? 'Ukuran file maksimal 3 MB.' : 'Gagal mengunggah file.', 'err');
    if (!req.file) return flashRedirect(req, res, '/admin/media', 'Pilih file terlebih dahulu.', 'err');
    const sig = SIGS.find(s => s[2](req.file.buffer));
    if (!sig) return flashRedirect(req, res, '/admin/media', 'Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.', 'err');
    const filename = `${Date.now().toString(36)}-${crypto.randomBytes(5).toString('hex')}.${sig[1]}`;
    fs.writeFileSync(path.join(config.uploadDir, filename), req.file.buffer, { flag: 'wx' });
    run('INSERT INTO media (filename, original, mime, size, alt) VALUES (?,?,?,?,?)',
      filename, path.basename(req.file.originalname).replace(/[^\w.\- ]/g, '').slice(0, 100), sig[0], req.file.size, String(req.body.alt || '').slice(0, 150));
    security.audit(req, 'media.upload', filename);
    flashRedirect(req, res, '/admin/media', 'File diunggah.');
  });
});
router.post('/media/:id(\\d+)/delete', (req, res) => {
  const m = get('SELECT filename FROM media WHERE id = ?', req.params.id);
  if (m) {
    fs.rmSync(path.join(config.uploadDir, path.basename(m.filename)), { force: true });
    run('DELETE FROM media WHERE id = ?', req.params.id);
    security.audit(req, 'media.delete', m.filename);
  }
  flashRedirect(req, res, '/admin/media', 'File dihapus.');
});

// ---------- Pengguna ----------
router.get('/users', security.requireRole('admin'), (req, res) => {
  res.render('admin/users', { active: 'users', rows: all('SELECT id, email, name, role, created_at FROM users ORDER BY id') });
});
router.post('/users', security.requireRole('admin'), (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const pass = String(req.body.password || '');
  const role = req.body.role === 'admin' ? 'admin' : 'editor';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return flashRedirect(req, res, '/admin/users', 'Email tidak valid.', 'err');
  if (pass.length < 10) return flashRedirect(req, res, '/admin/users', 'Kata sandi minimal 10 karakter.', 'err');
  if (get('SELECT id FROM users WHERE email = ?', email)) return flashRedirect(req, res, '/admin/users', 'Email sudah terdaftar.', 'err');
  run('INSERT INTO users (email, name, password_hash, role) VALUES (?,?,?,?)', email, String(req.body.name || '').trim().slice(0, 80), bcrypt.hashSync(pass, 12), role);
  security.audit(req, 'user.create', email);
  flashRedirect(req, res, '/admin/users', 'Pengguna ditambahkan.');
});
router.post('/users/:id(\\d+)/delete', security.requireRole('admin'), (req, res) => {
  if (Number(req.params.id) === req.session.user.id) return flashRedirect(req, res, '/admin/users', 'Anda tidak dapat menghapus akun sendiri.', 'err');
  run('DELETE FROM users WHERE id = ?', req.params.id);
  security.audit(req, 'user.delete', req.params.id);
  flashRedirect(req, res, '/admin/users', 'Pengguna dihapus.');
});

router.get('/account', (req, res) => res.render('admin/account', { active: 'account' }));
router.post('/account', (req, res) => {
  const user = get('SELECT * FROM users WHERE id = ?', req.session.user.id);
  const cur = String(req.body.current || ''), next = String(req.body.password || '');
  if (!bcrypt.compareSync(cur, user.password_hash)) return flashRedirect(req, res, '/admin/account', 'Kata sandi saat ini salah.', 'err');
  if (next.length < 10) return flashRedirect(req, res, '/admin/account', 'Kata sandi baru minimal 10 karakter.', 'err');
  if (next !== String(req.body.confirm || '')) return flashRedirect(req, res, '/admin/account', 'Konfirmasi kata sandi tidak cocok.', 'err');
  run('UPDATE users SET password_hash = ? WHERE id = ?', bcrypt.hashSync(next, 12), user.id);
  run('DELETE FROM sessions WHERE user_id = ? AND id != ?', user.id, req.session.id);
  security.audit(req, 'user.password');
  flashRedirect(req, res, '/admin/account', 'Kata sandi diperbarui.');
});

router.get('/audit', security.requireRole('admin'), (req, res) => {
  res.render('admin/audit', { active: 'audit', rows: all('SELECT a.*, u.email FROM audit_log a LEFT JOIN users u ON u.id = a.user_id ORDER BY a.id DESC LIMIT 200') });
});

router.use((req, res) => res.status(404).render('admin/message', { title: 'Tidak ditemukan', text: 'Halaman admin tidak ditemukan.' }));

module.exports = router;
