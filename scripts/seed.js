// Mengisi data awal. Aman dijalankan ulang: tabel yang sudah berisi tidak ditimpa.
const { db, migrate, tx } = require('../src/db');
const d = require('../src/seed-data');
migrate();

const count = t => db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c;

tx(() => {
  const setS = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [k, v] of Object.entries(d.settings)) setS.run(k, v);

  const setP = db.prepare('INSERT OR IGNORE INTO pages (slug, title, meta_title, meta_description, body_html) VALUES (?,?,?,?,?)');
  for (const p of d.pages) setP.run(p.slug, p.title, p.meta_title, p.meta_description, p.body_html || '');

  if (count('services') === 0) {
    const insS = db.prepare(`INSERT INTO services (slug,name,icon,summary,hero_title,hero_text,intro_title,intro_text,meta_title,meta_description,keyword,sort)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
    const insI = db.prepare('INSERT INTO service_items (service_id,kind,title,text,sort) VALUES (?,?,?,?,?)');
    const insK = db.prepare('INSERT INTO packages (service_id,name,price_label,description,features,highlight,sort) VALUES (?,?,?,?,?,?,?)');
    d.services.forEach((s, i) => {
      const id = Number(insS.run(s.slug, s.name, s.icon, s.summary, s.hero_title, s.hero_text, s.intro_title, s.intro_text, s.meta_title, s.meta_description, s.keyword, i + 1).lastInsertRowid);
      (s.audience || []).forEach((x, n) => insI.run(id, 'audience', x[0], x[1], n));
      (s.feature || []).forEach((x, n) => insI.run(id, 'feature', x[0], x[1], n));
      (s.step || d.std.steps).forEach((x, n) => insI.run(id, 'step', x[0], x[1], n));
      (s.packages || []).forEach((p, n) => insK.run(id, p.name, p.price_label, p.description, p.features, p.highlight, n));
    });
  }
  if (count('portfolio') === 0) {
    const ins = db.prepare('INSERT INTO portfolio (title,category,industry,tone,url,image,description,sort) VALUES (?,?,?,?,?,?,?,?)');
    d.portfolio.forEach((p, i) => ins.run(p[0], p[1], p[2], p[3], p[4], p[5], 'Contoh tampilan untuk menggambarkan pendekatan.', i));
  }
  if (count('faqs') === 0) {
    const ins = db.prepare('INSERT INTO faqs (question,answer,sort) VALUES (?,?,?)');
    d.faqs.forEach((f, i) => ins.run(f[0], f[1], i));
  }
  if (count('articles') === 0) {
    const ins = db.prepare('INSERT INTO articles (slug,title,category,label,excerpt,body_html,meta_description,published_at) VALUES (?,?,?,?,?,?,?,?)');
    d.articles.forEach((a, i) => ins.run(a.slug, a.title, a.category, a.label, a.excerpt, a.body_html, a.meta_description, `2026-0${i + 1}-1${i + 2}`));
  }
  // Testimoni tidak diisi: jangan menayangkan ulasan fiktif. Tambahkan yang asli lewat Admin.
});
console.log('Seed selesai.');
