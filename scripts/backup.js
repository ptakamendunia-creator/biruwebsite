// Cadangan konsisten dari database hidup (VACUUM INTO) + salinan folder upload.
const fs = require('fs');
const path = require('path');
const config = require('../src/config');
const { db } = require('../src/db');
const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
const dir = path.join(config.backupDir, stamp);
fs.mkdirSync(dir, { recursive: true });
db.exec(`VACUUM INTO '${path.join(dir, 'site.db').replace(/'/g, "''")}'`);
if (fs.existsSync(config.uploadDir)) fs.cpSync(config.uploadDir, path.join(dir, 'uploads'), { recursive: true });
// Simpan 14 cadangan terakhir.
const all = fs.readdirSync(config.backupDir).sort();
for (const old of all.slice(0, Math.max(0, all.length - 14))) fs.rmSync(path.join(config.backupDir, old), { recursive: true, force: true });
console.log('Cadangan dibuat:', dir);
