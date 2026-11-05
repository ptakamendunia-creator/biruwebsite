// Pemakaian: node scripts/create-admin.js email@domain.com "Nama"   (kata sandi diminta lewat env ADMIN_PASSWORD atau dibuat acak)
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db, migrate } = require('../src/db');
migrate();
const [email, name = 'Administrator'] = process.argv.slice(2);
if (!email || !/^\S+@\S+\.\S+$/.test(email)) { console.error('Pemakaian: node scripts/create-admin.js email@domain.com "Nama"'); process.exit(1); }
let pass = process.env.ADMIN_PASSWORD;
const generated = !pass;
if (generated) pass = crypto.randomBytes(12).toString('base64url');
if (pass.length < 10) { console.error('Kata sandi minimal 10 karakter.'); process.exit(1); }
const hash = bcrypt.hashSync(pass, 12);
const row = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
if (row) db.prepare('UPDATE users SET password_hash=?, name=?, role=\'admin\', failed_logins=0, locked_until=0 WHERE id=?').run(hash, name, row.id);
else db.prepare('INSERT INTO users (email,name,password_hash,role) VALUES (?,?,?,\'admin\')').run(email.toLowerCase(), name, hash);
console.log(`${row ? 'Diperbarui' : 'Dibuat'}: ${email}`);
if (generated) console.log(`Kata sandi sementara: ${pass}\nSimpan lalu segera ganti lewat Admin > Pengguna.`);
