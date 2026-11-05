// Definisi deklaratif untuk CRUD admin. Menambah resource baru = menambah satu entri di sini.

const serviceOptions = (db) => db.prepare('SELECT id, name FROM services ORDER BY sort').all().map(s => ({ value: s.id, label: s.name }));
const iconOptions = ['building', 'layout', 'cart', 'puzzle', 'news', 'dashboard', 'phone', 'server', 'globe', 'palette', 'layers', 'headset', 'database', 'shield'];
const toneOptions = [{ value: 'blue', label: 'Biru' }, { value: 'sky', label: 'Biru muda' }, { value: 'sand', label: 'Netral hangat' }];

const common = {
  sort: { name: 'sort', label: 'Urutan', type: 'number', default: 0, min: 0, max: 9999, help: 'Angka kecil tampil lebih dulu.' },
  published: { name: 'published', label: 'Tampilkan di website', type: 'checkbox' }
};

const RESOURCES = {
  services: {
    title: 'Layanan', icon: 'layers', table: 'services', order: 'sort, id',
    columns: [{ key: 'name', label: 'Nama' }, { key: 'slug', label: 'Slug' }, { key: 'sort', label: 'Urutan' }, { key: 'published', label: 'Tampil', bool: true }],
    fields: [
      { name: 'name', label: 'Nama layanan', type: 'text', required: true },
      { name: 'slug', label: 'Slug (URL)', type: 'slug', required: true, help: 'Dipakai pada alamat /layanan/slug. Mengubahnya akan mengubah URL.' },
      { name: 'icon', label: 'Ikon', type: 'select', options: iconOptions, required: true, default: 'globe' },
      { name: 'summary', label: 'Ringkasan (kartu beranda)', type: 'textarea', max: 400 },
      { name: 'hero_title', label: 'Judul hero (H1)', type: 'text', required: true, max: 160 },
      { name: 'hero_text', label: 'Teks hero', type: 'textarea', max: 500 },
      { name: 'intro_title', label: 'Judul pengantar', type: 'text', max: 160 },
      { name: 'intro_text', label: 'Teks pengantar', type: 'textarea', max: 600 },
      { name: 'keyword', label: 'Kata kunci utama (SEO)', type: 'text', max: 100 },
      { name: 'meta_title', label: 'Meta title', type: 'text', max: 70, help: 'Idealnya 50-60 karakter.' },
      { name: 'meta_description', label: 'Meta description', type: 'textarea', max: 170, help: 'Idealnya 120-160 karakter.' },
      common.sort, common.published
    ]
  },
  'service-items': {
    title: 'Fitur & langkah layanan', icon: 'list', table: 'service_items', order: 'service_id, kind, sort',
    columns: [{ key: 'service_id', label: 'Layanan', lookup: true }, { key: 'kind', label: 'Jenis' }, { key: 'title', label: 'Judul' }, { key: 'sort', label: 'Urutan' }],
    fields: [
      { name: 'service_id', label: 'Layanan', type: 'select', options: serviceOptions, required: true },
      { name: 'kind', label: 'Jenis', type: 'select', required: true, options: [{ value: 'audience', label: 'Untuk siapa (audience)' }, { value: 'feature', label: 'Fitur' }, { value: 'step', label: 'Langkah proses' }] },
      { name: 'title', label: 'Judul', type: 'text', required: true, max: 120 },
      { name: 'text', label: 'Keterangan', type: 'textarea', max: 400 },
      common.sort
    ]
  },
  packages: {
    title: 'Paket harga', icon: 'wallet', table: 'packages', order: 'service_id, sort',
    columns: [{ key: 'service_id', label: 'Layanan', lookup: true }, { key: 'name', label: 'Paket' }, { key: 'price_label', label: 'Harga' }, { key: 'highlight', label: 'Unggulan', bool: true }, { key: 'published', label: 'Tampil', bool: true }],
    fields: [
      { name: 'service_id', label: 'Layanan', type: 'select', options: serviceOptions, required: true },
      { name: 'name', label: 'Nama paket', type: 'text', required: true, max: 80 },
      { name: 'price_label', label: 'Label harga', type: 'text', max: 60, default: 'Hubungi kami', help: 'Contoh: "Mulai Rp 2.500.000" atau "Hubungi kami". Isi harga sesuai kebijakan Anda.' },
      { name: 'description', label: 'Deskripsi singkat', type: 'textarea', max: 300 },
      { name: 'features', label: 'Daftar fitur', type: 'textarea', max: 1500, help: 'Satu fitur per baris.' },
      { name: 'highlight', label: 'Tandai sebagai "Paling dipilih"', type: 'checkbox', default: 0 },
      common.sort, common.published
    ]
  },
  portfolio: {
    title: 'Portofolio', icon: 'layout', table: 'portfolio', order: 'sort, id',
    columns: [{ key: 'title', label: 'Judul' }, { key: 'category', label: 'Kategori' }, { key: 'industry', label: 'Industri' }, { key: 'published', label: 'Tampil', bool: true }],
    fields: [
      { name: 'title', label: 'Judul proyek', type: 'text', required: true, max: 120 },
      { name: 'category', label: 'Kategori', type: 'text', required: true, max: 60, default: 'Company Profile', help: 'Dipakai sebagai filter, mis. Company Profile, Landing Page, Toko Online.' },
      { name: 'industry', label: 'Industri', type: 'text', max: 60 },
      { name: 'url', label: 'URL website (opsional)', type: 'url', max: 250 },
      { name: 'image', label: 'Gambar', type: 'image' },
      { name: 'tone', label: 'Warna latar (jika tanpa gambar)', type: 'select', options: toneOptions, default: 'blue' },
      { name: 'description', label: 'Deskripsi', type: 'textarea', max: 500 },
      common.sort, common.published
    ]
  },
  testimonials: {
    title: 'Testimoni', icon: 'star', table: 'testimonials', order: 'sort, id',
    columns: [{ key: 'name', label: 'Nama' }, { key: 'role', label: 'Jabatan/Usaha' }, { key: 'rating', label: 'Bintang' }, { key: 'published', label: 'Tampil', bool: true }],
    fields: [
      { name: 'name', label: 'Nama', type: 'text', required: true, max: 80 },
      { name: 'role', label: 'Jabatan / usaha', type: 'text', max: 100 },
      { name: 'quote', label: 'Isi testimoni', type: 'textarea', required: true, max: 800, help: 'Hanya masukkan testimoni asli dengan izin pemberinya.' },
      { name: 'rating', label: 'Bintang (1-5)', type: 'number', default: 5, min: 1, max: 5 },
      common.sort, common.published
    ]
  },
  faqs: {
    title: 'FAQ', icon: 'list', table: 'faqs', order: 'sort, id',
    columns: [{ key: 'question', label: 'Pertanyaan' }, { key: 'sort', label: 'Urutan' }, { key: 'published', label: 'Tampil', bool: true }],
    fields: [
      { name: 'question', label: 'Pertanyaan', type: 'text', required: true, max: 200 },
      { name: 'answer', label: 'Jawaban', type: 'textarea', required: true, max: 1500 },
      common.sort, common.published
    ]
  },
  articles: {
    title: 'Artikel', icon: 'news', table: 'articles', order: 'published_at DESC, id DESC', touch: true,
    columns: [{ key: 'title', label: 'Judul' }, { key: 'category', label: 'Kategori' }, { key: 'published_at', label: 'Tanggal' }, { key: 'published', label: 'Terbit', bool: true }],
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true, max: 160 },
      { name: 'slug', label: 'Slug (URL)', type: 'slug', required: true },
      { name: 'category', label: 'Kategori', type: 'text', max: 60, default: 'Panduan Website' },
      { name: 'label', label: 'Label kartu', type: 'text', max: 60 },
      { name: 'excerpt', label: 'Ringkasan', type: 'textarea', max: 300 },
      { name: 'body_html', label: 'Isi artikel (HTML)', type: 'html', required: true, help: 'Gunakan h2, h3, p, ul, ol, a, strong. Skrip dan atribut berbahaya dibuang otomatis.' },
      { name: 'cover', label: 'Gambar sampul', type: 'image' },
      { name: 'meta_title', label: 'Meta title', type: 'text', max: 70 },
      { name: 'meta_description', label: 'Meta description', type: 'textarea', max: 170 },
      { name: 'published_at', label: 'Tanggal terbit', type: 'date', required: true, default: new Date().toISOString().slice(0, 10) },
      common.published
    ]
  }
};

const SETTING_FIELDS = [
  { group: 'Identitas', fields: [
    { name: 'site_name', label: 'Nama situs', max: 80 },
    { name: 'legal_name', label: 'Nama badan usaha', max: 120 },
    { name: 'tagline', label: 'Tagline / deskripsi singkat', type: 'textarea', max: 200 }
  ] },
  { group: 'Hero beranda', fields: [
    { name: 'hero_title_a', label: 'Judul baris 1', max: 80 },
    { name: 'hero_title_b', label: 'Judul baris 2 (berwarna)', max: 80 },
    { name: 'hero_text', label: 'Teks hero', type: 'textarea', max: 400 }
  ] },
  { group: 'Kontak', fields: [
    { name: 'contact_email', label: 'Email', type: 'email', max: 150 },
    { name: 'contact_phone', label: 'Telepon', max: 40 },
    { name: 'whatsapp', label: 'Nomor WhatsApp (format 62812...)', max: 20 },
    { name: 'address_primary', label: 'Alamat utama', type: 'textarea', max: 250 },
    { name: 'address_secondary', label: 'Alamat kedua (opsional)', type: 'textarea', max: 250 },
    { name: 'opening_hours', label: 'Jam operasional', max: 100 },
    { name: 'city', label: 'Kota', max: 60 }, { name: 'region', label: 'Provinsi', max: 60 }
  ] },
  { group: 'Media sosial', fields: [
    { name: 'instagram', label: 'Instagram (URL)', type: 'url', max: 200 },
    { name: 'linkedin', label: 'LinkedIn (URL)', type: 'url', max: 200 },
    { name: 'youtube', label: 'YouTube (URL)', type: 'url', max: 200 }
  ] },
  { group: 'Lainnya', fields: [
    { name: 'member_launch', label: 'Jadwal Member Area (teks bebas, opsional)', max: 80 },
    { name: 'footer_note', label: 'Catatan footer', max: 200 }
  ] }
];

const PAGE_LABELS = {
  home: 'Beranda', 'tentang-kami': 'Tentang Kami', portofolio: 'Portofolio', testimoni: 'Testimoni', artikel: 'Artikel', kontak: 'Kontak', member: 'Member',
  'kebijakan-privasi': 'Kebijakan Privasi', 'syarat-ketentuan': 'Syarat & Ketentuan'
};

module.exports = { RESOURCES, SETTING_FIELDS, PAGE_LABELS };
