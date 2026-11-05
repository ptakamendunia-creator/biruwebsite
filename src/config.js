const path = require('path');

try { process.loadEnvFile(path.join(__dirname, '..', '.env')); } catch { /* .env opsional */ }

const env = process.env;
const root = path.join(__dirname, '..');
const isProd = env.NODE_ENV === 'production';

const config = {
  root,
  isProd,
  port: Number(env.PORT) || 3000,
  siteUrl: (env.SITE_URL || `http://localhost:${Number(env.PORT) || 3000}`).replace(/\/$/, ''),
  dbPath: path.resolve(root, env.DB_PATH || 'data/site.db'),
  uploadDir: path.resolve(root, env.UPLOAD_DIR || 'data/uploads'),
  backupDir: path.resolve(root, env.BACKUP_DIR || 'data/backups'),
  sessionSecret: env.SESSION_SECRET || '',
  trustProxy: env.TRUST_PROXY === '1',
  smtp: {
    host: env.SMTP_HOST || '',
    port: Number(env.SMTP_PORT) || 587,
    secure: env.SMTP_SECURE === '1',
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
    from: env.MAIL_FROM || '',
    to: env.MAIL_TO || ''
  }
};

if (isProd && config.sessionSecret.length < 32) {
  console.error('SESSION_SECRET wajib diisi (minimal 32 karakter) pada NODE_ENV=production.');
  process.exit(1);
}
if (!config.sessionSecret) {
  // Mode pengembangan: rahasia acak per proses (sesi hilang saat restart).
  config.sessionSecret = require('crypto').randomBytes(32).toString('hex');
}

module.exports = config;
