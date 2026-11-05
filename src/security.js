const crypto = require('crypto');
const config = require('./config');
const { db } = require('./db');

const COOKIE = config.isProd ? '__Host-sid' : 'sid';
const TTL_MS = 1000 * 60 * 60 * 8;
const SITE_HOST = new URL(config.siteUrl).host;

function sign(value) {
  return crypto.createHmac('sha256', config.sessionSecret).update(value).digest('base64url');
}

function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/** Memuat sesi dari cookie bertanda tangan. req.session = { id, user, csrf } | null */
function sessionLoader(req, res, next) {
  req.session = null;
  const raw = parseCookies(req.headers.cookie)[COOKIE];
  if (raw) {
    const [id, mac] = raw.split('.');
    if (id && mac && safeEqual(mac, sign(id))) {
      const row = db.prepare(`SELECT s.id, s.csrf, s.expires_at, u.id uid, u.email, u.name, u.role
        FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ?`).get(id);
      if (row && row.expires_at > Date.now()) {
        req.session = { id: row.id, csrf: row.csrf, user: { id: row.uid, email: row.email, name: row.name, role: row.role } };
      }
    }
  }
  next();
}

function startSession(res, userId) {
  const id = crypto.randomBytes(32).toString('base64url');
  const csrf = crypto.randomBytes(24).toString('base64url');
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
  db.prepare('INSERT INTO sessions (id, user_id, csrf, expires_at) VALUES (?,?,?,?)').run(id, userId, csrf, Date.now() + TTL_MS);
  res.cookie(COOKIE, `${id}.${sign(id)}`, {
    httpOnly: true, sameSite: 'lax', secure: config.isProd, path: '/', maxAge: TTL_MS
  });
}

function endSession(req, res) {
  if (req.session) db.prepare('DELETE FROM sessions WHERE id = ?').run(req.session.id);
  res.clearCookie(COOKIE, { path: '/' });
}

function requireAuth(req, res, next) {
  if (!req.session) return res.redirect('/admin/login');
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.session?.user.role !== role) return res.status(403).render('admin/message', { title: 'Akses ditolak', text: 'Anda tidak memiliki izin untuk halaman ini.' });
    next();
  };
}

/** CSRF: setiap POST admin wajib membawa token yang cocok dengan sesi. */
function csrfCheck(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  // Query string hanya untuk unggahan multipart (body belum ter-parse saat pemeriksaan).
  const token = req.body?._csrf || req.get('x-csrf-token') || req.query?._csrf;
  if (!req.session || !token || !safeEqual(token, req.session.csrf)) {
    return res.status(403).render('admin/message', { title: 'Permintaan ditolak', text: 'Token keamanan tidak valid atau kedaluwarsa. Muat ulang halaman lalu coba lagi.' });
  }
  next();
}

/** Tolak POST lintas-situs untuk endpoint publik (form kontak). */
function sameOrigin(req, res, next) {
  const site = req.get('sec-fetch-site');
  if (site && !['same-origin', 'none'].includes(site)) { console.error('[sameOrigin] ditolak sec-fetch-site=' + site); return res.status(403).json({ ok: false, error: 'Permintaan ditolak.' }); }
  const origin = req.get('origin');
  // Browser dapat mengirim 'Origin: null' pada form POST same-origin bila Referrer-Policy ketat.
  // Terima hanya jika Sec-Fetch-Site memastikan same-origin (sudah diperiksa di atas).
  if (origin === 'null') return site === 'same-origin' ? next() : res.status(403).json({ ok: false, error: 'Permintaan ditolak.' });
  if (origin) {
    let host;
    try { host = new URL(origin).host; } catch { host = ''; }
    // Di balik proxy hosting, header Host bisa berbeda dari domain publik. Terima juga host dari SITE_URL
    // (konfigurasi tepercaya) dan X-Forwarded-Host bila TRUST_PROXY aktif.
    const allowed = new Set([req.get('host'), SITE_HOST]);
    if (config.trustProxy && req.get('x-forwarded-host')) allowed.add(req.get('x-forwarded-host').split(',')[0].trim());
    if (!allowed.has(host)) {
      console.error('[sameOrigin] ditolak origin=' + origin + ' host=' + req.get('host') + ' xfh=' + req.get('x-forwarded-host') + ' siteHost=' + SITE_HOST + ' trustProxy=' + config.trustProxy);
      return res.status(403).json({ ok: false, error: 'Permintaan ditolak.' });
    }
  }
  next();
}

// Token waktu untuk form publik: mencegah bot yang mengirim terlalu cepat dan form kedaluwarsa.
function formToken() {
  const ts = Date.now().toString(36);
  return `${ts}.${sign('form' + ts)}`;
}
function checkFormToken(token, minMs = 2500, maxMs = 1000 * 60 * 60 * 6) {
  const [ts, mac] = String(token || '').split('.');
  if (!ts || !mac || !safeEqual(mac, sign('form' + ts))) return false;
  const age = Date.now() - parseInt(ts, 36);
  return age >= minMs && age <= maxMs;
}

function audit(req, action, detail = '') {
  db.prepare('INSERT INTO audit_log (user_id, action, detail, ip) VALUES (?,?,?,?)')
    .run(req.session?.user?.id ?? null, action, String(detail).slice(0, 500), req.ip || '');
}

module.exports = { sessionLoader, startSession, endSession, requireAuth, requireRole, csrfCheck, sameOrigin, formToken, checkFormToken, audit };
