// Data awal. Semua naskah ditulis orisinal. Identitas bisnis = PLACEHOLDER, ganti lewat Admin > Pengaturan.

const settings = {
  site_name: 'Biru Website Indonesia',
  legal_name: 'PT Biru Website Indonesia (placeholder)',
  tagline: 'Website profesional untuk bisnis yang ingin tampil lebih meyakinkan.',
  hero_eyebrow: 'Jasa Pembuatan Website',
  hero_title_a: 'Website Profesional yang Mewakili',
  hero_title_b: 'Kualitas Bisnis Anda.',
  hero_text: 'Bangun kehadiran digital yang mencerminkan identitas dan keunggulan bisnis Anda. Kami merancang website dengan struktur jelas, tampilan rapi, dan pengalaman yang nyaman bagi pengunjung.',
  contact_email: 'halo@example.com',
  contact_phone: '+62 800-0000-0000',
  whatsapp: '6280000000000',
  address_primary: 'Alamat kantor belum diisi (ubah di Admin > Pengaturan).',
  address_secondary: '',
  city: 'Jakarta',
  region: 'DKI Jakarta',
  country: 'ID',
  opening_hours: 'Senin - Jumat, 09.00 - 17.00 WIB',
  instagram: '',
  linkedin: '',
  youtube: '',
  ga_id: '',
  member_launch: '',
  footer_note: 'Seluruh konten adalah contoh awal. Ganti dengan informasi bisnis Anda sebelum dipublikasikan.'
};

const pages = [
  { slug: 'home', title: 'Beranda', meta_title: 'Jasa Pembuatan Website Profesional | Biru Website Indonesia', meta_description: 'Jasa pembuatan website company profile, landing page, toko online, web application, dan hosting terkelola untuk bisnis, perusahaan, dan lembaga.' },
  { slug: 'tentang-kami', title: 'Tentang Kami', meta_title: 'Tentang Biru Website Indonesia', meta_description: 'Kenali perusahaan pengembangan website, aplikasi, dan infrastruktur digital untuk bisnis, perusahaan, dan lembaga.' },
  { slug: 'portofolio', title: 'Portofolio', meta_title: 'Portofolio Website | Biru Website Indonesia', meta_description: 'Contoh proyek website untuk company profile, landing page, toko online, dan kebutuhan bisnis lainnya.' },
  { slug: 'testimoni', title: 'Testimoni', meta_title: 'Testimoni Klien | Biru Website Indonesia', meta_description: 'Pengalaman klien yang bekerja sama dengan kami dalam membangun website dan sistem digital.' },
  { slug: 'artikel', title: 'Artikel & Panduan', meta_title: 'Artikel & Panduan Website | Biru Website Indonesia', meta_description: 'Panduan praktis seputar perencanaan, pembuatan, pengelolaan, dan pengembangan website bisnis.' },
  { slug: 'kontak', title: 'Kontak', meta_title: 'Kontak Biru Website Indonesia', meta_description: 'Hubungi kami untuk konsultasi website dan kebutuhan digital melalui form, WhatsApp, atau email.' },
  { slug: 'member', title: 'Member Area', meta_title: 'Member Area Segera Hadir | Biru Website Indonesia', meta_description: 'Member Area sedang dipersiapkan untuk mengelola layanan hosting, domain, dan email bisnis Anda.' },
  {
    slug: 'kebijakan-privasi', title: 'Kebijakan Privasi', meta_title: 'Kebijakan Privasi | Biru Website Indonesia',
    meta_description: 'Kebijakan privasi mengenai pengumpulan, penggunaan, penyimpanan, dan perlindungan data pengguna.',
    body_html: `<h2>Ruang Lingkup</h2>
<p>Kebijakan ini menjelaskan bagaimana kami mengelola informasi yang Anda berikan saat menggunakan situs ini, termasuk melalui formulir kontak.</p>
<h2>Data yang Kami Kelola</h2>
<p>Kami menyimpan nama, alamat email, nomor telepon (jika diisi), layanan yang diminati, dan isi pesan yang Anda kirim. Alamat IP disimpan untuk pencegahan spam dan penyalahgunaan.</p>
<h2>Penggunaan Data</h2>
<p>Data digunakan untuk menanggapi pertanyaan Anda, menyusun penawaran, dan meningkatkan layanan. Data tidak dijual kepada pihak ketiga.</p>
<h2>Penyimpanan dan Keamanan</h2>
<p>Data disimpan pada server kami dengan pembatasan akses dan pencadangan berkala. Tidak ada metode penyimpanan yang sepenuhnya bebas risiko, namun kami menerapkan langkah yang wajar untuk melindungi data.</p>
<h2>Cookie dan Analytics</h2>
<p>Situs ini hanya memakai cookie yang diperlukan untuk area admin. Jika layanan analytics diaktifkan, penggunaannya akan dijelaskan pada bagian ini.</p>
<h2>Hak Anda</h2>
<p>Anda dapat meminta akses, perbaikan, atau penghapusan data pribadi Anda dengan menghubungi kami melalui email pada halaman Kontak.</p>
<p><em>Catatan: ini adalah naskah awal. Mintalah penasihat hukum meninjau dan menyesuaikannya dengan kondisi bisnis dan peraturan yang berlaku (termasuk UU Pelindungan Data Pribadi) sebelum dipublikasikan.</em></p>`
  },
  {
    slug: 'syarat-ketentuan', title: 'Syarat dan Ketentuan', meta_title: 'Syarat dan Ketentuan Layanan | Biru Website Indonesia',
    meta_description: 'Syarat dan ketentuan layanan pembuatan website, termasuk pengerjaan, revisi, domain, hosting, dan dukungan.',
    body_html: `<h2>Dasar Kerja Sama</h2>
<p>Ruang lingkup, harga, jadwal, dan metode pembayaran disepakati secara tertulis sebelum pekerjaan dimulai.</p>
<h2>Materi dan Pengerjaan</h2>
<p>Klien menyediakan materi (logo, teks, foto) yang dibutuhkan dan bertanggung jawab atas keabsahan hak penggunaannya. Keterlambatan materi dapat memengaruhi jadwal.</p>
<h2>Peninjauan dan Revisi</h2>
<p>Revisi dilakukan pada masa peninjauan sesuai ruang lingkup yang disepakati. Permintaan di luar ruang lingkup dikerjakan berdasarkan kesepakatan terpisah.</p>
<h2>Domain, Hosting, dan Akses</h2>
<p>Domain dan akun layanan didaftarkan atas nama klien kecuali disepakati lain. Kami menyerahkan informasi akses yang diperlukan setelah pelunasan.</p>
<h2>Setelah Website Aktif</h2>
<p>Pembaruan konten setelah peluncuran menjadi tanggung jawab klien, kecuali tercakup dalam paket pemeliharaan yang disepakati.</p>
<h2>Ketentuan Hukum</h2>
<p>Perselisihan diselesaikan secara musyawarah. Jika tidak tercapai, diselesaikan sesuai hukum Republik Indonesia.</p>
<p><em>Catatan: ini adalah naskah awal. Mintalah penasihat hukum meninjau dan menyesuaikannya sebelum dipublikasikan.</em></p>`
  }
];

const std = {
  steps: [
    ['Konsultasi', 'Membahas tujuan bisnis, target pengunjung, serta kebutuhan halaman dan fitur.'],
    ['Perencanaan', 'Menyusun struktur halaman, alur navigasi, dan lingkup pekerjaan yang disepakati.'],
    ['Produksi', 'Membangun desain dan fungsi berdasarkan materi serta arah visual yang disetujui.'],
    ['Peninjauan', 'Meninjau hasil bersama Anda, mengolah masukan, dan menguji tampilan serta fungsi.'],
    ['Peluncuran', 'Mengaktifkan website dan menyampaikan panduan pengelolaan serta jalur bantuan.']
  ]
};

function pk(name, price, desc, features, highlight) {
  return { name, price_label: price, description: desc, features: features.join('\n'), highlight: highlight ? 1 : 0 };
}

const services = [
  {
    slug: 'company-profile', name: 'Website Company Profile', icon: 'building',
    summary: 'Hadirkan profil perusahaan, layanan, dan pengalaman dalam website yang terstruktur agar calon pelanggan dan mitra mengenal bisnis Anda.',
    hero_title: 'Representasikan perusahaan Anda secara lebih profesional.',
    hero_text: 'Website company profile yang menyampaikan siapa Anda, apa yang Anda tawarkan, dan bagaimana orang dapat menghubungi Anda.',
    intro_title: 'Website yang membantu perusahaan tampil lebih jelas dan terpercaya.',
    intro_text: 'Informasi perusahaan disusun ke dalam halaman yang jelas, dari profil, layanan, portofolio, hingga kontak, sehingga pengunjung cepat menemukan yang mereka cari.',
    meta_title: 'Jasa Website Company Profile | Biru Website Indonesia',
    meta_description: 'Website company profile profesional untuk bisnis, perusahaan, dan lembaga dengan domain, hosting, email bisnis, SEO dasar, dan SSL.',
    keyword: 'jasa website company profile',
    audience: [['Perusahaan', 'Tampilkan profil, visi, dan layanan secara resmi.'], ['UMKM & Bisnis', 'Bangun kepercayaan sebelum calon pelanggan menghubungi.'], ['Lembaga & Organisasi', 'Sampaikan program dan informasi kepada publik.'], ['Kontraktor & Supplier', 'Tunjukkan pengalaman proyek dan kapabilitas.'], ['Konsultan & Profesional', 'Perkenalkan keahlian dan cara kerja Anda.'], ['Institusi Pendidikan', 'Sajikan program, fasilitas, dan informasi pendaftaran.']],
    feature: [['Struktur halaman jelas', 'Beranda, tentang, layanan, portofolio, dan kontak tersusun rapi.'], ['Responsif', 'Nyaman dibuka di ponsel, tablet, dan desktop.'], ['SEO dasar', 'Judul, deskripsi, sitemap, dan data terstruktur disiapkan.'], ['Domain, hosting, SSL', 'Paket lengkap agar website langsung dapat diakses aman.']],
    packages: [
      pk('CP Essential', 'Rp 1.500.000', 'Untuk bisnis yang membutuhkan profil ringkas dan siap online.', ['5 halaman website', 'Domain .com', 'Hosting 3 GB', '7 email perusahaan', 'Copywriting konten gratis', 'Integrasi WhatsApp', 'Form kontak', 'Desain responsif', 'SEO dasar', 'SSL', 'Optimasi kecepatan website', 'Revisi unlimited', 'Pengerjaan 6 hari', 'Perpanjangan Rp 500.000/tahun'], false),
      pk('CP Business', 'Rp 2.500.000', 'Untuk perusahaan dengan konten lebih lengkap dan kebutuhan pelacakan.', ['Semua fitur CP Essential', '10 halaman website', '15 email perusahaan', 'Google Analytics 4', 'Google Tag Manager', 'WhatsApp lead tracking', 'Form submission tracking', 'Google Search Console', 'Halaman produk/layanan', 'Integrasi media sosial', 'Struktur CTA berorientasi konversi', 'Dukungan teknis setelah website live', 'Perpanjangan Rp 500.000/tahun'], true),
      pk('CP Signature', 'Rp 4.000.000', 'Untuk kebutuhan tampilan dan fitur lebih khusus.', ['Semua fitur CP Business', '20 halaman website', '30 email perusahaan', 'Halaman produk/layanan dengan detail', 'Desain lebih custom/premium', 'Integrasi Meta Pixel', 'Google Ads conversion tracking', 'Conversion tracking lebih lengkap', 'Integrasi tambahan', 'Prioritas pengerjaan dan dukungan', 'Perpanjangan Rp 500.000/tahun'], false)
    ]
  },
  {
    slug: 'landing-page', name: 'Website Landing Page', icon: 'layout',
    summary: 'Sampaikan penawaran produk, jasa, atau kampanye melalui halaman yang berfokus pada satu tujuan, dengan informasi dan langkah berikutnya yang jelas.',
    hero_title: 'Satu halaman. Satu tujuan. Komunikasi yang lebih terarah.',
    hero_text: 'Landing page untuk menyampaikan satu penawaran dengan jelas dan mengarahkan pengunjung ke satu tindakan.',
    intro_title: 'Landing page yang dibangun untuk menyampaikan pesan dengan lebih fokus.',
    intro_text: 'Setiap bagian punya peran: membuka dengan manfaat, menjelaskan bukti, lalu mengajak pengunjung mengambil langkah berikutnya.',
    meta_title: 'Jasa Landing Page Profesional | Biru Website Indonesia',
    meta_description: 'Landing page custom untuk bisnis, produk, jasa, dan kampanye dengan desain profesional, domain, hosting, dan dukungan.',
    keyword: 'jasa landing page',
    audience: [['Produk Baru', 'Perkenalkan produk dengan alur yang meyakinkan.'], ['Jasa Profesional', 'Jelaskan layanan dan ajak calon klien berkonsultasi.'], ['Campaign', 'Halaman khusus untuk promosi dan musim tertentu.'], ['Lead Generation', 'Kumpulkan kontak calon pelanggan melalui form.'], ['Personal Brand', 'Bangun reputasi pribadi atau profesional.'], ['Event & Program', 'Sampaikan jadwal, manfaat, dan pendaftaran.']],
    feature: [['Fokus pada satu CTA', 'Struktur halaman mengarah ke satu tindakan utama.'], ['Form ke WhatsApp/email', 'Pesan masuk langsung ke tim Anda.'], ['Cepat dimuat', 'Aset ringan agar pengunjung tidak menunggu.'], ['Siap diukur', 'Dapat dipasangi analytics sesuai kebutuhan.']],
    packages: [
      pk('LP Essential', 'Rp 500.000', 'Landing page sederhana yang siap dipakai untuk bisnis.', ['1 halaman website', 'Domain .com', 'Hosting 3 GB', '1 email perusahaan', 'Copywriting konten gratis', 'Integrasi WhatsApp', 'Form kontak', 'Desain responsif', 'SEO dasar', 'SSL', 'Optimasi kecepatan website', 'Revisi unlimited', 'Pengerjaan 2 hari', 'Perpanjangan Rp 500.000/tahun'], false),
      pk('LP Business', 'Rp 1.000.000', 'Landing page lebih lengkap dan siap memantau performa.', ['Semua fitur LP Essential', '3 email perusahaan', 'Google Analytics 4', 'Google Tag Manager', 'WhatsApp lead tracking', 'Form submission tracking', 'Google Search Console', 'Section lebih lengkap', 'Integrasi media sosial', 'Struktur CTA berorientasi konversi', 'Dukungan teknis setelah website live', 'Perpanjangan Rp 500.000/tahun'], true),
      pk('LP Signature', 'Rp 1.500.000', 'Landing page lebih custom dengan integrasi luas untuk brand.', ['Semua fitur LP Business', '5 email perusahaan', 'Desain lebih custom/premium', 'Integrasi Meta Pixel', 'Google Ads conversion tracking', 'Conversion tracking lebih lengkap', 'Integrasi tambahan', 'Prioritas pengerjaan dan dukungan', 'Perpanjangan Rp 500.000/tahun'], false)
    ]
  },
  {
    slug: 'toko-online', name: 'Website Toko Online', icon: 'cart',
    summary: 'Tampilkan produk secara terorganisasi dan bantu pelanggan menemukan informasi sebelum membeli. Fitur pemesanan disesuaikan dengan kebutuhan bisnis.',
    hero_title: 'Bangun sistem penjualan online yang bekerja lebih terstruktur.',
    hero_text: 'Dari katalog, keranjang, hingga pesanan masuk, semuanya dikelola dari satu dashboard.',
    intro_title: 'Lebih dari sekadar katalog produk.',
    intro_text: 'Fondasi toko online untuk proses penjualan yang lebih rapi: produk, pembayaran, ongkos kirim, dan pemantauan pesanan.',
    meta_title: 'Jasa Website Toko Online | Biru Website Indonesia',
    meta_description: 'Website toko online dengan katalog, checkout, integrasi pembayaran dan ongkos kirim, serta dashboard pengelolaan pesanan.',
    keyword: 'jasa website toko online',
    audience: [['Brand Fashion', 'Katalog dengan varian ukuran dan warna.'], ['Produk Pertanian', 'Pesanan dengan satuan dan wilayah kirim.'], ['Toko Komunitas', 'Merchandise dan produk digital.'], ['Reseller & Distributor', 'Harga bertingkat dan katalog besar.']],
    feature: [['Produk & checkout', 'Kategori, varian, stok, dan alur pembayaran.'], ['Payment gateway', 'Integrasi pembayaran sesuai penyedia pilihan Anda.'], ['Cek ongkir', 'Perhitungan ongkos kirim dengan penyedia ekspedisi.'], ['Notifikasi order', 'Kabar pesanan baru melalui email atau WhatsApp.'], ['Dashboard pesanan', 'Pantau pesanan dan status pengiriman.'], ['Responsive commerce', 'Nyaman untuk belanja lewat ponsel.']],
    step: [['Produk', 'Pelanggan memilih produk dan varian.'], ['Checkout', 'Mengisi alamat dan memilih ekspedisi.'], ['Pembayaran', 'Membayar melalui metode yang tersedia.'], ['Pemrosesan', 'Tim memproses dan mengemas pesanan.'], ['Pengiriman', 'Nomor resi dikirim ke pelanggan.']],
    packages: [
      pk('Commerce Essential', 'Rp 2.500.000', 'Untuk bisnis yang ingin mulai berjualan online dengan sistem transaksi lengkap.', ['Produk unlimited', 'Domain .com, .id, atau .co.id', 'Hosting 3 GB', 'Revisi unlimited', 'Keranjang dan checkout online', 'Payment gateway QRIS dan Virtual Account', 'Cek ongkir otomatis via RajaOngkir', 'Notifikasi order', '10 email perusahaan', 'Dashboard pengelolaan pesanan', 'Responsive, SEO dasar, dan SSL', 'Pengerjaan sekitar 6 hari', 'Perpanjangan Rp 500.000/tahun'], false),
      pk('Commerce Automation', 'Rp 5.000.000', 'Untuk toko online yang ingin mengurangi pekerjaan manual pada order dan pengiriman.', ['Semua fitur Commerce Essential', 'Pembuatan resi otomatis', 'Pickup kurir otomatis', 'Tracking pengiriman', 'Cetak label pengiriman', 'Status pesanan lebih terstruktur', '20 email perusahaan', 'Google Analytics', 'Google Search Console', 'Integrasi Meta Pixel', 'Prioritas dukungan', 'Perpanjangan Rp 500.000/tahun'], true),
      pk('Commerce Signature', 'Rp 7.500.000', 'Untuk bisnis yang butuh toko online sekaligus sistem akun pelanggan lengkap.', ['Semua fitur Commerce Automation', 'Login dan registrasi member', 'Dashboard member', 'Riwayat dan detail pesanan', 'Status pesanan untuk member', 'Profil dan alamat pengiriman tersimpan', 'Manajemen data pelanggan', '30 email perusahaan', 'Desain lebih custom/premium', 'Integrasi tambahan', 'Prioritas pengerjaan dan dukungan', 'Perpanjangan Rp 500.000/tahun'], false)
    ]
  },
  {
    slug: 'website-custom', name: 'Website Custom', icon: 'puzzle',
    summary: 'Kembangkan website dengan fitur dan alur kerja khusus. Kebutuhan sistem serta integrasi dibahas agar pengembangan memiliki arah yang jelas.',
    hero_title: 'Website yang dibangun mengikuti kebutuhan bisnis Anda.',
    hero_text: 'Untuk kebutuhan yang tidak tertampung oleh paket standar: pencarian, direktori, booking, kalkulator, hingga integrasi API.',
    intro_title: 'Tidak dibatasi oleh daftar fitur paket.',
    intro_text: 'Kebutuhan dirumuskan lebih dulu, lalu diterjemahkan menjadi struktur, tampilan, dan fungsi yang jelas.',
    meta_title: 'Jasa Website Custom | Biru Website Indonesia',
    meta_description: 'Website dengan struktur, fungsi, alur, dan integrasi khusus yang dirancang sesuai kebutuhan bisnis dan pengalaman pengguna.',
    keyword: 'jasa website custom',
    audience: [['Direktori & Listing', 'Daftar bisnis, properti, atau kendaraan.'], ['Booking & Reservasi', 'Jadwal dan pemesanan layanan.']],
    feature: [['Pencarian & filter', 'Temukan data dengan cepat.'], ['Direktori & listing', 'Kelola daftar dengan kategori.'], ['Form dinamis', 'Form bercabang sesuai jawaban.'], ['Booking & reservasi', 'Pilih jadwal dan konfirmasi otomatis.'], ['Kalkulator & simulasi', 'Hitung estimasi biaya atau cicilan.'], ['Integrasi API', 'Hubungkan dengan sistem lain.']],
    step: [['Konsultasi', 'Menggali tujuan dan masalah yang ingin diselesaikan.'], ['Requirement', 'Menyusun daftar kebutuhan dan batasan.'], ['UI / UX', 'Merancang alur dan tampilan.'], ['Development', 'Membangun fitur secara bertahap.'], ['Testing', 'Menguji sebelum peluncuran.']],
    packages: []
  },
  {
    slug: 'portal-berita', name: 'Website Berita', icon: 'news',
    summary: 'Dirancang untuk media, organisasi, dan portal informasi yang membutuhkan struktur artikel, kategori, pencarian, dan pengelolaan konten yang jelas.',
    hero_title: 'Publikasi lebih cepat. Redaksi lebih terstruktur.',
    hero_text: 'Portal berita dengan dashboard redaksi, kategori, multi-penulis, dan SEO yang disiapkan sejak awal.',
    intro_title: 'Lebih dari sekadar blog. Dibangun untuk ritme publikasi yang terus berjalan.',
    intro_text: 'Konten bergerak dari ide hingga publikasi dengan alur yang jelas dan mudah dikelola tim redaksi.',
    meta_title: 'Jasa Website Portal Berita | Biru Website Indonesia',
    meta_description: 'Portal berita dengan dashboard redaksi, artikel tanpa batas, multi-author, kategori, SEO, dan dukungan teknis.',
    keyword: 'jasa website portal berita',
    audience: [['Media Lokal', 'Berita daerah dengan rubrik tetap.'], ['Organisasi', 'Siaran pers dan kabar kegiatan.']],
    feature: [['Dashboard admin', 'Tulis, atur, dan jadwalkan artikel.'], ['Berita unlimited', 'Tidak dibatasi jumlah artikel.'], ['Kategori & tag', 'Susun konten agar mudah dijelajahi.'], ['Multi author', 'Beberapa penulis dengan peran berbeda.'], ['Pencarian & related', 'Temukan dan rekomendasikan artikel.'], ['SEO & social preview', 'Metadata siap dibagikan.']],
    packages: [
      pk('News Essential', 'Rp 1.000.000', 'Fondasi publikasi portal berita yang profesional dan mudah dikelola.', ['Artikel unlimited', 'Kategori berita', 'Dashboard admin', 'Halaman detail berita', 'Pencarian dan berita terkait', 'Share ke media sosial', 'Domain .com', 'Hosting 3 GB', '5 email perusahaan', 'Responsive, SEO dasar, dan SSL', 'Revisi unlimited', 'Perpanjangan Rp 500.000/tahun'], false),
      pk('News Business', 'Rp 2.000.000', 'Untuk media dengan beberapa penulis dan fitur publikasi lebih lengkap.', ['Semua fitur News Essential', 'Multi author', 'Peran Admin, Editor, dan Writer', 'Berita breaking, trending, dan featured', 'Tag dan jadwal publikasi', 'Draft artikel dan halaman penulis', '15 email perusahaan', 'Google Analytics dan Search Console', 'Slot banner iklan', 'Optimasi struktur SEO berita', 'Perpanjangan Rp 500.000/tahun'], true),
      pk('News Signature', 'Rp 3.000.000', 'Untuk perusahaan media yang butuh alur redaksi penuh dan monetisasi.', ['Semua fitur News Business', 'Workflow redaksi (Draft, Review, Approval, Publish)', 'Manajemen tim redaksi', 'Peran Reporter, Editor, dan Administrator', 'Manajemen banner iklan', 'Statistik konten dan newsletter', '30 email perusahaan', 'Desain lebih custom/premium', 'Integrasi tambahan', 'Prioritas pengerjaan dan dukungan', 'Perpanjangan Rp 500.000/tahun'], false)
    ]
  },
  {
    slug: 'web-application', name: 'Web Application', icon: 'dashboard',
    summary: 'Cocok untuk sistem internal maupun layanan digital yang membutuhkan dashboard, database, autentikasi, dan alur kerja custom melalui browser.',
    hero_title: 'Sistem & dashboard berbasis web untuk operasional yang lebih terstruktur.',
    hero_text: 'Aplikasi web untuk menjalankan proses bisnis: dari input data, persetujuan, hingga laporan.',
    intro_title: 'Bukan sekadar website. Dibangun untuk menjalankan proses.',
    intro_text: 'Modul disusun mengikuti cara sistem akan digunakan oleh timnya sehari-hari.',
    meta_title: 'Jasa Web Application & Dashboard | Biru Website Indonesia',
    meta_description: 'Web application custom untuk dashboard, database, multi-user, workflow, approval, laporan, dan integrasi.',
    keyword: 'jasa pembuatan web application',
    audience: [['Dashboard Operasional', 'Pantau angka penting dalam satu layar.'], ['Sistem Absensi', 'Catat kehadiran dan rekap otomatis.'], ['CRM & Sales', 'Kelola prospek dan penjualan.'], ['Sistem Approval', 'Alur persetujuan berjenjang.'], ['Keuangan Internal', 'Catat pemasukan dan pengeluaran.'], ['Portal Member', 'Area khusus anggota atau pelanggan.']],
    feature: [['Authentication', 'Login aman dan pemulihan akses.'], ['User management', 'Peran dan hak akses per pengguna.'], ['Data management', 'Input, ubah, dan ekspor data.'], ['Workflow', 'Alur kerja dengan status.'], ['Reporting', 'Laporan dan grafik.'], ['Notification', 'Pemberitahuan email atau WhatsApp.'], ['Integration', 'Sambung ke sistem lain melalui API.'], ['Activity & audit', 'Jejak perubahan data.']],
    step: [['Input', 'Pengguna memasukkan data.'], ['Proses', 'Sistem memvalidasi dan menjalankan alur.'], ['Approval', 'Atasan meninjau dan menyetujui.'], ['Laporan', 'Data tersaji sebagai laporan.']],
    packages: []
  },
  {
    slug: 'mobile-app', name: 'Mobile App', icon: 'phone',
    summary: 'Pengalaman aplikasi dibuat dengan alur yang fokus, antarmuka responsif, dan ruang integrasi dengan backend atau sistem bisnis yang dibutuhkan.',
    hero_title: 'Aplikasi untuk kebutuhan bisnis, dibangun sesuai cara kerja Anda.',
    hero_text: 'Aplikasi Android/iOS yang terhubung dengan sistem di belakangnya.',
    intro_title: 'Lebih dekat dengan pengguna melalui aplikasi di smartphone.',
    intro_text: 'Fungsi aplikasi disusun sesuai kebutuhan pengguna dan terhubung dengan backend yang aman.',
    meta_title: 'Jasa Mobile App Custom | Biru Website Indonesia',
    meta_description: 'Mobile app custom untuk bisnis dengan login, dashboard, transaksi, notifikasi, backend, dan API.',
    keyword: 'jasa pembuatan aplikasi mobile',
    audience: [['Aplikasi Member', 'Akun, kartu, dan riwayat.'], ['Aplikasi Booking', 'Pemesanan layanan dari ponsel.'], ['Aplikasi E-Commerce', 'Belanja langsung dari aplikasi.'], ['Aplikasi Pendidikan', 'Materi dan progres belajar.'], ['Aplikasi Operasional', 'Alat kerja lapangan.'], ['Aplikasi Loyalty', 'Poin dan promo.'], ['Layanan Pelanggan', 'Tiket dan chat.'], ['Aplikasi Custom', 'Sesuai kebutuhan Anda.']],
    feature: [['Authentication', 'Login dan keamanan akun.'], ['Profile', 'Data pengguna.'], ['Notification', 'Push notification.'], ['Transaction', 'Pembayaran dan riwayat.'], ['Content', 'Artikel dan katalog.'], ['Communication', 'Pesan dan tiket.'], ['Location', 'Peta dan lokasi.'], ['Camera & file', 'Unggah foto dan dokumen.']],
    step: [['Aplikasi', 'Pengguna memakai aplikasi di ponsel.'], ['API', 'Aplikasi berkomunikasi dengan server.'], ['Database', 'Data tersimpan aman.'], ['Dashboard', 'Tim mengelola data melalui admin.']],
    packages: []
  },
  {
    slug: 'managed-hosting-server', name: 'Managed Hosting & Server', icon: 'server',
    summary: 'Penyiapan dan pengelolaan infrastruktur untuk membantu deployment, keamanan dasar, backup, dan pemantauan layanan berjalan lebih terorganisir.',
    hero_title: 'Infrastruktur yang dikelola. Website tetap fokus berjalan.',
    hero_text: 'Hosting dan server terkelola dengan konfigurasi, keamanan, backup, dan pemantauan.',
    intro_title: 'Hosting bukan hanya soal ruang penyimpanan.',
    intro_text: 'Performa, keamanan, backup, dan pemantauan dikelola agar Anda dapat fokus pada bisnis.',
    meta_title: 'Managed Hosting & Server | Biru Website Indonesia',
    meta_description: 'Hosting dan server terkelola dengan konfigurasi, keamanan, backup, monitoring, migrasi, SSL, DNS, dan email.',
    keyword: 'managed hosting server',
    audience: [['Managed Hosting', 'Untuk website yang butuh hosting siap pakai.'], ['Managed Server', 'Untuk aplikasi dengan konfigurasi khusus.']],
    feature: [['Server configuration', 'Penyiapan web server dan runtime.'], ['Domain & DNS', 'Pengaturan domain dan rekaman DNS.'], ['SSL', 'Sertifikat HTTPS.'], ['Email hosting', 'Email dengan domain bisnis.'], ['Database', 'Penyiapan dan optimasi.'], ['Security', 'Pengerasan dasar dan pembaruan.'], ['Backup', 'Cadangan terjadwal.'], ['Monitoring', 'Pemantauan ketersediaan.']],
    packages: []
  }
];

const portfolio = [
  ["Chaubok Nousa", "Landing Page", "Makanan", "blue", "", "/uploads/portfolio/4d8cda67-4c3e-4924-b932-5fe7e8a0bb74.webp"],
  ["Agro Global Nusantara", "Landing Page", "Export", "sky", "", "/uploads/portfolio/0db029af-878b-4423-90ec-90f21c4a354a.webp"],
  ["Arini Bali Pool", "Landing Page", "Service pool", "sand", "", "/uploads/portfolio/5a760ce9-7388-421e-a6c0-2f3b312b2c81.webp"],
  ["Arta Putra Nugraha", "Landing Page", "Furniture", "blue", "", "/uploads/portfolio/50b3aed9-a247-44ef-9985-f14c4176cea0.webp"],
  ["AyoKembali", "Landing Page", "Wisata", "sky", "", "/uploads/portfolio/e1e46a58-20cd-4f61-97ac-730616e1a118.webp"],
  ["Bos Laundry", "Landing Page", "Laundry", "sand", "", "/uploads/portfolio/d032df96-318b-45c6-be00-80ea509e47ae.webp"],
  ["Chaubok Kpk", "Landing Page", "Kuliner", "blue", "", "/uploads/portfolio/a767751f-c833-4b5c-bf3a-43d488ea1aad.webp"],
  ["Choeru Essential", "Landing Page", "Minyak kemiri", "sky", "", "/uploads/portfolio/f4d25af2-b313-4980-b988-4015e6329b10.webp"],
  ["LSP Cipta Sarana Education", "Landing Page", "Edukasi", "sand", "", "/uploads/portfolio/8cda73ac-2830-4b9b-aac4-69d59ae9bd8d.webp"],
  ["Cuanki Ajah", "Landing Page", "Kuliner", "blue", "", "/uploads/portfolio/2c2027c2-52d4-452c-a4f1-35d7396a7f3b.webp"],
  ["Duta Panghegar Interior", "Landing Page", "Interior", "sky", "", "/uploads/portfolio/9860e32e-1858-4248-a407-d0fda7c03faf.webp"],
  ["Pengacara Dan Konsultan", "Landing Page", "Advokat", "sand", "", "/uploads/portfolio/2e4d4068-b364-4657-98f2-cffb6b07a1a0.webp"],
  ["Gavin Global", "Landing Page", "Ekspor Pertanian", "blue", "", "/uploads/portfolio/70a259db-71a8-42c0-8085-bc99bfd26fae.webp"],
  ["Griya Jagad Asyif", "Landing Page", "Kesehatan", "sky", "", "/uploads/portfolio/11b1732c-c1e3-48cc-9033-527002a28687.webp"],
  ["Indosat HiFi Fiber", "Landing Page", "Internet", "sand", "", "/uploads/portfolio/c342a1c0-e300-499b-bf3c-ce46e4e13af1.webp"],
  ["Indosat Hifi", "Landing Page", "Internet", "blue", "", "/uploads/portfolio/6115afc4-bf0e-4c16-bc5b-3271273f8611.webp"],
  ["KB Samsat Bojonegoro", "Landing Page", "Layanan pajak kendaraan", "sky", "", "/uploads/portfolio/dcaec9e0-d7d5-44d9-af39-1445575e8573.webp"],
  ["Kementerian Haji dan Umrah", "Landing Page", "Travel Haji dan Umrah", "sand", "", "/uploads/portfolio/e5bf41f3-dbf9-4087-8399-bea5e981bce7.webp"],
  ["Klinik Materna", "Landing Page", "Kesehatan", "blue", "", "/uploads/portfolio/f86b2b19-e5cb-4f98-8e30-273dbdaa7aa8.webp"],
  ["ASCO Lepas", "Landing Page", "Otomotif", "sky", "", "/uploads/portfolio/27e20881-6940-4f87-a289-92845bfa551f.webp"],
  ["Livaya Impact", "Landing Page", "Lembaga pelatihan", "sand", "", "/uploads/portfolio/70e74f21-84d1-4761-a725-baa49608c1df.webp"],
  ["LSP Sinar Mandiri Education", "Landing Page", "Manajemen", "blue", "", "/uploads/portfolio/6f9dc1f9-e63b-48ab-90f8-b5f7b67a9a63.webp"],
  ["Marhumi Abadi", "Landing Page", "Travel", "sky", "", "/uploads/portfolio/2c22028d-331a-4166-8671-21e3bbbb78bf.webp"],
  ["PT Naya Global Group", "Landing Page", "Konstruksi", "sand", "", "/uploads/portfolio/f9a4b746-eb6d-49e1-ad74-47071dece0d5.webp"],
  ["PT Pacific General Services", "Landing Page", "Rental kendaraan tambang", "blue", "", "/uploads/portfolio/b6ac1455-38b6-4119-adef-a80380decdf2.webp"],
  ["PT Asuransi Jiwa Manulife", "Landing Page", "Asuransi", "sky", "", "/uploads/portfolio/f5f358c8-34fa-41ef-8b22-da9643d2cedb.webp"],
  ["Pradnya Denbukit Edukasi", "Landing Page", "Penerbitan", "sand", "", "/uploads/portfolio/5a24199a-fceb-4ad1-9f99-f0d47134f902.webp"],
  ["Purple Spa", "Landing Page", "Kesehatan", "blue", "", "/uploads/portfolio/66b927a9-5029-463e-a047-152b43a6c058.webp"],
  ["PT Rekacipta Konstruksi", "Landing Page", "Konstruksi", "sky", "", "/uploads/portfolio/2cf08aa4-7592-4bab-a11e-8307e475d612.webp"],
  ["PT Thuba Medika Kencana", "Landing Page", "Alat kesehatan", "sand", "", "/uploads/portfolio/0494faa3-cd8f-437d-9da6-acff1963d29a.webp"],
  ["Rental & Private Transport", "Landing Page", "Rental", "blue", "", "/uploads/portfolio/8bf1b55a-bb57-4f21-8f78-d7a1b75d07ea.webp"],
  ["SPPG", "Landing Page", "Makanan", "sky", "", "/uploads/portfolio/ded090b3-a3f9-49e8-9608-9332655321c0.webp"],
  ["Sukma Pyrous", "Landing Page", "Motivator", "sand", "", "/uploads/portfolio/23c2a4d1-a05a-43a3-8c66-ab67b0288731.webp"],
  ["Titik Dingin Solusi", "Landing Page", "Service", "blue", "", "/uploads/portfolio/efc512a3-a06a-41bb-9e2a-81543741f1f0.webp"],
  ["Wanstore", "Landing Page", "Top up game", "sky", "", "/uploads/portfolio/3e6fd0df-8f0e-423d-a0ee-98a7a39f39ed.webp"],
  ["Yasanta", "Landing Page", "Konsultasi Bisnis", "sand", "", "/uploads/portfolio/de578aa3-59a4-4907-91fe-26106bcc6e8e.webp"],
  ["Toyota Cibubur", "Landing Page", "Otomotif", "blue", "", "/uploads/portfolio/fd410dbd-4b82-40b5-9395-6089c7440b5b.webp"],
  ["Yayasan Abdurrahman Alfatih", "Company Profile", "Yayasan", "sky", "", "/uploads/portfolio/eca9e20c-a786-41bd-a8ce-9a4572ae39ce.webp"],
  ["PT Akasta Cargo", "Company Profile", "Cargo", "sand", "", "/uploads/portfolio/9387ee07-b676-41ae-920b-a9b16406d1fd.webp"],
  ["PT Akbars Shipbuilding", "Company Profile", "Engineering", "blue", "", "/uploads/portfolio/10e00729-2d40-4ab4-b8a5-434673d4e5f3.webp"],
  ["Being SmartEdu", "Company Profile", "Edukasi", "sky", "", "/uploads/portfolio/06e9455c-64dd-4049-ac36-f47230b8a5f1.webp"],
  ["BANA & Co.", "Company Profile", "Advokat", "sand", "", "/uploads/portfolio/28dfb78f-31bb-4a98-ba8f-60617cfff043.webp"],
  ["BYD", "Company Profile", "Otomotif", "blue", "", "/uploads/portfolio/ff2fdf1f-a41f-49bb-b933-65ab602ec7b3.webp"],
  ["Create Media", "Company Profile", "Out-of-Home advertising", "sky", "", "/uploads/portfolio/7a11ea75-df08-4af0-8e50-1a2b7cbb5a72.webp"],
  ["Geely", "Company Profile", "Otomotif", "sand", "", "/uploads/portfolio/93c8a9a5-441c-4065-a9bb-ffcc92a4c567.webp"],
  ["Damitech Mekanika Indonesia", "Company Profile", "Mekanikal", "blue", "", "/uploads/portfolio/a0cc86bb-6024-42ae-a451-4b7a8903276b.webp"],
  ["KiranaEdu", "Company Profile", "Publikasi", "sky", "", "/uploads/portfolio/bd66854e-0f9a-4516-a6ba-1925cf44d9d0.webp"],
  ["Kouta Lombok Transfers", "Company Profile", "Travel internasional", "sand", "", "/uploads/portfolio/fa2f4a25-cb1c-46df-ad7d-6cf30778beec.webp"],
  ["Lombok Tours Home", "Company Profile", "Wisata", "blue", "", "/uploads/portfolio/fe39c313-51f8-4f6d-bd93-7872fc14daf7.webp"],
  ["Luthfi Logam", "Company Profile", "Kerajinan tembaga dan kuningan", "sky", "", "/uploads/portfolio/334b5136-06a2-411b-8359-1988ecb39d0b.webp"],
  ["CV. Mitra Setia Kita", "Company Profile", "Penerbitan buku", "sand", "", "/uploads/portfolio/1f2d8291-036c-4ace-8345-2c679fb63931.webp"],
  ["Visit Raja Ampat", "Company Profile", "Wisata", "blue", "", "/uploads/portfolio/df5c3c87-fe20-45c9-9c72-d1c713340207.webp"],
  ["Visit Jepang", "Company Profile", "Travel", "sky", "", "/uploads/portfolio/d7b8c55d-c9c7-4b97-9adb-65c8ecb250bd.webp"],
  ["Young Speaker Club", "Company Profile", "Komunitas public speaking", "sand", "", "/uploads/portfolio/92419315-1f5a-45b9-92cc-af98f045ea5e.webp"],
  ["Dominique Luxury", "Toko Online", "Fashion", "blue", "", "/uploads/portfolio/737a5b5a-a218-4555-a3a5-76db7bc8c070.webp"],
  ["ANSA Skinhealth", "Toko Online", "Kosmetik", "sky", "", "/uploads/portfolio/ad257851-4742-4177-b833-96738d86b22c.webp"],
  ["Gudang Bmb", "Toko Online", "Fashion", "sand", "", "/uploads/portfolio/ef9ebb71-5ea1-4d68-9f80-bdf73f3f0206.webp"],
  ["Jakarta Football Admirer", "Toko Online", "Fashion", "blue", "", "/uploads/portfolio/353e8ba5-a403-445e-abfd-da82a711aa0d.webp"],
  ["Madam Donna", "Toko Online", "Spiritual", "sky", "", "/uploads/portfolio/facf296c-5d6e-4489-b381-e93cf3df7a67.webp"],
  ["The Overheard Post", "Toko Online", "Fashion", "sand", "", "/uploads/portfolio/2a04f9d8-c3ad-48c1-a17b-f55bb4a8bfba.webp"],
  ["Ichalans Berkah Utama", "Toko Online", "Pertanian", "blue", "", "/uploads/portfolio/dd1af265-527a-4b52-9ef7-c51275bfbd4b.webp"],
  ["Elsvin Shop", "Toko Online", "Fashion", "sky", "", "/uploads/portfolio/7db83586-d118-4849-8d7e-2cb45e16be4e.webp"]
];

const faqs = [
  ['Apa yang perlu disiapkan?', 'Siapkan profil bisnis, logo, daftar layanan atau produk, foto, dan informasi kontak. Jika belum lengkap, kami bantu menyusun kerangkanya saat konsultasi.'],
  ['Berapa lama pengerjaannya?', 'Bergantung pada jenis website dan kelengkapan materi. Landing page dapat selesai lebih cepat dibanding toko online atau web application. Estimasi diberikan setelah konsultasi.'],
  ['Bisa memakai domain sendiri?', 'Bisa. Anda dapat memakai domain yang sudah dimiliki atau kami bantu mendaftarkan domain baru atas nama Anda.'],
  ['Bisa mengelola konten sendiri?', 'Bisa, sesuai fitur website yang dipilih. Kami sertakan panduan pengelolaan agar Anda dapat memperbarui teks dan gambar.'],
  ['Ada bantuan setelah website aktif?', 'Ada. Bantuan teknis dan konsultasi mengikuti cakupan layanan yang disepakati. Pengembangan tambahan dikerjakan sebagai pekerjaan terpisah.']
];

const articles = [
  {
    slug: 'memilih-jenis-website', category: 'Panduan Website', label: 'Jenis Website',
    title: 'Memilih Jenis Website Sesuai Kebutuhan Bisnis',
    excerpt: 'Company profile, landing page, toko online, atau website custom? Kenali perbedaan dan kapan masing-masing paling tepat.',
    meta_description: 'Panduan memilih jenis website yang sesuai kebutuhan bisnis: company profile, landing page, toko online, portal berita, hingga custom.',
    body_html: `<p>Memilih jenis website bukan soal mana yang paling canggih, tetapi mana yang paling sesuai dengan tujuan Anda. Mulailah dengan satu pertanyaan: apa yang harus dilakukan pengunjung setelah membuka website Anda?</p>
<h2>Mulai dari Tujuan Utama Website</h2>
<p>Tuliskan satu tujuan utama, misalnya membangun kepercayaan, mengumpulkan calon pelanggan, atau menjual produk. Tujuan ini menentukan jenis website dan fitur yang diperlukan.</p>
<h2>Company Profile untuk Membangun Kredibilitas</h2>
<p>Cocok jika Anda perlu menampilkan profil perusahaan, layanan, pengalaman, dan kontak dalam satu tempat yang resmi.</p>
<h2>Landing Page untuk Tujuan yang Lebih Terarah</h2>
<p>Cocok untuk satu penawaran, kampanye, atau pendaftaran. Karena hanya satu halaman, pesan menjadi lebih fokus.</p>
<h2>Toko Online untuk Katalog dan Penjualan</h2>
<p>Cocok jika pelanggan perlu memilih produk, membayar, dan memantau pesanan secara online.</p>
<h2>Website Custom untuk Kebutuhan Khusus</h2>
<p>Pilih jika Anda membutuhkan fitur yang tidak tersedia pada paket standar, seperti booking, direktori, atau integrasi sistem.</p>`
  },
  {
    slug: 'persiapan-membuat-website', category: 'Persiapan Website', label: 'Materi Website',
    title: 'Materi yang Perlu Disiapkan Sebelum Membuat Website',
    excerpt: 'Daftar materi yang mempercepat pengerjaan: logo, naskah, foto, kontak, dan referensi tampilan.',
    meta_description: 'Daftar materi yang perlu disiapkan sebelum membuat website agar proses pengerjaan lebih cepat dan hasil lebih sesuai.',
    body_html: `<p>Keterlambatan website paling sering disebabkan oleh materi yang belum siap, bukan oleh proses teknisnya. Berikut daftar yang sebaiknya disiapkan.</p>
<h2>Identitas Bisnis</h2>
<p>Logo dalam format vektor atau PNG berukuran besar, nama bisnis, serta warna merek jika ada.</p>
<h2>Naskah</h2>
<p>Profil singkat, daftar layanan atau produk, keunggulan, dan pertanyaan yang sering diajukan pelanggan.</p>
<h2>Foto dan Visual</h2>
<p>Foto produk, tim, atau lokasi dengan kualitas baik. Pastikan Anda memiliki hak untuk menggunakannya.</p>
<h2>Informasi Kontak</h2>
<p>Alamat, nomor telepon, WhatsApp, email, dan jam operasional.</p>
<h2>Referensi</h2>
<p>Dua sampai tiga website yang Anda sukai beserta alasannya membantu kami memahami arah tampilan.</p>`
  },
  {
    slug: 'merawat-informasi-website', category: 'Setelah Online', label: 'Informasi Website',
    title: 'Merawat Informasi Website Setelah Peluncuran',
    excerpt: 'Website yang sudah online tetap perlu dirawat: informasi, keamanan, dan cadangan data.',
    meta_description: 'Panduan merawat informasi, keamanan, dan cadangan website setelah peluncuran agar tetap relevan dan aman.',
    body_html: `<p>Peluncuran bukan akhir pekerjaan. Website yang informasinya usang justru menurunkan kepercayaan pengunjung.</p>
<h2>Perbarui Informasi Secara Berkala</h2>
<p>Periksa alamat, nomor kontak, jam operasional, dan daftar layanan minimal setiap tiga bulan.</p>
<h2>Jaga Keamanan</h2>
<p>Gunakan kata sandi yang kuat dan unik, batasi jumlah pengguna admin, dan perbarui perangkat lunak secara rutin.</p>
<h2>Pastikan Ada Cadangan</h2>
<p>Cadangan harian membantu pemulihan saat terjadi kesalahan. Uji pemulihannya sesekali.</p>
<h2>Pantau Kinerja</h2>
<p>Perhatikan halaman yang paling sering dibuka dan pertanyaan yang masuk, lalu gunakan sebagai dasar perbaikan konten.</p>`
  }
];

module.exports = { settings, pages, services, std, portfolio, faqs, articles };
