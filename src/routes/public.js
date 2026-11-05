const express = require('express');
const rateLimit = require('express-rate-limit');
const { db } = require('../db');
const config = require('../config');
const seo = require('../seo');
const security = require('../security');
const { notifyInquiry } = require('../mailer');

const router = express.Router();
const all = (sql, ...p) => db.prepare(sql).all(...p);
const get = (sql, ...p) => db.prepare(sql).get(...p);

function meta(slug, extra = {}) {
  const p = get('SELECT * FROM pages WHERE slug = ?', slug) || {};
  return {
    title: p.meta_title || p.title || '',
    description: p.meta_description || '',
    image: p.og_image || '/img/og-default.png',
    noindex: !!p.noindex,
    ...extra
  };
}

function render(res, view, page, data = {}) {
  const canonical = config.siteUrl + (page.canonicalPath ?? res.req.path);
  const crumbs = page.crumbs;
  const ld = [seo.organization(res.locals.s), seo.website(res.locals.s), ...(page.ld || [])];
  if (crumbs) ld.push(seo.breadcrumb([{ name: 'Beranda', url: '/' }, ...crumbs]));
  res.render(view, { ...data, page: { ...page, canonical, ld, crumbs } });
}

const servicesWithCounts = () => all('SELECT * FROM services WHERE published = 1 ORDER BY sort');
const portfolioItems = (limit = 100) => all('SELECT * FROM portfolio WHERE published = 1 ORDER BY sort, id LIMIT ?', limit);
const faqs = (scope) => all('SELECT * FROM faqs WHERE published = 1 ORDER BY sort');
const articles = (limit = 50) => all('SELECT * FROM articles WHERE published = 1 ORDER BY published_at DESC LIMIT ?', limit);

router.get('/', (req, res) => {
  const f = faqs();
  render(res, 'pages/home', { ...meta('home'), ld: [seo.faqPage(f)] }, {
    services: servicesWithCounts(), portfolio: portfolioItems(8), faqs: f, articles: articles(3),
    steps: all("SELECT title, text FROM service_items WHERE service_id = (SELECT id FROM services ORDER BY sort LIMIT 1) AND kind = 'step' ORDER BY sort"),
    testimonials: all('SELECT * FROM testimonials WHERE published = 1 ORDER BY sort LIMIT 3')
  });
});

router.get('/tentang-kami', (req, res) => {
  render(res, 'pages/about', { ...meta('tentang-kami'), crumbs: [{ name: 'Tentang Kami', url: '/tentang-kami' }] }, {
    services: servicesWithCounts(),
    steps: all("SELECT title, text FROM service_items WHERE service_id = (SELECT id FROM services ORDER BY sort LIMIT 1) AND kind = 'step' ORDER BY sort")
  });
});

router.get('/layanan', (req, res) => res.redirect(301, '/#layanan'));

router.get('/layanan/:slug', (req, res, next) => {
  const svc = get('SELECT * FROM services WHERE slug = ? AND published = 1', req.params.slug);
  if (!svc) return next();
  const items = (kind) => all('SELECT title, text FROM service_items WHERE service_id = ? AND kind = ? ORDER BY sort', svc.id, kind);
  const f = faqs();
  render(res, 'pages/service', {
    title: svc.meta_title || `${svc.name} | ${res.locals.s.site_name}`, description: svc.meta_description || svc.summary,
    ld: [seo.service(svc, res.locals.s), seo.faqPage(f.slice(0, 5))],
    crumbs: [{ name: 'Layanan', url: '/#layanan' }, { name: svc.name, url: '/layanan/' + svc.slug }]
  }, {
    svc, audience: items('audience'), features: items('feature'), steps: items('step'),
    packages: all('SELECT * FROM packages WHERE service_id = ? AND published = 1 ORDER BY sort', svc.id).map(p => ({ ...p, list: p.features.split('\n').map(x => x.trim()).filter(Boolean) })),
    portfolio: portfolioItems(3), faqs: f
  });
});

router.get('/portofolio', (req, res) => {
  const items = portfolioItems();
  render(res, 'pages/portfolio', { ...meta('portofolio'), crumbs: [{ name: 'Portofolio', url: '/portofolio' }] }, {
    items, categories: [...new Set(items.map(i => i.category))]
  });
});

router.get('/testimoni', (req, res) => {
  render(res, 'pages/testimonials', { ...meta('testimoni'), crumbs: [{ name: 'Testimoni', url: '/testimoni' }] }, {
    testimonials: all('SELECT * FROM testimonials WHERE published = 1 ORDER BY sort, id')
  });
});

router.get('/artikel', (req, res) => {
  render(res, 'pages/articles', { ...meta('artikel'), crumbs: [{ name: 'Artikel', url: '/artikel' }] }, { articles: articles() });
});

router.get('/artikel/:slug', (req, res, next) => {
  const a = get('SELECT * FROM articles WHERE slug = ? AND published = 1', req.params.slug);
  if (!a) return next();
  render(res, 'pages/article', {
    title: a.meta_title || `${a.title} | ${res.locals.s.site_name}`, description: a.meta_description || a.excerpt,
    image: a.cover || '/img/og-default.png', ld: [seo.article(a, res.locals.s)],
    crumbs: [{ name: 'Artikel', url: '/artikel' }, { name: a.title, url: '/artikel/' + a.slug }]
  }, { a, more: all('SELECT slug, title, label FROM articles WHERE published = 1 AND id != ? ORDER BY published_at DESC LIMIT 2', a.id) });
});

router.get('/kontak', (req, res) => {
  render(res, 'pages/contact', { ...meta('kontak'), crumbs: [{ name: 'Kontak', url: '/kontak' }] }, {
    services: servicesWithCounts(), formToken: security.formToken(), selected: String(req.query.layanan || '').slice(0, 80)
  });
});

router.get('/member', (req, res) => {
  render(res, 'pages/member', { ...meta('member'), crumbs: [{ name: 'Member', url: '/member' }] });
});

for (const slug of ['kebijakan-privasi', 'syarat-ketentuan']) {
  router.get('/' + slug, (req, res) => {
    const p = get('SELECT * FROM pages WHERE slug = ?', slug);
    render(res, 'pages/legal', { ...meta(slug), crumbs: [{ name: p.title, url: '/' + slug }] }, { doc: p });
  });
}

// ---- Form kontak ----
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { ok: false, error: 'Terlalu banyak pengiriman. Coba lagi dalam beberapa menit.' }
});

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

router.post('/api/contact', security.sameOrigin, contactLimiter, async (req, res, next) => {
  try {
    const b = req.body || {};
    // Honeypot dan token waktu: bot menjawab "berhasil" tanpa menyimpan apa pun.
    if (b.website || !security.checkFormToken(b.t)) return res.json({ ok: true, message: 'Terima kasih, pesan Anda telah kami terima.' });

    const data = {
      name: clean(b.name, 100), email: clean(b.email, 150).toLowerCase(), phone: clean(b.phone, 30),
      service: clean(b.service, 100), message: clean(b.message, 2000)
    };
    const errors = {};
    if (data.name.length < 2) errors.name = 'Nama minimal 2 karakter.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = 'Format email tidak valid.';
    if (data.phone && !/^[+\d][\d\s\-()]{6,}$/.test(data.phone)) errors.phone = 'Nomor telepon tidak valid.';
    if (data.message.length < 10) errors.message = 'Pesan minimal 10 karakter.';
    if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors });

    const id = Number(db.prepare('INSERT INTO inquiries (name,email,phone,service,message,ip) VALUES (?,?,?,?,?,?)')
      .run(data.name, data.email, data.phone, data.service, data.message, req.ip || '').lastInsertRowid);
    const sent = await notifyInquiry(data, res.locals.s);
    if (sent) db.prepare('UPDATE inquiries SET notified = 1 WHERE id = ?').run(id);

    const waText = `Halo ${res.locals.s.site_name}, saya ${data.name}. ${data.service ? `Saya tertarik dengan ${data.service}. ` : ''}${data.message}`.slice(0, 900);
    res.json({ ok: true, message: 'Terima kasih, pesan Anda telah kami terima.', whatsapp: res.locals.wa(waText) });
  } catch (err) { next(err); }
});

// ---- SEO ----
router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
});

router.get('/sitemap.xml', (req, res) => {
  const urls = [
    ['/', 1.0], ['/tentang-kami', 0.7], ['/portofolio', 0.7], ['/testimoni', 0.5], ['/artikel', 0.7], ['/kontak', 0.8],
    ['/kebijakan-privasi', 0.3], ['/syarat-ketentuan', 0.3]
  ].map(([u, p]) => ({ loc: u, priority: p }));
  for (const s of all('SELECT slug FROM services WHERE published = 1 ORDER BY sort')) urls.push({ loc: '/layanan/' + s.slug, priority: 0.9 });
  for (const a of all('SELECT slug, updated_at FROM articles WHERE published = 1')) urls.push({ loc: '/artikel/' + a.slug, priority: 0.6, lastmod: String(a.updated_at).slice(0, 10) });
  const esc = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${esc(config.siteUrl + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n') + '\n</urlset>\n';
  res.type('application/xml').send(xml);
});

router.get('/healthz', (req, res) => { get('SELECT 1'); res.json({ ok: true }); });

module.exports = router;
