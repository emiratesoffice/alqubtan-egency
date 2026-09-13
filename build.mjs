/**
 * ALQUBTAN AGENCY — static site generator.
 * No dependencies. Run: node build.mjs
 *
 * ---------------------------------------------------------------
 * الإعدادات اللي ممكن تحتاج تغيّرها موجودة كلها في SITE تحت مباشرة.
 * ---------------------------------------------------------------
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

/* ============================= CONFIG ============================= */
const SITE = {
  name: 'ALQUBTAN AGENCY',
  url: 'https://alqubtanagency.com',
  whatsapp: '971541812018',
  email: 'emiratesfordomesticworkers@gmail.com',
  licence: 'CN-4012763',
  offices: 'Al Ain & Ajman, United Arab Emirates',
  addressLocality: 'Al Ain',
  addressRegion: 'Abu Dhabi',
  country: 'AE',
  mapsQuery: 'ALQUBTAN+Agency+Al+Ain',

  // اختياري: مفتاح Web3Forms علشان النموذج يبعتلك إيميل.
  // من web3forms.com — مجاني، بيبعتلك المفتاح على إيميلك.
  // لو سايبه فاضي، النموذج بيفتح واتساب برسالة جاهزة بدل الإيميل.
  formAccessKey: 'abdc9f36-45f1-46de-9919-409ebc911252',

  // اختياري: معرّف Google Analytics، شكله G-XXXXXXXXXX
  gaId: 'G-K09E984Z8F',
};

const OUT = 'dist';
const SRC = '.';

/* ============================= HELPERS ============================= */
const esc = (t) =>
  String(t ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const read = (p) => readFileSync(join(SRC, p), 'utf8');

function write(rel, content) {
  const full = join(OUT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

const waMessage = (role) =>
  role
    ? `Hello ${SITE.name}, I want to apply as a ${role}.\nMy name: \nMy country: \nMy age: `
    : `Hello ${SITE.name}, I would like to apply for a job in the UAE.\nMy name: \nMy country: \nMy age: `;

const waLink = (role) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waMessage(role))}`;

const waDisplay = () => {
  const n = SITE.whatsapp;
  return n.length === 12
    ? `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8)}`
    : `+${n}`;
};

const WA_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01c-1.52 0-3.02-.41-4.32-1.18l-.31-.18-3.21.84.86-3.13-.2-.32a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.14-1.19-.06-.11-.22-.17-.47-.29Z"/></svg>';

const waButton = (label = 'Apply on WhatsApp', role = '') =>
  `<a class="btn-wa" href="${waLink(role)}" target="_blank" rel="noopener">${WA_ICON} ${esc(label)}</a>`;

/* ============================= NAV / SHELL ============================= */
const NAV = [
  ['/', 'Home'],
  ['/about-us/', 'About'],
  ['/services/', 'Services'],
  ['/blog/', 'Blog'],
  ['/faq/', 'FAQ'],
  ['/contact-us/', 'Contact'],
];

const FOOTER_LINKS = [
  ['/about-us/', 'About us'],
  ['/services/', 'Services'],
  ['/blog/', 'Blog'],
  ['/faq/', 'FAQ'],
  ['/contact-us/', 'Contact us'],
  ['/privacy-policy/', 'Privacy policy'],
  ['/terms-and-conditions/', 'Terms and conditions'],
];

function brandnav(current) {
  const links = NAV.map(
    ([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`
  ).join('');
  return `<nav class="brandnav" aria-label="Main">
  <div class="brandnav__inner">
    <a class="brandnav__mark" href="/">
      <img src="/img/logo.png" alt="" width="46" height="46">
      <span>
        <span class="brandnav__name">${esc(SITE.name)}</span>
        <span class="brandnav__sub">UAE domestic worker recruitment</span>
      </span>
    </a>
    <div class="brandnav__links">${links}</div>
    <a class="brandnav__cta" href="${waLink()}" target="_blank" rel="noopener">Apply now
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>
  </div>
</nav>`;
}

function nav(current) {
  const links = NAV.map(
    ([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`
  ).join('');
  return `<nav class="nav" aria-label="Main"><div class="nav__inner">${links}</div></nav>`;
}

function footer() {
  const links = FOOTER_LINKS.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('');
  return `<footer>
  <div class="wrap">
    <img class="foot-logo" src="/img/logo.png" alt="" width="96" height="96">
    <ul class="foot-nav">${links}</ul>
    <div class="foot-cols">
      <div class="foot-block">
        <h3>${esc(SITE.name)}</h3>
        <p>${esc(SITE.offices)}</p>
      </div>
      <div class="foot-block">
        <h3>WhatsApp</h3>
        <p><a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">${waDisplay()}</a></p>
      </div>
    </div>
    <p class="legal">
      Trade licence ${esc(SITE.licence)} &middot; United Arab Emirates.<br>
      ${esc(SITE.name)} does not charge workers any recruitment, placement or processing fee.
      Deployment is subject to the overseas employment rules of each worker's home country.
    </p>
  </div>
</footer>`;
}

const analytics = () =>
  SITE.gaId
    ? `<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
addEventListener('load',function(){
  var s=document.createElement('script');
  s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}';
  document.head.appendChild(s);
  gtag('js',new Date());gtag('config','${SITE.gaId}');
});
</script>`
    : `<!-- Google Analytics: حط المعرّف في SITE.gaId جوه build.mjs -->
<!-- Google Search Console: التحقق عن طريق DNS أو ملف HTML في جذر الموقع -->`;

function layout({ title, description, canonical, body, schema = [], current = '' }) {
  const jsonld = schema
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE.url}${canonical}">
<meta name="theme-color" content="#07351D">
<meta name="robots" content="index, follow">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE.url}${canonical}">
<meta property="og:type" content="website">
<meta property="og:image" content="${SITE.url}/img/social-card.jpg">
<meta property="og:image:secure_url" content="${SITE.url}/img/social-card.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(SITE.name)} — household jobs in the UAE">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE.url}/img/social-card.jpg">
<link rel="icon" href="/img/logo.png" type="image/png">
<link rel="apple-touch-icon" href="/img/logo.png">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Marcellus&family=Source+Sans+3:wght@400;600&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marcellus&family=Source+Sans+3:wght@400;600&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marcellus&family=Source+Sans+3:wght@400;600&display=swap"></noscript>
<link rel="preload" as="image" href="/img/hero.webp" fetchpriority="high">
<link rel="stylesheet" href="/assets/style.css">
${jsonld}
${analytics()}
</head>
<body>
<div class="contactbar">
  <div class="contactbar__inner">
    <a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z"/></svg>${waDisplay()}</a>
    <a href="mailto:${SITE.email}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>${esc(SITE.email)}</a>
    <span>${esc(SITE.offices)}</span>
  </div>
</div>
${brandnav(current)}
${body}
${footer()}
<a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${WA_ICON}</a>
<div class="sticky">${waButton()}</div>
</body>
</html>
`;
}

/* ============================= SCHEMA ============================= */
const orgSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'EmploymentAgency',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/img/logo.png`,
  image: `${SITE.url}/img/social-card.jpg`,
  telephone: `+${SITE.whatsapp}`,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.addressLocality,
    addressRegion: SITE.addressRegion,
    addressCountry: SITE.country,
  },
  areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
  identifier: SITE.licence,
  description:
    'Licensed recruitment office in the United Arab Emirates placing housemaids, nannies, cooks, caregivers and drivers with families. No fees are charged to workers.',
});

const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { '@id': `${SITE.url}/#organization` },
  inLanguage: 'en',
});

const breadcrumb = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, url], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: `${SITE.url}${url}`,
  })),
});

/* ============================= CONTENT DATA ============================= */
const ROLES = [
  ['Housemaid', '1,500 – 1,800'],
  ['Nanny', '1,500 – 1,800'],
  ['Cook', '1,500 – 1,800'],
  ['Caregiver', '1,800 – 2,500'],
  ['Private driver', '2,500 – 3,000'],
];

const SERVICES = [
  ['Transfer inside the UAE',
   'You are already in the country and your contract has ended. We move you to a new employer with a new contract and a new visa.',
   'About 1 day'],
  ['Transfer from another country',
   'You are working as a helper in the Gulf, Hong Kong, Malaysia or elsewhere and want to move here once your current contract allows it.',
   'Depends on your release'],
  ['Return on a re-entry visa',
   'You worked in the UAE before and went home. If your papers are in order, coming back is the fastest route of all.',
   'About 2 days'],
  ['Direct recruitment from the Philippines',
   'Travelling for work for the first time. We process the application through the proper licensed channel and your government clearance.',
   'About 2 weeks'],
];

const FAQS = [
  ['Do I have to pay anything to apply?',
   'No. Applying is free, and we do not charge workers a placement fee at any stage. The employer covers the visa, the medical test and the ticket. If anyone asks you for money in our name, tell us.'],
  ['Which countries do you recruit from?',
   'The Philippines, Indonesia, Nepal and Myanmar. Each of these countries sets its own rules for citizens taking domestic work abroad, and those rules change. Message us and we will tell you the current position for your country.'],
  ['What documents will I need?',
   'A valid passport with at least six months remaining, passport photographs, and the exit clearance documents your government requires. Certificates or references from earlier work help too.'],
  ['How long does the process take?',
   'A transfer inside the UAE is usually about one day. Coming from the Philippines with a valid visa is about two days. Travelling overseas for the first time takes around two weeks.'],
  ['How much will I earn?',
   'Housemaid, nanny and cook positions pay between 1,500 and 1,800 AED per month. Caregiver positions pay 1,800 to 2,500 AED. Driver positions pay 2,500 to 3,000 AED and require a valid UAE driving licence.'],
  ['Will my salary be paid into a bank account?',
   'Yes. Your salary is paid into a bank account in your own name, so there is a record of every payment you receive.'],
  ['Do you keep my passport?',
   'No. Send us a photograph of your passport when you apply and keep the original. Your passport remains your property at every stage.'],
  ['Where will I be working?',
   'With a family in the United Arab Emirates. Our offices are in Al Ain and Ajman, and we tell you the emirate and the household details before you agree to anything.'],
  ['Can I visit your office?',
   'Yes. We have offices in Al Ain and Ajman and you are welcome to come in person. Message us on WhatsApp first so someone is expecting you.'],
];

/* ============================= MARKDOWN ============================= */
function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    data[k] = v;
  }
  return { data, body: raw.slice(m[0].length) };
}

function inline(t) {
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdown(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (/^##\s+/.test(ln)) { out.push(`<h2>${inline(ln.replace(/^##\s+/, ''))}</h2>`); i++; continue; }
    if (/^###\s+/.test(ln)) { out.push(`<h3>${inline(ln.replace(/^###\s+/, ''))}</h3>`); i++; continue; }
    if (/^\|/.test(ln)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(lines[i].replace(/^\||\|$/g, '').split('|').map((c) => c.trim())); i++;
      }
      const th = (rows[0] || []).map((c) => `<th>${inline(c)}</th>`).join('');
      const tb = rows.slice(2).map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('');
      out.push(`<table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>`);
      continue;
    }
    if (/^\d+\.\s/.test(ln)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(inline(lines[i].replace(/^\d+\.\s/, ''))); i++; }
      out.push('<ol>' + items.map((x) => `<li>${x}</li>`).join('') + '</ol>'); continue;
    }
    if (/^[-*]\s/.test(ln)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) { items.push(inline(lines[i].replace(/^[-*]\s/, ''))); i++; }
      out.push('<ul>' + items.map((x) => `<li>${x}</li>`).join('') + '</ul>'); continue;
    }
    if (ln.trim() === '' || ln.trim() === '---') { i++; continue; }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\||[-*]\s|\d+\.\s)/.test(lines[i])) {
      buf.push(lines[i].trim()); i++;
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

/* ============================= BUILD ============================= */
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(SRC, 'img'), join(OUT, 'img'), { recursive: true });
cpSync(join(SRC, 'assets'), join(OUT, 'assets'), { recursive: true });

const P = (n) => read(`partials/${n}.html`).replace(/\{\{WA\}\}/g, waLink());

/* ---------- articles ---------- */
const articles = [];
const dir = 'content/articles';
for (const f of readdirSync(dir).filter((x) => /\.(md|html?)$/i.test(x))) {
  const isHtml = /\.html?$/i.test(f);
  const raw = readFileSync(join(dir, f), 'utf8');
  const { data, body } = parseFrontMatter(raw);
  if (String(data.draft).toLowerCase() === 'true') continue;

  // HTML articles: strip any page wrapper, keep only the content
  let content = body;
  if (isHtml) {
    const inBody = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (inBody) content = inBody[1];
    content = content
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<head[\s\S]*?<\/head>/gi, '')
      .replace(/<\/?body[^>]*>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '')   // the layout prints the title already
      .trim();
  }

  articles.push({
    slug: data.slug || f.replace(/\.(md|html?)$/i, ''),
    title: data.title || f,
    metaTitle: data.meta_title || data.title,
    metaDesc: data.meta_description || '',
    date: data.date || '',
    html: isHtml ? content : markdown(body),
  });
}
articles.sort((a, b) => String(b.date).localeCompare(String(a.date)));

const postCards = (list) =>
  `<ul class="post-list">` +
  list.map(
    (p) =>
      `<li><h3><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3>` +
      `<p>${esc(p.metaDesc)}</p>` +
      `<a class="apply" href="/blog/${p.slug}/">Read this</a></li>`
  ).join('') +
  `</ul>`;

/* ---------- home ---------- */
write(
  'index.html',
  layout({
    current: '/',
    title: 'ALQUBTAN AGENCY | Household Jobs in the UAE — Apply Free',
    description:
      'Licensed recruitment office in Al Ain and Ajman. Housemaid, nanny, cook, caregiver and driver positions with UAE families. No fees are charged to workers.',
    canonical: '/',
    schema: [orgSchema(), websiteSchema()],
    body: [
      P('lead'), P('offer'), P('jobs'), P('countries'), P('flow'), P('who'), P('safety'),
      `<section class="sec sec--alt" id="articles">
  <div class="wrap">
    <div class="rule"><span class="lozenge"></span></div>
    <div class="sec__head">
      <h2>Advice and updates</h2>
      <p>Practical guidance for anyone thinking about household work in the UAE.</p>
    </div>
    ${postCards(articles.slice(0, 3))}
    <p style="margin-top:26px;"><a class="apply" href="/blog/">All articles</a></p>
  </div>
</section>`,
      P('office'), P('closecta'),
    ].join('\n'),
  })
);

/* ---------- about ---------- */
write(
  'about-us/index.html',
  layout({
    current: '/about-us/',
    title: 'About ALQUBTAN AGENCY | Licensed Recruitment Office in the UAE',
    description:
      'Who we are, how we work, and what we will not do. A licensed recruitment office in Al Ain and Ajman placing household staff with UAE families.',
    canonical: '/about-us/',
    schema: [
      { '@context': 'https://schema.org', '@type': 'AboutPage', url: `${SITE.url}/about-us/`, name: 'About ALQUBTAN AGENCY', publisher: { '@id': `${SITE.url}/#organization` } },
      breadcrumb([['Home', '/'], ['About us', '/about-us/']]),
    ],
    body: `<section class="page-head">
  <div class="wrap">
    <h1>About us</h1>
    <p>A licensed recruitment office working between the UAE and four sending countries.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap prose">
    <p>ALQUBTAN Agency places housemaids, nannies, cooks, caregivers and private drivers with families in the United Arab Emirates. We operate from two offices, in Al Ain and in Ajman, under trade licence ${esc(SITE.licence)}.</p>
    <p>Most people who read this page are looking for work rather than looking to hire. This page is written for them.</p>

    <h2>What we do</h2>
    <p>We work across four routes rather than one. A worker might already be inside the UAE with a finished contract, employed in another country and wanting to move, returning after going home, or travelling overseas for the first time. Each route has a different timeline and different paperwork, and we handle all four.</p>
    <p>That is the practical difference between us and an office that only recruits from abroad: if you are already here and your contract has ended, you do not have to fly home and start again.</p>

    <h2>How we work</h2>
    <ul class="values">
      <li><span class="lozenge"></span><span><strong>Workers pay nothing</strong><span class="txt">Not a placement fee, not a processing fee, not a deposit. The employer carries the cost of the visa, the medical test and the ticket. This is the law in the UAE and in every country we recruit from.</span></span></li>
      <li><span class="lozenge"></span><span><strong>Everything in writing</strong><span class="txt">You see the salary, the role and the employer in a written contract before you sign. We will explain any line you do not understand.</span></span></li>
      <li><span class="lozenge"></span><span><strong>Your passport stays yours</strong><span class="txt">Send us a photograph when you apply. Keep the document. It remains your property after you start work.</span></span></li>
      <li><span class="lozenge"></span><span><strong>Salaries through a bank</strong><span class="txt">Paid into an account in your own name, so there is a record of every payment.</span></span></li>
      <li><span class="lozenge"></span><span><strong>Straight answers</strong><span class="txt">If a route is closed for your nationality, or we have nothing that fits you, we say so instead of keeping you waiting.</span></span></li>
    </ul>

    <h2>What we will not do</h2>
    <p>We do not arrange work on visit visas. We do not ask workers for money. We do not tell anyone to travel before their own government's exit process is complete, and we cannot work around an unresolved immigration case — those go through the Ministry of Human Resources and Emiratisation or your embassy, which is where they belong.</p>
    <p>An office that offers you a shortcut around any of this is offering to remove your protection, not to save you time.</p>

    <h2>Come and see us</h2>
    <p>We have offices you can walk into, in Al Ain and in Ajman. Ask us for our licence number any time. A real office will always show you.</p>
  </div>
</section>

${P('closecta')}`,
  })
);

/* ---------- services ---------- */
write(
  'services/index.html',
  layout({
    current: '/services/',
    title: 'Our Services | Household Job Placement in the UAE',
    description:
      'Four routes into a household job in the UAE: transfer inside the country, transfer from abroad, return on a re-entry visa, and direct recruitment from the Philippines.',
    canonical: '/services/',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Recruitment services',
        itemListElement: SERVICES.map(([n, d], i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Service', name: n, description: d, provider: { '@id': `${SITE.url}/#organization` }, areaServed: 'United Arab Emirates' },
        })),
      },
      breadcrumb([['Home', '/'], ['Services', '/services/']]),
    ],
    body: `<section class="page-head">
  <div class="wrap">
    <h1>Our services</h1>
    <p>Four routes into a household job in the UAE. The right one depends on where you are today.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <ul class="svc">
      ${SERVICES.map(
        ([n, d, t]) => `<li><span class="lozenge" style="margin-top:9px"></span><div>
        <h3>${esc(n)}</h3>
        <p>${esc(d)}</p>
        <p class="post-meta"><strong>Typical time:</strong> ${esc(t)}</p>
        <a class="apply" href="${waLink()}" target="_blank" rel="noopener">Ask about this route</a>
      </div></li>`
      ).join('')}
    </ul>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="rule"><span class="lozenge"></span></div>
    <div class="sec__head"><h2>Positions and salaries</h2>
    <p>Where you fall inside a range depends on your experience, the languages you speak, and the size of the household.</p></div>
    <div class="article">
      <table>
        <thead><tr><th>Role</th><th>Monthly salary (AED)</th></tr></thead>
        <tbody>${ROLES.map(([n, s]) => `<tr><td>${esc(n)}</td><td>${esc(s)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
    <p class="form-note">Salaries are paid into a bank account in your own name. Driver positions require a valid UAE driving licence.</p>
  </div>
</section>

${P('closecta')}`,
  })
);

/* ---------- contact ---------- */
const formAction = SITE.formAccessKey ? ' action="https://api.web3forms.com/submit" method="POST"' : '';
write(
  'contact-us/index.html',
  layout({
    current: '/contact-us/',
    title: 'Contact ALQUBTAN AGENCY | WhatsApp, Offices in Al Ain & Ajman',
    description:
      'Message our recruitment office on WhatsApp, or send an enquiry. Offices in Al Ain and Ajman, United Arab Emirates. Applying is free.',
    canonical: '/contact-us/',
    schema: [
      { '@context': 'https://schema.org', '@type': 'ContactPage', url: `${SITE.url}/contact-us/`, name: 'Contact ALQUBTAN AGENCY', mainEntity: { '@id': `${SITE.url}/#organization` } },
      breadcrumb([['Home', '/'], ['Contact us', '/contact-us/']]),
    ],
    body: `<section class="page-head">
  <div class="wrap">
    <h1>Contact us</h1>
    <p>The fastest way to reach us is WhatsApp. We answer during business hours.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${waButton('Message us on WhatsApp')}
    <p class="form-note" style="margin-top:14px;">${waDisplay()} &middot; Applying is free and there is no obligation.</p>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="rule"><span class="lozenge"></span></div>
    <div class="sec__head"><h2>Or send us your details</h2>
    <p>Fill this in and we will come back to you.</p></div>

    <form class="form" id="enquiry"${formAction}>
      ${SITE.formAccessKey ? `<input type="hidden" name="access_key" value="${esc(SITE.formAccessKey)}">
      <input type="hidden" name="subject" value="New enquiry from the website">
      <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">` : ''}
      <div class="field">
        <label for="f-name">Your name</label>
        <input id="f-name" name="name" type="text" autocomplete="name" required>
      </div>
      <div class="field">
        <label for="f-country">Your nationality</label>
        <select id="f-country" name="nationality" required>
          <option value="">Choose…</option>
          <option>Philippines</option><option>Indonesia</option>
          <option>Nepal</option><option>Myanmar</option><option>Other</option>
        </select>
      </div>
      <div class="field">
        <label for="f-role">Position you want</label>
        <select id="f-role" name="role" required>
          <option value="">Choose…</option>
          ${ROLES.map(([n]) => `<option>${esc(n)}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label for="f-age">Your age</label>
        <input id="f-age" name="age" type="number" inputmode="numeric" min="25" max="47" required>
        <p class="hint">We place workers aged 25 to 47.</p>
      </div>
      <div class="field">
        <label for="f-exp">Experience in household work</label>
        <select id="f-exp" name="experience" required>
          <option value="">Choose…</option>
          <option>No experience yet</option>
          <option>Less than 2 years</option>
          <option>2 to 5 years</option>
          <option>More than 5 years</option>
        </select>
      </div>
      <div class="field">
        <label for="f-where">Where are you now?</label>
        <input id="f-where" name="location" type="text" placeholder="Country or emirate">
      </div>
      <div class="field">
        <label for="f-msg">Anything else we should know</label>
        <textarea id="f-msg" name="message" rows="4"></textarea>
        <p class="hint">Please do not send passport numbers or ID numbers through this form.</p>
      </div>
      <button class="btn-wa" type="submit" id="f-submit">${WA_ICON} Send</button>
      <p class="hint">By sending this you agree to our <a href="/privacy-policy/">privacy policy</a>.</p>
    </form>

    <div class="sent" id="sent" hidden role="status" aria-live="polite">
      <svg class="sent__tick" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 15-16"/>
      </svg>
      <h3>Your details were sent</h3>
      <p id="sent-msg">We have your enquiry. For a faster reply, send it on WhatsApp too.</p>
      <a class="btn-wa sent__go" id="sent-link" href="#" target="_blank" rel="noopener">${WA_ICON} Open WhatsApp</a>
      <button class="sent__again" type="button" id="sent-again">Change my details</button>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="rule"><span class="lozenge"></span></div>
    <div class="sec__head"><h2>Our offices</h2></div>
    <ul class="facts">
      <li><span class="lozenge"></span><span><strong>Al Ain, Abu Dhabi</strong>Open during business hours.</span></li>
      <li><span class="lozenge"></span><span><strong>Ajman</strong>Open during business hours.</span></li>
      <li><span class="lozenge"></span><span><strong>Trade licence ${esc(SITE.licence)}</strong>Ask us for it any time.</span></li>
    </ul>
    <p style="margin-top:18px;"><a class="apply" href="https://www.google.com/maps/search/?api=1&amp;query=${SITE.mapsQuery}" target="_blank" rel="noopener">Open in Google Maps</a></p>
  </div>
</section>

<script>
(function(){
  var form  = document.getElementById('enquiry');
  var panel = document.getElementById('sent');
  var link  = document.getElementById('sent-link');
  var msg   = document.getElementById('sent-msg');
  var again = document.getElementById('sent-again');
  var btn   = document.getElementById('f-submit');
  if(!form) return;

  var hasEmail = ${SITE.formAccessKey ? 'true' : 'false'};

  function show(){
    form.hidden = true;
    panel.hidden = false;
    panel.scrollIntoView({behavior:'smooth', block:'center'});
  }

  again.addEventListener('click', function(){
    panel.hidden = true;
    form.hidden = false;
    btn.disabled = false;
    btn.style.opacity = '';
    form.scrollIntoView({behavior:'smooth', block:'center'});
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!form.reportValidity()) return;

    var d = new FormData(form);
    var lines = [
      'Hello ${SITE.name}, I would like to apply for a job in the UAE.',
      'Name: ' + (d.get('name')||''),
      'Age: ' + (d.get('age')||''),
      'Nationality: ' + (d.get('nationality')||''),
      'Position: ' + (d.get('role')||''),
      'Experience: ' + (d.get('experience')||''),
      'Currently in: ' + (d.get('location')||''),
      (d.get('message') ? 'Note: ' + d.get('message') : '')
    ].filter(Boolean);

    link.href = 'https://wa.me/${SITE.whatsapp}?text=' + encodeURIComponent(lines.join('\\n'));

    btn.disabled = true;
    btn.style.opacity = '.65';

    if(hasEmail){
      fetch(form.action, { method:'POST', body:d })
        .then(function(r){ return r.json(); })
        .then(function(){
          msg.textContent = 'We have your enquiry. For a faster reply, send it on WhatsApp too.';
        })
        .catch(function(){
          msg.textContent = 'We could not send it automatically. Please tap the button below to send it on WhatsApp.';
        })
        .then(show);
    } else {
      show();
    }
  });
})();
</script>`,
  })
);

/* ---------- blog ---------- */
write(
  'blog/index.html',
  layout({
    current: '/blog/',
    title: 'Blog | Advice for Household Workers Coming to the UAE',
    description:
      'Practical guidance on household work in the UAE: transfers, re-entry, documents, salaries and how to spot a recruitment scam.',
    canonical: '/blog/',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        url: `${SITE.url}/blog/`,
        name: `${SITE.name} Blog`,
        publisher: { '@id': `${SITE.url}/#organization` },
        blogPost: articles.map((a) => ({
          '@type': 'BlogPosting',
          headline: a.title,
          url: `${SITE.url}/blog/${a.slug}/`,
          datePublished: a.date,
        })),
      },
      breadcrumb([['Home', '/'], ['Blog', '/blog/']]),
    ],
    body: `<section class="page-head">
  <div class="wrap">
    <h1>Blog</h1>
    <p>Practical guidance for anyone thinking about household work in the UAE.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">${postCards(articles)}</div>
</section>`,
  })
);

for (const a of articles) {
  write(
    `blog/${a.slug}/index.html`,
    layout({
      current: '/blog/',
      title: a.metaTitle,
      description: a.metaDesc,
      canonical: `/blog/${a.slug}/`,
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: a.title,
          description: a.metaDesc,
          datePublished: a.date,
          dateModified: a.date,
          mainEntityOfPage: `${SITE.url}/blog/${a.slug}/`,
          author: { '@id': `${SITE.url}/#organization` },
          publisher: { '@id': `${SITE.url}/#organization` },
          inLanguage: 'en',
        },
        breadcrumb([['Home', '/'], ['Blog', '/blog/'], [a.title, `/blog/${a.slug}/`]]),
      ],
      body: `<section class="page-head">
  <div class="wrap">
    <a class="backlink" href="/blog/">All articles</a>
    <h1>${esc(a.title)}</h1>
  </div>
</section>

<article class="sec article">
  <div class="wrap">
${a.html}
  </div>
</article>

${P('closecta')}`,
    })
  );
}

/* ---------- faq ---------- */
write(
  'faq/index.html',
  layout({
    current: '/faq/',
    title: 'Frequently Asked Questions | ALQUBTAN AGENCY',
    description:
      'Answers to the questions workers ask us most: fees, salaries, documents, timelines, passports and where you will work.',
    canonical: '/faq/',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      breadcrumb([['Home', '/'], ['FAQ', '/faq/']]),
    ],
    body: `<section class="page-head">
  <div class="wrap">
    <h1>Frequently asked questions</h1>
    <p>If your question is not here, message us and ask.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${FAQS.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n    ')}
  </div>
</section>

${P('closecta')}`,
  })
);

/* ---------- legal ---------- */
const legalPage = (slug, h1, title, desc, bodyHtml) =>
  write(
    `${slug}/index.html`,
    layout({
      current: '',
      title,
      description: desc,
      canonical: `/${slug}/`,
      schema: [
        { '@context': 'https://schema.org', '@type': 'WebPage', url: `${SITE.url}/${slug}/`, name: h1, publisher: { '@id': `${SITE.url}/#organization` } },
        breadcrumb([['Home', '/'], [h1, `/${slug}/`]]),
      ],
      body: `<section class="page-head">
  <div class="wrap"><h1>${esc(h1)}</h1><p>Last updated: 7 September 2026</p></div>
</section>

<section class="sec">
  <div class="wrap prose">${bodyHtml}</div>
</section>`,
    })
  );

legalPage(
  'privacy-policy',
  'Privacy policy',
  'Privacy Policy | ALQUBTAN AGENCY',
  'How ALQUBTAN Agency collects, uses and protects the personal information of people who contact us about household work in the UAE.',
  `<p>This policy explains what we collect when you use this website or contact us, why we collect it, and what we do with it. ${esc(SITE.name)} is responsible for this information.</p>

<h2>What we collect</h2>
<ul>
  <li><strong>Information you send us.</strong> Your name, nationality, age, the position you want, where you are now, your work history, and copies of documents such as your passport page when you choose to send them.</li>
  <li><strong>Messages.</strong> The content of WhatsApp messages, emails or form submissions you send us.</li>
  <li><strong>Basic technical data.</strong> If website analytics are enabled, we may collect anonymous information such as which pages were visited, the type of device used and the country the visit came from. This does not identify you personally.</li>
</ul>

<h2>Why we collect it</h2>
<p>We use your information for one purpose: to assess your application and, if a position fits, to arrange employment with a family in the United Arab Emirates. That includes processing the visa and employment paperwork the arrangement requires.</p>

<h2>Who we share it with</h2>
<ul>
  <li><strong>Prospective employers.</strong> Families considering you for a position see the details relevant to that decision.</li>
  <li><strong>Government authorities.</strong> Where the visa and employment process requires it, including the UAE Ministry of Human Resources and Emiratisation and the relevant authorities of your own country.</li>
  <li><strong>Partner recruitment agencies.</strong> Licensed agencies in your home country, where your route requires one.</li>
</ul>
<p>We do not sell your information, and we do not share it for advertising.</p>

<h2>Your introduction video</h2>
<p>If you send a short introduction video, it is shown only to families considering you for a position. It is never published on this website, on social media, or anywhere else. Sending one is optional and we will process your application without it.</p>

<h2>How long we keep it</h2>
<p>We keep application information for as long as it takes to place you, and afterwards for the period required by UAE employment and immigration record-keeping. If you ask us to delete your details and there is no legal requirement to retain them, we will.</p>

<h2>Your rights</h2>
<p>You can ask us what we hold about you, ask us to correct anything that is wrong, ask us to delete it, or withdraw your application at any time. Message us on WhatsApp at ${waDisplay()} or email ${esc(SITE.email)}.</p>

<h2>Security</h2>
<p>This website is served over an encrypted connection. Please do not send full passport numbers, ID numbers or bank details through the website form. Documents should be sent only after we have confirmed we can help you.</p>

<h2>Cookies</h2>
<p>This website does not use cookies to track you across other websites. If analytics are enabled, the analytics provider may set cookies to count visits. You can block cookies in your browser settings without losing access to any part of this site.</p>

<h2>Children</h2>
<p>This website and our services are for adults. We do not knowingly collect information from anyone under 18, and we do not recruit anyone under 18.</p>

<h2>Contact</h2>
<p>Questions about this policy: ${esc(SITE.email)}, or WhatsApp ${waDisplay()}.</p>
<p>${esc(SITE.name)} &middot; ${esc(SITE.offices)} &middot; Trade licence ${esc(SITE.licence)}.</p>`
);

legalPage(
  'terms-and-conditions',
  'Terms and conditions',
  'Terms and Conditions | ALQUBTAN AGENCY',
  'The terms that apply to using the ALQUBTAN Agency website and enquiring about household positions in the United Arab Emirates.',
  `<p>These terms apply to your use of this website and to enquiries you make through it. By using the site you accept them.</p>

<h2>Who we are</h2>
<p>${esc(SITE.name)} is a recruitment office operating in the United Arab Emirates under trade licence ${esc(SITE.licence)}, with offices in Al Ain and Ajman.</p>

<h2>What this website is</h2>
<p>This website provides information about household positions and about how the recruitment process works. Sending us an enquiry does not create an employment relationship and is not an offer of employment. Employment begins only when a written contract is signed and the required approvals are issued.</p>

<h2>No fees to workers</h2>
<p>We do not charge workers any recruitment, placement or processing fee. If anyone asks you for payment in our name, do not pay, and tell us.</p>

<h2>Information you give us</h2>
<p>You confirm that the information and documents you send us are accurate and belong to you. Applications supported by false documents or false statements will not be processed.</p>

<h2>Eligibility</h2>
<p>You must be at least 18 years old to apply. Placement also depends on the overseas employment rules that your own government applies to its citizens, and on UAE immigration and labour approvals. These rules change, and a route that is open today may not be open next month.</p>

<h2>What we cannot do</h2>
<p>We cannot guarantee that a position will be found, how long a process will take, or that an application will be approved by any authority. Timeframes given on this website are typical, not promised. We cannot resolve immigration cases, absconding reports or fines — those are handled by the Ministry of Human Resources and Emiratisation or by your embassy.</p>

<h2>Your employer</h2>
<p>Once you are employed, your contract is between you and the employing household. Their obligations to you are set by UAE law and by that contract. We remain reachable if something goes wrong, but we are not a party to your employment contract.</p>

<h2>Accuracy of this website</h2>
<p>We keep the information here as accurate as we can, including salary ranges and processing times, but these change. Nothing on this website is legal advice. Confirm anything that matters to you with us directly before you act on it.</p>

<h2>Links to other websites</h2>
<p>Where we link to another website, we are not responsible for its content or its practices.</p>

<h2>Changes</h2>
<p>We may update these terms. The date at the top of this page shows when they were last changed.</p>

<h2>Governing law</h2>
<p>These terms are governed by the laws of the United Arab Emirates.</p>

<h2>Contact</h2>
<p>${esc(SITE.email)} &middot; WhatsApp ${waDisplay()} &middot; ${esc(SITE.offices)}.</p>`
);

/* ---------- 404 ---------- */
write(
  '404.html',
  layout({
    current: '',
    title: 'Page not found | ALQUBTAN AGENCY',
    description: 'The page you were looking for is not here. Go back to the home page or message us on WhatsApp.',
    canonical: '/404.html',
    body: `<section class="page-head">
  <div class="wrap">
    <h1>We could not find that page</h1>
    <p>The link may be old, or the address may have a typo in it.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <p class="form-note" style="margin-bottom:18px;">Try one of these instead:</p>
    <ul class="post-list">
      <li><h3><a href="/">Home</a></h3><p>Positions, salaries and how applying works.</p></li>
      <li><h3><a href="/services/">Our services</a></h3><p>The four routes into a household job in the UAE.</p></li>
      <li><h3><a href="/blog/">Blog</a></h3><p>Guidance on transfers, documents and avoiding scams.</p></li>
      <li><h3><a href="/faq/">FAQ</a></h3><p>Fees, salaries, documents and timelines.</p></li>
    </ul>
  </div>
</section>

${P('closecta')}`,
  })
);

/* ---------- sitemap, robots, redirects, headers ---------- */
const urls = [
  ['/', '1.0'],
  ['/services/', '0.9'],
  ['/contact-us/', '0.8'],
  ['/blog/', '0.8'],
  ['/about-us/', '0.7'],
  ['/faq/', '0.7'],
  ['/privacy-policy/', '0.3'],
  ['/terms-and-conditions/', '0.3'],
  ...articles.map((a) => [`/blog/${a.slug}/`, '0.7']),
];
const today = new Date().toISOString().slice(0, 10);

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join('\n')}
</urlset>
`
);

write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

write(
  '_redirects',
  `# old article URLs -> new blog URLs
${articles.map((a) => `/articles/${a.slug}.html  /blog/${a.slug}/  301`).join('\n')}
/articles/index.html  /blog/  301
/articles/*  /blog/  301
`
);

write(
  '_headers',
  `/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://api.web3forms.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; form-action 'self' https://api.web3forms.com; upgrade-insecure-requests
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/img/*
  Cache-Control: public, max-age=31536000, immutable
`
);

/* security.txt — a stated channel for reporting problems */
const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().replace(/\.\d+Z$/, 'Z');
const securityTxt = `Contact: mailto:${SITE.email}
Expires: ${expires}
Preferred-Languages: en, ar
Canonical: ${SITE.url}/.well-known/security.txt
`;
write('.well-known/security.txt', securityTxt);
write('security.txt', securityTxt);

console.log(`Built ${articles.length} articles + ${urls.length - articles.length} pages into /${OUT}`);
