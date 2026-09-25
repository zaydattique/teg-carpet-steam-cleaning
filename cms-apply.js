/**
 * T.E.G CMS → live site: hero, OG, page heroes, logo, before/after
 */
(function () {
  function absUrl(u) {
    if (!u) return '';
    if (/^https?:\/\//i.test(u) || u.indexOf('//') === 0) return u;
    if (u.charAt(0) === '/') return u;
    return '/' + String(u).replace(/^\.\//, '');
  }
  function setMeta(prop, content, isName) {
    if (!content) return;
    var sel = isName ? 'meta[name="' + prop + '"]' : 'meta[property="' + prop + '"]';
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      if (isName) el.setAttribute('name', prop);
      else el.setAttribute('property', prop);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }
  function applyHero(m) {
    if (!m) return;
    var video = document.getElementById('heroVideo') || document.querySelector('video.hero-video');
    var poster = absUrl(m.heroPoster || '');
    var vid = absUrl(m.heroVideo || '');
    var imgOnly = absUrl(m.heroImage || '');
    if (video) {
      if (poster) video.setAttribute('poster', poster);
      if (vid) {
        var src = video.querySelector('source');
        if (!src) { src = document.createElement('source'); video.appendChild(src); }
        if (src.getAttribute('src') !== vid) {
          src.setAttribute('src', vid);
          src.setAttribute('type', /\.webm$/i.test(vid) ? 'video/webm' : 'video/mp4');
          try { video.load(); } catch (e) {}
        }
      } else if (imgOnly) {
        var wrap = video.closest('.hero-video-wrap') || video.parentElement;
        if (wrap) {
          wrap.classList.add('has-hero-image');
          wrap.style.backgroundImage = 'url("' + imgOnly + '")';
          wrap.style.backgroundSize = 'cover';
          wrap.style.backgroundPosition = 'center';
          video.style.display = 'none';
        }
      }
    }
  }
  function applyPageHero(pm) {
    if (!pm) return;
    var path = (location.pathname || '').split('/').pop() || 'index.html';
    var entry = pm[path];
    var url = entry && entry.heroImage ? absUrl(entry.heroImage) : '';
    if (!url) return;
    var el = document.querySelector('.page-hero, .inner-hero, .hero-banner, section.page-header');
    if (el) {
      el.style.backgroundImage = 'url("' + url + '")';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      var img = el.querySelector('img');
      if (img) { img.src = url; img.loading = 'lazy'; }
    }
  }
  function applyServiceMedia(services) {
    if (!services || !services.length) return;
    var path = (location.pathname || '').split('/').pop() || '';
    var svc = null;
    for (var i = 0; i < services.length; i++) {
      if ((services[i].href || '') === path) { svc = services[i]; break; }
    }
    if (!svc) return;
    if (svc.heroImage) {
      var url = absUrl(svc.heroImage);
      var el = document.querySelector('.page-hero, .service-hero, .inner-hero, .hero-banner');
      if (el) {
        el.style.backgroundImage = 'url("' + url + '")';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
      }
    }
    var pairs = Array.isArray(svc.beforeAfter) ? svc.beforeAfter.filter(function (p) { return p && (p.before || p.after); }) : [];
    if (!pairs.length) return;
    var host = document.querySelector('[data-before-after], #beforeAfterGallery, .before-after-grid');
    if (!host) {
      document.querySelectorAll('section').forEach(function (sec) {
        var h = sec.querySelector('h2, h3');
        if (h && /before/i.test(h.textContent || '') && /after/i.test(h.textContent || '')) {
          host = sec.querySelector('.grid, .gallery, .cards') || sec;
        }
      });
    }
    if (!host || host.getAttribute('data-cms-ba') === '1') return;
    host.innerHTML = pairs.map(function (p) {
      return '<div class="ba-pair"><div class="ba-imgs">' +
        (p.before ? '<div><span class="ba-label">Before</span><img src="' + absUrl(p.before) + '" alt="Before" loading="lazy" width="600" height="400"/></div>' : '') +
        (p.after ? '<div><span class="ba-label">After</span><img src="' + absUrl(p.after) + '" alt="After" loading="lazy" width="600" height="400"/></div>' : '') +
        '</div>' + (p.caption ? '<p style="padding:8px 12px;font-size:13px;color:#64748b;margin:0">' + String(p.caption).replace(/</g,'') + '</p>' : '') + '</div>';
    }).join('');
    host.setAttribute('data-cms-ba', '1');
    host.classList.add('ba-gallery');
  }
  function applyBranding(b, m) {
    var logo = absUrl((m && m.logo) || (b && b.logoUrl) || '');
    var fav = absUrl((m && m.favicon) || (b && b.faviconUrl) || '');
    if (logo) {
      document.querySelectorAll('a.logo').forEach(function (a) {
        if (a.querySelector('img.cms-logo')) return;
        var img = document.createElement('img');
        img.className = 'cms-logo';
        img.src = logo;
        img.alt = (b && b.siteName) || 'Logo';
        img.style.maxHeight = '40px';
        img.style.width = 'auto';
        var mark = a.querySelector('.logo-mark');
        var text = a.querySelector('.logo-text');
        if (mark) mark.style.display = 'none';
        if (text) text.style.display = 'none';
        a.insertBefore(img, a.firstChild);
      });
    }
    if (fav) {
      var link = document.querySelector('link[rel="icon"]');
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = fav;
    }
  }
  function applyOg(s, m, b) {
    var og = absUrl((s && s.ogImage) || (m && (m.ogImage || m.heroPoster || m.heroImage)) || '');
    if (!og) return;
    var full = og.indexOf('http') === 0 ? og : (location.origin + og);
    setMeta('og:image', full);
    setMeta('twitter:image', full, true);
    if (s && s.ogTitle) setMeta('og:title', s.ogTitle);
    if (s && s.ogDescription) setMeta('og:description', s.ogDescription);
  }
  function apply(data) {
    if (!data) return;
    try {
      applyHero(data.media || {});
      applyPageHero(data.pageMedia || {});
      applyServiceMedia(data.services || []);
      applyBranding(data.branding || {}, data.media || {});
      applyOg(data.seo || {}, data.media || {}, data.branding || {});
      window.__TEG_CONTENT = data;
    } catch (e) {}
  }
  function load() {
    fetch('/api/content', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(apply)
      .catch(function () {
        fetch('data/content.json', { credentials: 'same-origin' })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (d) { if (d) apply(d); })
          .catch(function () {});
      });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
  setTimeout(load, 600);
})();
