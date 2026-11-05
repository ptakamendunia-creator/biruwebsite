const { migrate } = require('../src/db');
const applied = migrate();
console.log(applied.length ? `Migrasi diterapkan: ${applied.join(', ')}` : 'Database sudah terbaru.');
