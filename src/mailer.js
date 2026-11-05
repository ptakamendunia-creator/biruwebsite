const nodemailer = require('nodemailer');
const config = require('./config');

let transport = null;
function getTransport() {
  if (!config.smtp.host) return null;
  if (!transport) {
    transport = nodemailer.createTransport({
      host: config.smtp.host, port: config.smtp.port, secure: config.smtp.secure,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined
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

module.exports = { notifyInquiry };
