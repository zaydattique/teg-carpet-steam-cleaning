let serverMode = false, cache = null;

function val(id) {
  const e = document.getElementById(id);
  return e ? e.value.trim() : '';
}
function set(id, v) {
  const e = document.getElementById(id);
  if (e) e.value = v || '';
}
function keep(id, prev) {
  const v = val(id);
  if (v) return v;
  return prev || '';
}
function showToast(msg, ok) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.toggle('toast-ok', !!ok);
  t.classList.toggle('toast-err', ok === false);
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}
function esc(s) {
  return String(s || '').replace(/&/g, '&').replace(/"/g, '"').replace(/</g, '<');
}
function toggleSidebar() {
  const s = document.getElementById('adminSidebar');
  const b = document.getElementById('sidebarBackdrop');
  if (!s) return;
  s.classList.toggle('open');
  if (b) b.classList.toggle('show', s.classList.contains('open'));
}
function closeSidebar() {
  const s = document.getElementById('adminSidebar');
  const b = document.getElementById('sidebarBackdrop');
  if (s) s.classList.remove('open');
  if (b) b.classList.remove('show');
}
function showPanel(id) {
  closeSidebar();
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.sidebar button').forEach((b) => b.classList.remove('active'));
  const p = document.getElementById('panel-' + id);
  if (p) p.classList.add('active');
  const btn = document.querySelector('.sidebar button[data-panel="' + id + '"]');
  if (btn) btn.classList.add('active');
}
function showProgress(pct, label) {
  let bar = document.getElementById('uploadProgress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'uploadProgress';
    bar.innerHTML = '<div class="up-label"></div><div class="up-track"><div class="up-fill"></div></div>';
    document.body.appendChild(bar);
  }
  bar.classList.add('show');
  const fill = bar.querySelector('.up-fill');
  const lab = bar.querySelector('.up-label');
  if (fill) fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
  if (lab) lab.textContent = label || Math.round(pct) + '%';
}
function hideProgress() {
  const bar = document.getElementById('uploadProgress');
  if (bar) {
    bar.classList.remove('show');
    const fill = bar.querySelector('.up-fill');
    if (fill) fill.style.width = '0%';
  }
}
function compressImage(file, maxW, quality) {
  maxW = maxW || 1920;
  quality = quality || 0.82;
  return new Promise((resolve) => {
    if (!file || !/^image\//.test(file.type) || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      resolve(file);
      return;
    }
    if (file.size < 350000) {
      resolve(file);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = function () {
      URL.revokeObjectURL(url);
      let w = img.width, h = img.height;
      if (w > maxW) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(function (blob) {
        if (!blob || blob.size >= file.size) {
          resolve(file);
          return;
        }
        const name = (file.name || 'image.jpg').replace(/\.\w+$/, '.jpg');
        resolve(new File([blob], name, { type: 'image/jpeg' }));
      }, 'image/jpeg', quality);
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}
async function login() {
  const pw = document.getElementById('password').value;
  try {
    const ok = await TEG.loginServer(pw);
    if (ok) {
      serverMode = true;
      sessionStorage.setItem('teg_admin', pw);
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('dashboard').classList.add('active');
      document.getElementById('serverBadge').style.display = 'inline-block';
      await load();
      return;
    }
  } catch (e) {}
  document.getElementById('loginHint').textContent = 'Wrong password or server offline';
}
function logout() {
  sessionStorage.removeItem('teg_admin');
  sessionStorage.removeItem('teg_admin_key');
  location.reload();
}
async function load() {
  let data = null;
  if (serverMode) {
    try { data = await TEG.loadContentServer(); } catch (e) { showToast('Could not load from server', false); }
  }
  if (!data) {
    try { data = JSON.parse(localStorage.getItem('teg_content') || 'null'); } catch (e) {}
  }
  if (data) {
    cache = data;
    fill(data);
    showToast('Content loaded ✓', true);
  }
  document.getElementById('connStatus').textContent = serverMode
    ? 'Connected — media preserved on save'
    : 'Local only';
}
function fill(d) {
  const b = d.branding || {}, m = d.media || {}, c = d.contact || {}, s = d.seo || {}, loc = d.location || {};
  set('brand-siteName', b.siteName); set('brand-logoMark', b.logoMark); set('brand-logoText', b.logoText);
  set('media-logo', m.logo || b.logoUrl || ''); set('media-favicon', m.favicon || b.faviconUrl || '');
  set('media-heroImage', m.heroImage || ''); set('media-heroVideo', m.heroVideo || '');
  set('media-heroPoster', m.heroPoster || ''); set('media-ogImage', m.ogImage || ''); set('media-aboutImage', m.aboutImage || '');
  const pm = d.pageMedia || {};
  set('pm-services', (pm['services.html'] || {}).heroImage || '');
  set('pm-areas', (pm['areas.html'] || {}).heroImage || '');
  set('pm-about', (pm['about.html'] || {}).heroImage || '');
  set('pm-faq', (pm['faq.html'] || {}).heroImage || '');
  set('pm-contact', (pm['contact.html'] || {}).heroImage || '');
  set('contact-phone', c.phone); set('contact-phoneTel', c.phoneTel); set('contact-whatsapp', c.whatsapp);
  set('contact-whatsappDigits', c.whatsappDigits); set('contact-email', c.email); set('contact-address', c.address);
  set('contact-addressLine1', c.addressLine1); set('contact-city', c.city); set('contact-region', c.region);
  set('contact-postal', c.postal); set('contact-hours', c.hours);
  set('seo-title', s.title); set('seo-description', s.description); set('seo-keywords', s.keywords);
  set('seo-canonical', s.canonical); set('seo-ogTitle', s.ogTitle); set('seo-ogDescription', s.ogDescription);
  set('seo-ogImage', s.ogImage || m.ogImage || ''); set('seo-twitterTitle', s.twitterTitle);
  set('seo-twitterDescription', s.twitterDescription); set('seo-twitterImage', s.twitterImage || m.ogImage || '');
  set('loc-name', loc.name); set('loc-address', loc.address); set('loc-city', loc.city); set('loc-region', loc.region);
  set('loc-postal', loc.postal); set('loc-lat', loc.lat); set('loc-lng', loc.lng); set('loc-geoRegion', loc.geoRegion);
  window._servicesCache = Array.isArray(d.services) ? JSON.parse(JSON.stringify(d.services)) : [];
  renderServices(d.services || []);
  renderNav('main', (d.nav || {}).main); renderNav('footer', (d.nav || {}).footer); renderNav('services', (d.nav || {}).services);
  window._pagesSeo = d.pages || {}; loadPageSeoFields();
  const prevMap = { logoPreview: m.logo || b.logoUrl, favPreview: m.favicon || b.faviconUrl, heroImgPreview: m.heroImage, posterPreview: m.heroPoster, ogMediaPreview: m.ogImage, aboutPreview: m.aboutImage };
  Object.keys(prevMap).forEach(function (id) {
    const img = document.getElementById(id);
    if (img && prevMap[id]) { img.src = prevMap[id]; img.classList.add('show'); }
  });
}
function collect() {
  const prev = cache ? JSON.parse(JSON.stringify(cache)) : {};
  const prevM = prev.media || {}, prevB = prev.branding || {}, prevSeo = prev.seo || {}, prevPm = prev.pageMedia || {};
  try { syncBaFromDom(); } catch (e) {}
  const data = prev;
  data.branding = { siteName: keep('brand-siteName', prevB.siteName), logoMark: keep('brand-logoMark', prevB.logoMark), logoText: keep('brand-logoText', prevB.logoText), logoUrl: keep('media-logo', prevB.logoUrl || prevM.logo), faviconUrl: keep('media-favicon', prevB.faviconUrl || prevM.favicon) };
  data.media = { logo: keep('media-logo', prevM.logo), favicon: keep('media-favicon', prevM.favicon), heroImage: keep('media-heroImage', prevM.heroImage), heroVideo: keep('media-heroVideo', prevM.heroVideo), heroPoster: keep('media-heroPoster', prevM.heroPoster), ogImage: keep('media-ogImage', prevM.ogImage), aboutImage: keep('media-aboutImage', prevM.aboutImage) };
  data.pageMedia = Object.assign({}, prevPm, {
    'services.html': { heroImage: keep('pm-services', (prevPm['services.html'] || {}).heroImage) },
    'areas.html': { heroImage: keep('pm-areas', (prevPm['areas.html'] || {}).heroImage) },
    'about.html': { heroImage: keep('pm-about', (prevPm['about.html'] || {}).heroImage) },
    'faq.html': { heroImage: keep('pm-faq', (prevPm['faq.html'] || {}).heroImage) },
    'contact.html': { heroImage: keep('pm-contact', (prevPm['contact.html'] || {}).heroImage) }
  });
  data.contact = { phone: keep('contact-phone', (prev.contact || {}).phone), phoneTel: keep('contact-phoneTel', (prev.contact || {}).phoneTel), whatsapp: keep('contact-whatsapp', (prev.contact || {}).whatsapp), whatsappDigits: keep('contact-whatsappDigits', (prev.contact || {}).whatsappDigits), email: keep('contact-email', (prev.contact || {}).email), address: keep('contact-address', (prev.contact || {}).address), addressLine1: keep('contact-addressLine1', (prev.contact || {}).addressLine1), city: keep('contact-city', (prev.contact || {}).city), region: keep('contact-region', (prev.contact || {}).region), postal: keep('contact-postal', (prev.contact || {}).postal), hours: keep('contact-hours', (prev.contact || {}).hours) };
  data.seo = { title: keep('seo-title', prevSeo.title), description: keep('seo-description', prevSeo.description), keywords: keep('seo-keywords', prevSeo.keywords), canonical: keep('seo-canonical', prevSeo.canonical), ogTitle: keep('seo-ogTitle', prevSeo.ogTitle), ogDescription: keep('seo-ogDescription', prevSeo.ogDescription), ogImage: keep('seo-ogImage', prevSeo.ogImage || data.media.ogImage), twitterTitle: keep('seo-twitterTitle', prevSeo.twitterTitle), twitterDescription: keep('seo-twitterDescription', prevSeo.twitterDescription), twitterImage: keep('seo-twitterImage', prevSeo.twitterImage || data.media.ogImage) };
  data.location = { name: keep('loc-name', (prev.location || {}).name), address: keep('loc-address', (prev.location || {}).address), city: keep('loc-city', (prev.location || {}).city), region: keep('loc-region', (prev.location || {}).region), postal: keep('loc-postal', (prev.location || {}).postal), lat: keep('loc-lat', (prev.location || {}).lat), lng: keep('loc-lng', (prev.location || {}).lng), geoRegion: keep('loc-geoRegion', (prev.location || {}).geoRegion) };
  data.services = collectServices();
  data.nav = { main: collectNav('main'), footer: collectNav('footer'), services: collectNav('services') };
  data.pages = window._pagesSeo || prev.pages || {};
  return data;
}
async function saveAll() {
  const data = collect();
  localStorage.setItem('teg_content', JSON.stringify(data));
  cache = data;
  window._servicesCache = Array.isArray(data.services) ? JSON.parse(JSON.stringify(data.services)) : [];
  if (serverMode) {
    try {
      showProgress(60, 'Saving…');
      await TEG.saveContentServer(data);
      hideProgress();
      showToast('Saved to server ✓ — media kept', true);
      const status = document.getElementById('connStatus');
      if (status) status.textContent = 'Last saved: ' + new Date().toLocaleTimeString() + ' ✓';
      return true;
    } catch (e) {
      hideProgress();
      showToast('Server save failed — saved locally only', false);
      return false;
    }
  }
  showToast('Saved locally ✓', true);
  return true;
}
async function serverUpload(input, fieldId, previewId) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (!serverMode) { showToast('Login required to upload', false); return; }
  try {
    showProgress(10, 'Compressing…');
    const ready = await compressImage(file);
    showProgress(40, 'Uploading…');
    const url = await TEG.uploadFile(ready);
    if (fieldId) { const el = document.getElementById(fieldId); if (el) el.value = url; }
    if (previewId) { const img = document.getElementById(previewId); if (img) { img.src = url; img.classList.add('show'); } }
    if (!cache) cache = {};
    if (!cache.media) cache.media = {};
    const mapField = { 'media-logo': 'logo', 'media-favicon': 'favicon', 'media-heroImage': 'heroImage', 'media-heroVideo': 'heroVideo', 'media-heroPoster': 'heroPoster', 'media-ogImage': 'ogImage', 'media-aboutImage': 'aboutImage' };
    if (fieldId && mapField[fieldId]) cache.media[mapField[fieldId]] = url;
    if (fieldId === 'media-ogImage') {
      if (!cache.seo) cache.seo = {};
      cache.seo.ogImage = url; cache.seo.twitterImage = url;
      set('seo-ogImage', url); set('seo-twitterImage', url);
    }
    if (fieldId && fieldId.indexOf('pm-') === 0) {
      if (!cache.pageMedia) cache.pageMedia = {};
      const page = fieldId === 'pm-services' ? 'services.html' : fieldId === 'pm-areas' ? 'areas.html' : fieldId === 'pm-about' ? 'about.html' : fieldId === 'pm-faq' ? 'faq.html' : 'contact.html';
      cache.pageMedia[page] = { heroImage: url };
    }
    showProgress(90, 'Saving content…');
    await saveAll();
    showProgress(100, 'Done');
    setTimeout(hideProgress, 500);
    showToast('Uploaded & saved ✓', true);
  } catch (e) {
    hideProgress();
    showToast('Upload failed: ' + (e.message || 'error'), false);
  }
}
async function uploadInto(input, targetInput) {
  const file = input.files && input.files[0];
  if (!file || !targetInput) return;
  if (!serverMode) { showToast('Login required to upload', false); return; }
  try {
    showProgress(10, 'Compressing…');
    const ready = await compressImage(file);
    showProgress(45, 'Uploading…');
    const url = await TEG.uploadFile(ready);
    targetInput.value = url;
    hideProgress();
    showToast('Uploaded ✓ — click Save to persist', true);
  } catch (e) {
    hideProgress();
    showToast('Upload failed', false);
  }
}
function renderServices(list) {
  const box = document.getElementById('servicesList');
  if (!box) return;
  box.innerHTML = '';
  (list || []).forEach(function (svc) {
    const div = document.createElement('div');
    div.className = 'service-item';
    div.innerHTML = '<button type="button" class="remove" onclick="this.parentElement.remove()">×</button><div class="form-group"><label>Name</label><input class="svc-name" value="' + esc(svc.name || '') + '" /></div><div class="form-group"><label>Description</label><textarea class="svc-desc" rows="2">' + esc(svc.description || '') + '</textarea></div><div class="form-group"><label>Href</label><input class="svc-href" value="' + esc(svc.href || '') + '" /></div><div class="form-group"><label>Service hero image</label><input class="svc-heroImage" value="' + esc(svc.heroImage || '') + '" /></div><div class="upload-box">Upload service hero<br/><input type="file" accept="image/*" onchange="uploadInto(this,this.closest(\'.service-item\').querySelector(\'.svc-heroImage\'))" /></div><div class="form-group"><label>SEO title</label><input class="svc-seoTitle" value="' + esc(svc.seoTitle || '') + '" /></div><div class="form-group"><label>SEO keywords</label><input class="svc-seoKeywords" value="' + esc(svc.seoKeywords || '') + '" /></div><div class="form-group"><label>SEO description</label><textarea class="svc-seoDesc" rows="2">' + esc(svc.seoDescription || '') + '</textarea></div>';
    box.appendChild(div);
  });
}
function collectServices() {
  const box = document.getElementById('servicesList');
  const prev = window._servicesCache || (cache && Array.isArray(cache.services) ? cache.services : []);
  if (!box || !box.querySelectorAll('.service-item').length) {
    return prev.map(function (s) { return Object.assign({}, s, { beforeAfter: Array.isArray(s.beforeAfter) ? s.beforeAfter : [] }); });
  }
  return Array.from(box.querySelectorAll('.service-item')).map(function (el, i) {
    const href = (el.querySelector('.svc-href') || {}).value ? el.querySelector('.svc-href').value.trim() : '';
    const old = prev.find(function (p) { return p.href === href; }) || prev[i] || {};
    const heroEl = el.querySelector('.svc-heroImage');
    return {
      name: (el.querySelector('.svc-name') || {}).value ? el.querySelector('.svc-name').value.trim() : (old.name || ''),
      description: (el.querySelector('.svc-desc') || {}).value ? el.querySelector('.svc-desc').value.trim() : (old.description || ''),
      href: href || old.href || '',
      seoTitle: (el.querySelector('.svc-seoTitle') || {}).value ? el.querySelector('.svc-seoTitle').value.trim() : (old.seoTitle || ''),
      seoKeywords: (el.querySelector('.svc-seoKeywords') || {}).value ? el.querySelector('.svc-seoKeywords').value.trim() : (old.seoKeywords || ''),
      seoDescription: (el.querySelector('.svc-seoDesc') || {}).value ? el.querySelector('.svc-seoDesc').value.trim() : (old.seoDescription || ''),
      heroImage: heroEl && heroEl.value.trim() ? heroEl.value.trim() : (old.heroImage || ''),
      beforeAfter: Array.isArray(old.beforeAfter) ? old.beforeAfter : []
    };
  });
}
function addService() {
  const list = collectServices();
  list.push({ name: 'New service', description: '', href: 'services.html', seoTitle: '', seoKeywords: '', seoDescription: '', heroImage: '', beforeAfter: [] });
  window._servicesCache = list;
  renderServices(list);
}
function renderBeforeAfterPanel() {
  closeSidebar();
  const box = document.getElementById('baAllServices');
  if (!box) return;
  let services = [];
  if (window._servicesCache && window._servicesCache.length) services = window._servicesCache;
  else if (cache && Array.isArray(cache.services)) { services = JSON.parse(JSON.stringify(cache.services)); window._servicesCache = services; }
  else { services = collectServices(); window._servicesCache = services; }
  if (!services.length) { box.innerHTML = '<p class="desc">No services found. Add services first under Services + SEO.</p>'; return; }
  box.innerHTML = services.map(function (svc, si) {
    const pairs = Array.isArray(svc.beforeAfter) ? svc.beforeAfter : [];
    const pairsHtml = pairs.length ? pairs.map(function (p, pi) { return baPairHtml(si, pi, p); }).join('') : '<p class="desc" style="margin:8px 0">No pairs yet for this service.</p>';
    return '<div class="ba-service-block" data-si="' + si + '"><h3>' + esc(svc.name || svc.href || ('Service ' + (si + 1))) + ' <span>' + pairs.length + ' pair' + (pairs.length === 1 ? '' : 's') + '</span></h3><div class="ba-pairs">' + pairsHtml + '</div><button type="button" class="btn btn-outline btn-sm" onclick="addBaPairFor(' + si + ')">+ Add pair for this service</button></div>';
  }).join('');
}
function baPairHtml(si, pi, p) {
  p = p || {};
  const before = p.before || '', after = p.after || '', cap = p.caption || '';
  const bPrev = before ? '<img src="' + esc(before) + '" alt="before" onerror="this.style.display=\'none\'" />' : '<div class="thumb-empty">Before</div>';
  const aPrev = after ? '<img src="' + esc(after) + '" alt="after" onerror="this.style.display=\'none\'" />' : '<div class="thumb-empty">After</div>';
  return '<div class="service-item ba-pair-item" data-si="' + si + '" data-pi="' + pi + '"><button type="button" class="remove" onclick="removeBaPairFor(' + si + ',' + pi + ')">×</button><div class="form-row"><div class="form-group"><label>Before URL</label><input class="ba-before" value="' + esc(before) + '" onchange="syncBaFromDom()" /></div><div class="form-group"><label>After URL</label><input class="ba-after" value="' + esc(after) + '" onchange="syncBaFromDom()" /></div></div><div class="upload-box">Upload before <input type="file" accept="image/*" onchange="uploadInto(this,this.closest(\'.ba-pair-item\').querySelector(\'.ba-before\'));setTimeout(function(){syncBaFromDom();renderBeforeAfterPanel()},500)" /> · Upload after <input type="file" accept="image/*" onchange="uploadInto(this,this.closest(\'.ba-pair-item\').querySelector(\'.ba-after\'));setTimeout(function(){syncBaFromDom();renderBeforeAfterPanel()},500)" /></div><div class="ba-previews">' + bPrev + aPrev + '</div><div class="form-group"><label>Caption</label><input class="ba-caption" value="' + esc(cap) + '" onchange="syncBaFromDom()" /></div></div>';
}
function addBaPairFor(si) {
  syncBaFromDom();
  const services = window._servicesCache || [];
  if (!services[si]) return;
  if (!Array.isArray(services[si].beforeAfter)) services[si].beforeAfter = [];
  services[si].beforeAfter.push({ before: '', after: '', caption: '' });
  window._servicesCache = services;
  renderBeforeAfterPanel();
}
function removeBaPairFor(si, pi) {
  syncBaFromDom();
  const services = window._servicesCache || [];
  if (!services[si] || !Array.isArray(services[si].beforeAfter)) return;
  services[si].beforeAfter.splice(pi, 1);
  window._servicesCache = services;
  renderBeforeAfterPanel();
}
function syncBaFromDom() {
  const services = window._servicesCache || (cache && cache.services ? JSON.parse(JSON.stringify(cache.services)) : collectServices());
  if (!services.length) return;
  document.querySelectorAll('.ba-service-block').forEach(function (block) {
    const si = parseInt(block.getAttribute('data-si'), 10);
    if (isNaN(si) || !services[si]) return;
    const pairs = [];
    block.querySelectorAll('.ba-pair-item').forEach(function (el) {
      pairs.push({ before: (el.querySelector('.ba-before') || {}).value || '', after: (el.querySelector('.ba-after') || {}).value || '', caption: (el.querySelector('.ba-caption') || {}).value || '' });
    });
    services[si].beforeAfter = pairs;
  });
  window._servicesCache = services;
  if (cache) cache.services = services;
}
function saveBaThenAll() { syncBaFromDom(); return saveAll(); }
function renderBaPairs() { renderBeforeAfterPanel(); }
function addBaPair() { const services = window._servicesCache || []; if (services.length) addBaPairFor(0); }
function removeBaPair() {}
function navListId(cat) { return cat === 'main' ? 'navMainList' : cat === 'footer' ? 'navFooterList' : 'navServicesList'; }
function renderNav(cat, items) {
  const box = document.getElementById(navListId(cat));
  if (!box) return;
  box.innerHTML = '';
  (items || []).forEach(function (item) {
    const div = document.createElement('div');
    div.className = 'nav-item';
    div.innerHTML = '<button type="button" class="remove" onclick="this.parentElement.remove()">×</button><div class="form-row"><div class="form-group"><label>Label</label><input class="nav-label" value="' + esc(item.label || '') + '" /></div><div class="form-group"><label>URL</label><input class="nav-href" value="' + esc(item.href || '') + '" /></div></div>';
    box.appendChild(div);
  });
}
function collectNav(cat) {
  const box = document.getElementById(navListId(cat));
  if (!box || !box.querySelectorAll('.nav-item').length) return (cache && cache.nav && cache.nav[cat]) || [];
  return Array.from(box.querySelectorAll('.nav-item')).map(function (el) {
    return { label: (el.querySelector('.nav-label') || {}).value || '', href: (el.querySelector('.nav-href') || {}).value || '' };
  });
}
function addNavItem(cat) {
  const items = collectNav(cat);
  items.push({ label: 'New', href: '#' });
  renderNav(cat, items);
}
function loadPageSeoFields() {
  const page = val('pageSeoSelect') || 'index.html';
  const p = (window._pagesSeo || {})[page] || {};
  set('page-title', p.title || ''); set('page-description', p.description || ''); set('page-keywords', p.keywords || ''); set('page-canonical', p.canonical || '');
}
function savePageSeoThenAll() {
  const page = val('pageSeoSelect') || 'index.html';
  if (!window._pagesSeo) window._pagesSeo = {};
  window._pagesSeo[page] = { title: val('page-title'), description: val('page-description'), keywords: val('page-keywords'), canonical: val('page-canonical') };
  return saveAll();
}
function clearPageSeo() { set('page-title', ''); set('page-description', ''); set('page-keywords', ''); set('page-canonical', ''); }
async function loadInbox() {
  const box = document.getElementById('inboxList');
  if (!box) return;
  if (!serverMode) { box.innerHTML = '<p class="desc">Server mode required</p>'; return; }
  try {
    const items = await TEG.loadSubmissions();
    if (!items || !items.length) { box.innerHTML = '<p class="desc">No submissions yet</p>'; return; }
    box.innerHTML = items.map(function (s) {
      return '<div class="sub-card"><h4>' + esc(s.name || 'Lead') + '</h4><p>' + esc(s.phone || '') + ' · ' + esc(s.email || '') + '</p><p>' + esc(s.message || s.service || '') + '</p></div>';
    }).join('');
  } catch (e) { box.innerHTML = '<p class="desc">Could not load inbox</p>'; }
}
function exportJSON() {
  const data = collect();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'teg-content.json';
  a.click();
}
(async function init() {
  const key = sessionStorage.getItem('teg_admin');
  if (key) {
    try {
      if (await TEG.loginServer(key)) {
        serverMode = true;
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.add('active');
        document.getElementById('serverBadge').style.display = 'inline-block';
        await load();
      }
    } catch (e) {}
  }
})();
