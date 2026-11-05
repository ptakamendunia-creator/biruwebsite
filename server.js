const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./src/config');
const { migrate, getSettings, db } = require('./src/db');
const security = require('./src/security');
const seo = require('./src/seo');
const { icon } = require('./src/icons');

migrate();
if (!process.env.NO_LISTEN) require('./src/bootstrap').bootstrap();
fs.mkdirSync(config.uploadDir, { recursive: true });

const app = express();
app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ['https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      objectSrc: ["'none'"],
      ...(config.isProd ? { upgradeInsecureRequests: [] } : {})
    }
  },
  // same-origin: form POST same-origin tetap membawa Origin asli (no-referrer membuatnya 'null').
  referrerPolicy: { policy: 'same-origin' },
  crossOriginEmbedderPolicy: false,
  hsts: config.isProd ? { maxAge: 31536000, includeSubDomains: true } : false
}));
app.use(compression());
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(express.json({ limit: '50kb' }));

// Aset statis: cache panjang untuk file berfingerprint-versi, sedang untuk lainnya.
app.use(express.static(path.join(__dirname, 'public'), { maxAge: config.isProd ? '7d' : 0, etag: true }));
app.use('/uploads', express.static(config.uploadDir, {
  maxAge: config.isProd ? '30d' : 0,
  setHeaders: (res) => { res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; sandbox"); }
}));

app.use(security.sessionLoader);

// Data global untuk semua view.
app.use((req, res, next) => {
  const settings = getSettings();
  res.locals.s = settings;
  res.locals.siteUrl = config.siteUrl;
  res.locals.path = req.path;
  res.locals.nav = db.prepare('SELECT slug, name FROM services WHERE published = 1 ORDER BY sort').all();
  res.locals.seo = seo;
  res.locals.icon = icon;
  res.locals.year = new Date().getFullYear();
  res.locals.session = req.session;
  res.locals.csrf = req.session?.csrf || '';
  res.locals.page = { title: settings.site_name, description: settings.tagline, canonical: config.siteUrl + req.path, image: '/img/og-default.png', noindex: false, ld: [] };
  res.locals.wa = (text) => `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  next();
});

app.use('/admin', require('./src/routes/admin'));
app.use(require('./src/routes/public'));

app.use((req, res) => {
  res.status(404).render('pages/404', { page: { ...res.locals.page, title: 'Halaman tidak ditemukan', description: '', noindex: true, ld: [] } });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[error] ${req.method} ${req.originalUrl}:`, err);
  if (res.headersSent) return;
  const wantsJson = req.originalUrl.startsWith('/api/') || req.accepts(['html', 'json']) === 'json';
  if (wantsJson) return res.status(500).json({ ok: false, error: 'Terjadi kesalahan pada server.' });
  res.status(500).render('pages/500', { page: { ...res.locals.page, title: 'Terjadi kesalahan', description: '', noindex: true, ld: [] } });
});

// Di hosting Passenger/CloudLinux, file ini dimuat lewat loader (require.main bukan file ini),
// jadi server harus tetap listen. Tes asap mematikannya dengan NO_LISTEN=1 agar memakai port sendiri.
if (!process.env.NO_LISTEN) {
  const p = process.env.PORT;
  const listenOn = p && !/^\d+$/.test(p) ? p : config.port; // PORT non-angka = path socket dari hosting
  app.listen(listenOn, () => console.log(`Server berjalan di ${config.siteUrl} (${listenOn})`));
}
module.exports = app;
