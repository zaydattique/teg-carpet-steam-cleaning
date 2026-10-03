/**
 * T.E.G Carpet Steam Cleaning - Backend
 * Contact form, admin content API, media upload, static site, analytics
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || process.env.TEG_ADMIN_PASS || '').trim();
if (!ADMIN_PASSWORD) {
  console.error('FATAL: ADMIN_PASSWORD (or legacy TEG_ADMIN_PASS) environment variable is required. Refusing to start with no admin secret.');
  process.exit(1);
}
/** Email address that receives every Get-an-Estimate lead (business owner - not the customer). */
const NOTIFY_EMAIL_OVERRIDE = (process.env.NOTIFY_EMAIL || process.env.TEG_NOTIFY_EMAIL || '').trim();
// Runtime state must live outside the deploy/release directory so Hostinger redeploys cannot wipe CMS data or uploads.
// Override these paths with environment variables when the hosting provider gives you a dedicated persistent volume.
const PERSIST_ROOT = process.env.TEG_PERSIST_DIR || path.join(process.env.HOME || __dirname, '.teg-carpet-persistent');
const DATA_DIR = process.env.TEG_DATA_DIR || path.join(PERSIST_ROOT, 'data');
const UPLOADS_DIR = process.env.TEG_UPLOADS_DIR || path.join(PERSIST_ROOT, 'uploads');
const SEED_DATA_DIR = path.join(__dirname, 'data');
const SEED_UPLOADS_DIR = path.join(__dirname, 'uploads');

// CMS content must never live inside the deploy directory. A redeploy can replace that directory.
// Fail fast if deployment configuration accidentally points the CMS data back into the release.
const deployDir = path.resolve(__dirname);
const contentDir = path.resolve(DATA_DIR);
const contentRel = path.relative(deployDir, contentDir);
if (contentRel === '' || (!contentRel.startsWith('..' + path.sep) && contentRel !== '..')) {
  console.error('FATAL: CMS content directory is inside the deploy directory:', contentDir);
  console.error('Set TEG_PERSIST_DIR or TEG_DATA_DIR to a persistent path outside the app/release directory.');
  process.exit(1);
}

[DATA_DIR, UPLOADS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function seedPersistentFile(target, seed) {
  if (fs.existsSync(target) || !fs.existsSync(seed)) return;
  try {
    fs.copyFileSync(seed, target);
    console.log('Initialized persistent state from', seed, '->', target);
  } catch (e) {
    console.error('Could not initialize persistent file', target, e.message);
  }
}

function seedPersistentUploads() {
  if (!fs.existsSync(SEED_UPLOADS_DIR)) return;
  try {
    const entries = fs.readdirSync(SEED_UPLOADS_DIR, { withFileTypes: true });
    entries.forEach((entry) => {
      if (!entry.isFile() || entry.name === '.gitkeep') return;
      const target = path.join(UPLOADS_DIR, entry.name);
      if (!fs.existsSync(target)) fs.copyFileSync(path.join(SEED_UPLOADS_DIR, entry.name), target);
    });
  } catch (e) {
    console.error('Could not initialize persistent uploads', e.message);
  }
}

const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

seedPersistentFile(CONTENT_FILE, path.join(SEED_DATA_DIR, 'content.json'));
seedPersistentFile(SUBMISSIONS_FILE, path.join(SEED_DATA_DIR, 'submissions.json'));
seedPersistentFile(ANALYTICS_FILE, path.join(SEED_DATA_DIR, 'analytics.json'));
seedPersistentUploads();

function readJSON(file, fallback) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('readJSON', file, e.message);
  }
  return fallback;
}
function writeJSON(file, data) {
  const tmp = file + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

if (!fs.existsSync(ANALYTICS_FILE)) writeJSON(ANALYTICS_FILE, { events: [] });
if (!fs.existsSync(SUBMISSIONS_FILE)) writeJSON(SUBMISSIONS_FILE, []);

const DEFAULT_CONTENT = {
  branding: { siteName: '', logoMark: '', logoText: '', logoUrl: '', faviconUrl: '' },
  seo: { title: '', description: '', keywords: '', canonical: '', ogTitle: '', ogDescription: '', ogImage: '', twitterTitle: '', twitterDescription: '', twitterImage: '' },
  media: { heroImage: '', heroVideo: '', heroPoster: '', ogImage: '', aboutImage: '', logo: '', favicon: '' },
  pageMedia: {},
  contact: { phone: '', phoneTel: '', whatsapp: '', whatsappDigits: '', email: '', address: '', addressLine1: '', city: '', region: '', postal: '', hours: '' },
  location: { name: '', city: '', address: '', region: '', postal: '', lat: '', lng: '', geoRegion: '', gmb: '', gmbReview: '' },
  nav: { main: [], footer: [], services: [] },
  services: [],
  pages: {}
};

function deepMerge(base, override) {
  if (!override || typeof override !== 'object') return base;
  const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
  Object.keys(override).forEach((k) => {
    if (override[k] && typeof override[k] === 'object' && !Array.isArray(override[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
      out[k] = deepMerge(base[k], override[k]);
    } else if (override[k] !== undefined) out[k] = override[k];
  });
  return out;
}
function getContent() {
  const stored = readJSON(CONTENT_FILE, null);
  if (!stored) return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  return deepMerge(DEFAULT_CONTENT, stored);
}
if (!fs.existsSync(CONTENT_FILE)) writeJSON(CONTENT_FILE, DEFAULT_CONTENT);

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, Date.now() + '-' + safe);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: (_req, file, cb) => {
  if (/^(image|video)\//.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only images and videos allowed'));
}});

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'T.E.G Backend', time: new Date().toISOString() }));
app.get('/api/content', (_req, res) => res.json(getContent()));

async function sendOwnerNotification(entry) {
  // The Admin CMS contact email is the source of truth for lead notifications.
  // NOTIFY_EMAIL / TEG_NOTIFY_EMAIL remains only as an explicit deployment override.
  const cmsEmail = String(((getContent().contact || {}).email) || '').trim();
  const notifyEmail = NOTIFY_EMAIL_OVERRIDE || cmsEmail;
  if (!notifyEmail) return { sent: false, reason: 'No owner notification email configured in Admin' };

  // Owner email via FormSubmit (no SMTP / nodemailer required)
  const subject = 'New estimate request - T.E.G Carpet Cleaning' + (entry.service ? ' (' + entry.service + ')' : '');
  const textBody = [
    'New quote / estimate request from the website.',
    '',
    'Name: ' + entry.name,
    'Phone: ' + entry.phone,
    'Email: ' + entry.email,
    'Service: ' + (entry.service || '(not specified)'),
    'Submitted: ' + entry.createdAt,
    '',
    'Details:',
    entry.message || '(none)',
    '',
    'Reply to the customer at: ' + entry.email
  ].join('\n');

  const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(notifyEmail), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: entry.name,
      email: entry.email,
      phone: entry.phone,
      service: entry.service || '',
      message: textBody,
      _subject: subject,
      _replyto: entry.email,
      _template: 'table',
      _captcha: 'false'
    })
  });
  if (!res.ok) {
    const errText = await res.text().catch(function () { return ''; });
    return { sent: false, reason: 'FormSubmit HTTP ' + res.status + ' ' + String(errText).slice(0, 120) };
  }
  return { sent: true, to: notifyEmail, via: 'formsubmit' };
}

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, service, message } = req.body || {};
  if (!name || !phone || !email) return res.status(400).json({ ok: false, error: 'Name, phone and email are required.' });
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: String(email).trim(),
    service: String(service || '').trim(),
    message: String(message || '').trim(),
    createdAt: new Date().toISOString(),
    read: false
  };
  const list = readJSON(SUBMISSIONS_FILE, []);
  list.unshift(entry);
  writeJSON(SUBMISSIONS_FILE, list);

  let emailResult = { sent: false };
  try {
    emailResult = await sendOwnerNotification(entry);
    if (emailResult.sent) console.log('Owner notify email sent to', emailResult.to, 'via', emailResult.via || 'formsubmit', 'for lead', entry.id);
    else console.warn('Owner notify email skipped:', emailResult.reason);
  } catch (err) {
    console.error('Owner notify email failed:', err.message);
    emailResult = { sent: false, reason: err.message };
  }

  res.json({
    ok: true,
    message: 'Quote request received.',
    id: entry.id,
    emailed: !!emailResult.sent
  });
});

app.post('/api/analytics/event', (req, res) => {
  try {
    const body = req.body || {};
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      event: String(body.event || 'unknown').slice(0, 64),
      props: body.props && typeof body.props === 'object' ? body.props : {},
      path: String(body.path || '').slice(0, 200),
      title: String(body.title || '').slice(0, 120),
      referrer: String(body.referrer || '').slice(0, 300),
      sid: String(body.sid || '').slice(0, 40),
      ts: body.ts || new Date().toISOString(),
      ua: String(body.ua || '').slice(0, 180),
      screen: String(body.screen || '').slice(0, 20),
      lang: String(body.lang || '').slice(0, 16),
      ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim().slice(0, 64)
    };
    const store = readJSON(ANALYTICS_FILE, { events: [] });
    if (!Array.isArray(store.events)) store.events = [];
    store.events.push(entry);
    if (store.events.length > 50000) store.events = store.events.slice(-50000);
    writeJSON(ANALYTICS_FILE, store);
  } catch (e) {}
  res.status(204).end();
});

function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.key || (req.body && req.body.password);
  if (key === ADMIN_PASSWORD) return next();
  return res.status(401).json({ ok: false, error: 'Unauthorized' });
}

function aggregateAnalytics(events, days) {
  const since = Date.now() - (days || 30) * 86400000;
  const filtered = (events || []).filter((e) => { const t = Date.parse(e.ts || 0); return !isNaN(t) && t >= since; });
  const count = (name) => filtered.filter((e) => e.event === name).length;
  const byPath = {}, byEvent = {}, byDay = {}, sessions = new Set();
  filtered.forEach((e) => {
    byEvent[e.event] = (byEvent[e.event] || 0) + 1;
    if (e.path) byPath[e.path] = (byPath[e.path] || 0) + 1;
    if (e.sid) sessions.add(e.sid);
    const day = (e.ts || '').slice(0, 10);
    if (day) byDay[day] = (byDay[day] || 0) + 1;
  });
  const topPages = Object.entries(byPath).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([path, views]) => ({ path, views }));
  const phone = count('phone_click');
  const gmb = count('gmb_click') + count('gmb_review_click') + count('maps_click');
  const pageViews = count('page_view');
  return {
    rangeDays: days || 30, totalEvents: filtered.length, pageViews, sessions: sessions.size,
    phoneClicks: phone, gmbClicks: gmb, smsClicks: count('sms_click'), ctaClicks: count('cta_click'),
    formSubmits: count('form_submit'),
    conversionRate: pageViews ? Math.round(((phone + gmb + count('form_submit')) / pageViews) * 1000) / 10 : 0,
    byEvent, topPages, byDay, recent: filtered.slice(-100).reverse()
  };
}

app.get('/api/admin/analytics', requireAdmin, (req, res) => {
  const days = Math.min(90, Math.max(1, parseInt(req.query.days, 10) || 30));
  const store = readJSON(ANALYTICS_FILE, { events: [] });
  res.json({ ok: true, data: aggregateAnalytics(store.events || [], days) });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) return res.json({ ok: true, token: ADMIN_PASSWORD });
  res.status(401).json({ ok: false, error: 'Wrong password' });
});

app.get('/api/admin/content', requireAdmin, (_req, res) => res.json({ ok: true, data: getContent() }));

app.put('/api/admin/content', requireAdmin, (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return res.status(400).json({ ok: false, error: 'Invalid content' });
  }

  // Never replace the stored CMS object with a partial/stale client payload.
  // Merge against the current persistent copy first, then atomically write it.
  const current = getContent();
  const merged = deepMerge(current, incoming);
  writeJSON(CONTENT_FILE, merged);

  // Read back the exact persistent file before telling Admin that the save succeeded.
  const saved = readJSON(CONTENT_FILE, null);
  if (!saved) return res.status(500).json({ ok: false, error: 'Content could not be verified after save' });

  res.json({ ok: true, message: 'Content saved and verified', data: saved });
});

app.get('/api/admin/submissions', requireAdmin, (_req, res) => res.json({ ok: true, data: readJSON(SUBMISSIONS_FILE, []) }));
app.patch('/api/admin/submissions/:id', requireAdmin, (req, res) => {
  const list = readJSON(SUBMISSIONS_FILE, []);
  const i = list.findIndex((s) => s.id === req.params.id);
  if (i < 0) return res.status(404).json({ ok: false, error: 'Not found' });
  if (req.body.read !== undefined) list[i].read = !!req.body.read;
  writeJSON(SUBMISSIONS_FILE, list);
  res.json({ ok: true, data: list[i] });
});
app.delete('/api/admin/submissions/:id', requireAdmin, (req, res) => {
  writeJSON(SUBMISSIONS_FILE, readJSON(SUBMISSIONS_FILE, []).filter((s) => s.id !== req.params.id));
  res.json({ ok: true });
});
app.post('/api/admin/upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: 'No file' });
  res.json({ ok: true, url: '/uploads/' + req.file.filename, filename: req.file.filename });
});

function renderPublicHtml(req, res, next) {
  if (req.method !== 'GET') return next();
  const requested = req.path === '/' ? '/index.html' : req.path;
  if (!/^\/[A-Za-z0-9._/-]+\.html$/.test(requested)) return next();

  const filePath = path.resolve(__dirname, '.' + requested);
  if (filePath !== path.resolve(__dirname, path.basename(filePath)) && !filePath.startsWith(path.resolve(__dirname) + path.sep)) return next();
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next();

  let html = fs.readFileSync(filePath, 'utf8');
  const content = getContent();
  const branding = content.branding || {};
  const contact = content.contact || {};
  const seo = content.seo || {};
  const pageKey = path.basename(filePath);
  const page = (content.pages && content.pages[pageKey]) || {};
  const service = (content.services || []).find((item) => item.href === pageKey) || {};

  const siteName = String(branding.siteName || 'T.E.G Carpet & Furniture Steam Cleaning');
  const phone = String(contact.phone || '+1 (414) 775-3705');
  const email = String(contact.email || 'contact@tegcarpetsteamcleaning.com');
  const address = String(contact.address || '4111 N Port Washington Rd suite 1, Milwaukee, WI 53217');
  const title = String(page.title || service.seoTitle || (pageKey === 'index.html' ? seo.title : '')).trim();
  const description = String(page.description || service.seoDescription || (pageKey === 'index.html' ? seo.description : '')).trim();

  html = html.replace(/(<title>)[\s\S]*?(<\/title>)/i, function (_, open, close) {
    return title ? open + title.replace(/</g, '&lt;') + close : _;
  });
  if (description) {
    const safeDescription = description.replace(/"/g, '&quot;');
    if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
      html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, '<meta name="description" content="' + safeDescription + '" />');
    }
  }
  html = html.replace(/href=["']tel:["']/g, 'href="tel:' + phone.replace(/[^+0-9]/g, '') + '"');
  html = html.replace(/href=["']mailto:["']/g, 'href="mailto:' + email + '"');
  html = html.replace(/data-teg-phone(?![^>]*href=)/g, 'data-teg-phone');
  html = html.replace(/(<span[^>]*data-teg-address[^>]*>)[\s\S]*?(<\/span>)/gi, '$1' + address.replace(/</g, '&lt;') + '$2');
  html = html.replace(/(<a[^>]*data-teg-email[^>]*>)[\s\S]*?(<\/a>)/gi, '$1' + email + '$2');
  html = html.replace(/(<a[^>]*data-teg-phone[^>]*>)[\s\S]*?(<\/a>)/gi, '$1' + phone + '$2');

  res.type('html').send(html);
}

app.use(express.static(__dirname));
app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ ok: false, error: 'Not found' });
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log('T.E.G server running on http://' + HOST + ':' + PORT);
  console.log('Admin auth: configured (value not logged)');
  console.log('Owner notify email: configured via Admin CMS or explicit environment override | via FormSubmit (no SMTP)');
});
