/**
 * T.E.G CMS → live site: hero, OG, page heroes, logo, before/after
 * Safe applicator — never clears existing media URLs from server data
 */
(function () {
  function absUrl(u) {
    if (!u) return '';
    if (/^https?:\/\//i.test(u) || u.indexOf('//') === 0) return u;
    if (u.charAt(0) === '/') return u;
    return '/' + String(u).replace(/^\.\//, '');
  }
  function pathName() {
    var p = (location.pathname || '').split('/').pop() || 'index.html';
    if (!p || p === '') p = 'index.html';
    return p;
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
  function esc(s) {
    return String(s || '').replace(/&/g, '&').replace(/</g, '<').replace(/"/g, '"');
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
      var overlay = document.querySelector('.hero-overlay');
      if (overlay) overlay.classList.add('hero-overlay-strong');
    }
  }

  function paintHeroEl(el, url) {
    if (!el || !url) return;
    el.classList.add('has-cms-bg');
    el.style.backgroundImage = 'url("' + url + '")';
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
    if (!el.querySelector('.cms-hero-overlay')) {
      var ov = document.createElement('div');
      ov.className = 'cms-hero-overlay';
      el.insertBefore(ov, el.firstChild);
    }
  }

  function applyPageHero(pm, media) {
    var path = pathName();
    var url = '';
    if (pm && pm[path] && pm[path].heroImage) url = absUrl(pm[path].heroImage);
    if (!url && /^area-/.test(path) && pm && pm['areas.html'] && pm['areas.html'].heroImage) {
      url = absUrl(pm['areas.html'].heroImage);
    }
    if (!url && path === 'about.html' && media && media.aboutImage) {
      url = absUrl(media.aboutImage);
    }
    if (!url) return;
    var el = document.querySelector('.page-hero, .inner-hero, .hero-banner, section.page-header, .svc-hero');
    paintHeroEl(el, url);
  }

  function findBaHost() {
    var host = document.querySelector('[data-before-after], #beforeAfterGallery, .before-after-grid');
    if (host) return host;
    var sections = document.querySelectorAll('section');
    for (var i = 0; i < sections.length; i++) {
      var h = sections[i].querySelector('h2, h3');
      if (!h) continue;
      var t = (h.textContent || '').toLowerCase();
      if (t.indexOf('before') !== -1 && t.indexOf('after') !== -1) {
        var inner = sections[i].querySelector('.before-after-grid, .grid, .gallery, .cards');
        return inner || sections[i];
      }
    }
    return null;
  }

  function baHtml(pairs, serviceName) {
    return pairs.map(function (p) {
      var label = serviceName ? '<p class="ba-svc-name">' + esc(serviceName) + '</p>' : '';
      return '<div class="ba-pair">' + label + '<div class="ba-imgs">' +
        (p.before ? '<div class="ba-shot"><span class="ba-label">Before</span><img src="' + absUrl(p.before) + '" alt="Before ' + esc(serviceName) + '" loading="lazy" width="600" height="400"/></div>' : '') +
        (p.after ? '<div class="ba-shot"><span class="ba-label">After</span><img src="' + absUrl(p.after) + '" alt="After ' + esc(serviceName) + '" loading="lazy" width="600" height="400"/></div>' : '') +
        '</div>' + (p.caption ? '<p class="ba-caption">' + esc(p.caption) + '</p>' : '') + '</div>';
    }).join('');
  }

  function fillBaHost(host, pairs, serviceName) {
    if (!host || !pairs || !pairs.length) return;
    if (host.getAttribute('data-cms-ba') === '1') return;
    var grid = host.classList.contains('before-after-grid') || host.classList.contains('ba-gallery')
      ? host
      : (host.querySelector('.before-after-grid') || host);
    var section = host.closest('section') || host;
    var desc = section.querySelector('.section-desc');
    if (desc && /coming soon/i.test(desc.textContent || '')) {
      desc.textContent = serviceName
        ? ('Real results from our ' + serviceName + ' work.')
        : 'Real results from recent jobs.';
    }
    grid.innerHTML = baHtml(pairs, serviceName);
    grid.classList.add('ba-gallery', 'before-after-grid');
    grid.setAttribute('data-cms-ba', '1');
    host.setAttribute('data-cms-ba', '1');
  }

  function injectBaSection(pairs, serviceName) {
    if (!pairs || !pairs.length) return;
    if (document.querySelector('[data-cms-ba="1"]')) return;
    var anchor = document.querySelector('.svc-hero, .page-hero');
    var parent = anchor && anchor.parentNode;
    if (!parent) return;
    var sec = document.createElement('section');
    sec.className = 'section ba-section';
    sec.innerHTML = '<div class="container"><div class="section-header centered"><p class="section-eyebrow">Results</p><h2 class="section-title">Before & After</h2><p class="section-desc">Real results from our ' + esc(serviceName || 'work') + '.</p></div><div class="before-after-grid ba-gallery" data-cms-ba="1">' + baHtml(pairs, '') + '</div></div>';
    if (anchor.nextSibling) parent.insertBefore(sec, anchor.nextSibling);
    else parent.appendChild(sec);
  }

  function applyServiceMedia(services) {
    if (!services || !services.length) return;
    var path = pathName();
    var svc = null;
    for (var i = 0; i < services.length; i++) {
      if ((services[i].href || '') === path) { svc = services[i]; break; }
    }

    if (svc) {
      if (svc.heroImage) {
        var el = document.querySelector('.svc-hero, .page-hero, .service-hero, .inner-hero, .hero-banner');
        paintHeroEl(el, absUrl(svc.heroImage));
      }
      var pairs = Array.isArray(svc.beforeAfter)
        ? svc.beforeAfter.filter(function (p) { return p && (p.before || p.after); })
        : [];
      if (pairs.length) {
        var host = findBaHost();
        if (host) fillBaHost(host, pairs, svc.name || '');
        else injectBaSection(pairs, svc.name || '');
      }
      return;
    }

    if (/^area-/.test(path) || path === 'areas.html') {
      var host2 = findBaHost();
      if (!host2) return;
      var allHtml = '';
      var any = false;
      services.forEach(function (s) {
        var pr = Array.isArray(s.beforeAfter)
          ? s.beforeAfter.filter(function (p) { return p && (p.before || p.after); })
          : [];
        if (!pr.length) return;
        any = true;
        allHtml += baHtml(pr, s.name || '');
      });
      if (!any) return;
      var grid = host2.classList.contains('before-after-grid') ? host2 : (host2.querySelector('.before-after-grid') || host2);
      var section = host2.closest('section') || host2;
      var desc = section.querySelector('.section-desc');
      if (desc && /coming soon/i.test(desc.textContent || '')) {
        desc.textContent = 'Real job photos from our local work.';
      }
      grid.innerHTML = allHtml;
      grid.classList.add('ba-gallery', 'before-after-grid');
      grid.setAttribute('data-cms-ba', '1');
    }
  }

  function applyPageAssets(pageMedia) {
    var path = pathName();
    var entry = (pageMedia || {})[path] || {};
    if (Array.isArray(entry.images)) {
      var imgs = document.querySelectorAll('img');
      entry.images.forEach(function (url, i) {
        var img = imgs[i];
        if (!img) return;
        if (typeof url === 'string' && url.trim()) img.setAttribute('src', absUrl(url));
        else if (url === '') { img.removeAttribute('src'); img.removeAttribute('srcset'); }
      });
    }
    if (Array.isArray(entry.videos)) {
      var videos = document.querySelectorAll('video');
      entry.videos.forEach(function (url, i) {
        var video = videos[i]; if (!video) return;
        var src = video.querySelector('source');
        if (typeof url === 'string' && url.trim()) {
          if (!src) { src = document.createElement('source'); video.appendChild(src); }
          src.setAttribute('src', absUrl(url));
          src.setAttribute('type', /\\.webm(?:$|\\?)/i.test(url) ? 'video/webm' : 'video/mp4');
          video.style.display = '';
          try { video.load(); } catch (e) {}
        } else {
          if (src) src.removeAttribute('src');
          video.removeAttribute('src');
          video.style.display = 'none';
          try { video.load(); } catch (e) {}
        }
        var posters = entry.videoPosters || [];
        if (posters[i]) video.setAttribute('poster', absUrl(posters[i]));
        else if (Array.isArray(entry.videoPosters)) video.removeAttribute('poster');
      });
    }
  }

  function applySeo(s, m) {
    s = s || {}; m = m || {};
    if (s.title) document.title = s.title;
    if (s.description) setMeta('description', s.description, true);
    if (s.keywords) setMeta('keywords', s.keywords, true);
    if (s.ogTitle) setMeta('og:title', s.ogTitle);
    if (s.ogDescription) setMeta('og:description', s.ogDescription);
    if (s.twitterTitle) setMeta('twitter:title', s.twitterTitle, true);
    if (s.twitterDescription) setMeta('twitter:description', s.twitterDescription, true);
    if (s.canonical) {
      var link = document.querySelector('link[rel="canonical"]');
      if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
      link.href = s.canonical;
    }
    var og = (s.ogImage || m.ogImage || '').trim();
    var full = og ? (og.indexOf('http') === 0 ? og : location.origin + absUrl(og)) : '';
    if (full) {
      setMeta('og:image', full);
      setMeta('twitter:image', full, true);
    } else {
      document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]').forEach(function (node) { node.remove(); });
    }
    var ld = document.querySelectorAll('script[type="application/ld+json"]');
    ld.forEach(function (node) {
      try {
        var json = JSON.parse(node.textContent);
        function updateImage(obj) {
          if (!obj || typeof obj !== 'object') return;
          if (full) obj.image = full;
          else if (obj.image && /favicon\\.svg|logo/i.test(String(obj.image))) delete obj.image;
          Object.keys(obj).forEach(function(k) { if (obj[k] && typeof obj[k] === 'object') updateImage(obj[k]); });
        }
        updateImage(json); node.textContent = JSON.stringify(json);
      } catch (e) {}
    });
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
        img.alt = (b && b.siteName) || 'T.E.G';
        img.decoding = 'async';
        var mark = a.querySelector('.logo-mark');
        var text = a.querySelector('.logo-text');
        img.onload = function () {
          if (mark) mark.style.display = 'none';
          if (text) text.style.display = 'none';
          a.classList.add('has-logo-img');
        };
        img.onerror = function () {
          if (img.parentNode) img.parentNode.removeChild(img);
        };
        a.insertBefore(img, a.firstChild);
      });
    }
    var link = document.querySelector('link[rel="icon"]');
    if (fav) {
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = fav;
    } else if (link) { link.remove(); }
  }

  function applyOg(s, m) {
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
      applyPageAssets(data.pageMedia || {});
      applyPageHero(data.pageMedia || {}, data.media || {});
      applyServiceMedia(data.services || []);
      applyBranding(data.branding || {}, data.media || {});
      applySeo(data.seo || {}, data.media || {});
      applyOg(data.seo || {}, data.media || {});
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
  setTimeout(load, 800);
})();
