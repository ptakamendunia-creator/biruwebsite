// Menyinkronkan paket harga di database dengan src/seed-data.js (menimpa tabel packages).
const { db, migrate, tx } = require('../src/db');
const d = require('../src/seed-data');
migrate();

tx(() => {
  const ins = db.prepare('INSERT INTO packages (service_id,name,price_label,description,features,highlight,sort) VALUES (?,?,?,?,?,?,?)');
  for (const s of d.services) {
    const row = db.prepare('SELECT id FROM services WHERE slug = ?').get(s.slug);
    if (!row) continue;
    db.prepare('DELETE FROM packages WHERE service_id = ?').run(row.id);
    (s.packages || []).forEach((p, n) => ins.run(row.id, p.name, p.price_label, p.description, p.features, p.highlight, n));
  }
});
console.log('Paket harga disinkronkan.');

// Portofolio: ganti seluruh isi tabel dengan data dari seed-data.js
tx(() => {
  db.prepare('DELETE FROM portfolio').run();
  const ins = db.prepare('INSERT INTO portfolio (title,category,industry,tone,url,image,description,sort) VALUES (?,?,?,?,?,?,?,?)');
  d.portfolio.forEach((p, i) => ins.run(p[0], p[1], p[2], p[3], p[4], p[5], '', i));
});
console.log('Portofolio disinkronkan.');
