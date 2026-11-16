// Membuat SQL MySQL untuk menyamakan paket harga & portofolio pada versi PHP yang live.
const fs = require('fs');
const d = require('../src/seed-data');
const BS = String.fromCharCode(92);
const q = s => "'" + String(s).split(BS).join(BS + BS).split("'").join("''").split('\n').join(BS + 'n') + "'";
const o = ['START TRANSACTION;'];
for (const s of d.services) {
  if (!s.packages || !s.packages.length) continue;
  o.push(`DELETE FROM packages WHERE service_id=(SELECT id FROM services WHERE slug=${q(s.slug)});`);
  s.packages.forEach((p, n) => o.push(`INSERT INTO packages (service_id,name,price_label,description,features,highlight,sort) SELECT id,${q(p.name)},${q(p.price_label)},${q(p.description)},${q(p.features)},${p.highlight},${n} FROM services WHERE slug=${q(s.slug)};`));
}
o.push('DELETE FROM portfolio;');
d.portfolio.forEach((p, i) => o.push(`INSERT INTO portfolio (title,category,industry,tone,url,image,description,sort) VALUES (${[p[0], p[1], p[2], p[3], p[4], p[5], ''].map(q).join(',')},${i});`));
o.push('COMMIT;');
fs.writeFileSync(__dirname + '/../deploy/update-harga-portofolio-php.sql', o.join('\n') + '\n');
console.log('ok', o.length);
