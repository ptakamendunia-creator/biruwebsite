const config = require('./config');

const abs = (p) => (/^https?:\/\//.test(p) ? p : config.siteUrl + (p.startsWith('/') ? p : '/' + p));

function organization(s) {
  const sameAs = [s.instagram, s.linkedin, s.youtube].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': config.siteUrl + '/#organization',
    name: s.site_name,
    legalName: s.legal_name,
    url: config.siteUrl,
    logo: abs('/img/logo.png'),
    email: s.contact_email,
    telephone: s.contact_phone,
    address: { '@type': 'PostalAddress', streetAddress: s.address_primary, addressLocality: s.city, addressRegion: s.region, addressCountry: s.country },
    ...(sameAs.length ? { sameAs } : {})
  };
}

function website(s) {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': config.siteUrl + '/#website', url: config.siteUrl, name: s.site_name, inLanguage: 'id-ID', publisher: { '@id': config.siteUrl + '/#organization' } };
}

function breadcrumb(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.url) }))
  };
}

function faqPage(faqs) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } }))
  };
}

function service(svc, s) {
  return {
    '@context': 'https://schema.org', '@type': 'Service', name: svc.name, description: svc.meta_description || svc.summary,
    url: abs('/layanan/' + svc.slug), areaServed: 'ID', serviceType: svc.keyword || svc.name,
    provider: { '@id': config.siteUrl + '/#organization' }
  };
}

function article(a, s) {
  return {
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.meta_description || a.excerpt,
    datePublished: a.published_at, dateModified: a.updated_at || a.published_at, inLanguage: 'id-ID',
    mainEntityOfPage: abs('/artikel/' + a.slug),
    ...(a.cover ? { image: abs(a.cover) } : {}),
    author: { '@id': config.siteUrl + '/#organization' }, publisher: { '@id': config.siteUrl + '/#organization' }
  };
}

/** Serialisasi aman untuk disisipkan di <script type="application/ld+json">. */
function ld(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

module.exports = { abs, organization, website, breadcrumb, faqPage, service, article, ld };
