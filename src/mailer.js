const nodemailer = require('nodemailer');
const config = require('./config');

let transport = null;
function getTransport() {
  if (!config.smtp.host) return null;
  if (!transport) {
    transport = nodemailer.createTransport({
      host: config.smtp.host, port: config.smtp.port, secure: config.smtp.secure,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
      // Batas waktu agar form kontak tidak menggantung bila server email lambat atau salah konfigurasi.
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000
    });
  }
  return transport;
}

/** Mengembalikan true jika email terkirim. Tanpa SMTP, pesan tetap tersimpan di database. */
async function notifyInquiry(inq, settings) {
  const t = getTransport();
  const to = config.smtp.to || settings.contact_email;
  if (!t || !to) {
    console.warn('[mail] SMTP belum dikonfigurasi, notifikasi email dilewati (pesan tetap tersimpan).');
    return false;
  }
  try {
    await t.sendMail({
      from: config.smtp.from || config.smtp.user,
      to,
      replyTo: inq.email,
      subject: `[Kontak] ${inq.name} - ${inq.service || 'Konsultasi'}`,
      text: `Nama: ${inq.name}\nEmail: ${inq.email}\nTelepon: ${inq.phone || '-'}\nLayanan: ${inq.service || '-'}\n\n${inq.message}`
    });
    return true;
  } catch (err) {
    console.error('[mail] gagal mengirim:', err.message);
    return false;
  }
}

/** Kirim email uji dari Admin. Mengembalikan { ok, error }. */
async function sendTest(to) {
  const t = getTransport();
  if (!t) return { ok: false, error: 'SMTP_HOST belum diisi di environment.' };
  if (!to) return { ok: false, error: 'Penerima belum diatur (MAIL_TO atau Email kontak di Pengaturan).' };
  try {
    await t.sendMail({ from: config.smtp.from || config.smtp.user, to, subject: '[Uji] Notifikasi email situs berfungsi', text: 'Ini email uji dari Admin > Pengaturan. Bila Anda membacanya, notifikasi form kontak akan sampai ke alamat ini.' });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err.message || err).slice(0, 160) };
  }
}

module.exports = { notifyInquiry, sendTest };
