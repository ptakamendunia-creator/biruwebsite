// Penyiapan otomatis saat start, untuk hosting tanpa terminal.
// 1) Data awal diisi bila tabel settings masih kosong (seed aman dijalankan ulang).
// 2) Admin pertama dibuat dari ADMIN_EMAIL + ADMIN_PASSWORD, hanya bila belum ada pengguna sama sekali.
const path = require('path');
const bcrypt = require('bcryptjs');
const { db } = require('./db');

function bootstrap() {
  if (db.prepare('SELECT COUNT(*) c FROM settings').get().c === 0) {
    require('child_process').execFileSync(process.execPath, [path.join(__dirname, '..', 'scripts', 'seed.js')], { stdio: 'inherit' });
    console.log('[bootstrap] Data awal diisi.');
  }
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: pass, ADMIN_NAME: name } = process.env;
  if (email && pass && db.prepare('SELECT COUNT(*) c FROM users').get().c === 0) {
    if (!/^\S+@\S+\.\S+$/.test(email) || pass.length < 10) {
      console.error('[bootstrap] ADMIN_EMAIL tidak valid atau ADMIN_PASSWORD kurang dari 10 karakter; admin tidak dibuat.');
      return;
    }
    db.prepare("INSERT INTO users (email,name,password_hash,role) VALUES (?,?,?,'admin')")
      .run(email.toLowerCase(), name || 'Administrator', bcrypt.hashSync(pass, 12));
    console.log(`[bootstrap] Admin dibuat: ${email}. Hapus ADMIN_PASSWORD dari environment sekarang.`);
  }
}
module.exports = { bootstrap };
