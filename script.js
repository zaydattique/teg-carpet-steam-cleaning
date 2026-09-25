// Load CMS config applicator (panel uploads / SEO / NAP / logo override HTML defaults when set)
(function loadSiteConfig() {
  if (window.TEG_SITE) return;
  var s = document.createElement('script');
  s.src = 'site-config.js';
  s.async = false;
  document.head.appendChild(s);
})();

// Hero video: no poster image — dark bg until video is ready, then fade in + play
(function initHeroVideo() {
  var hv = document.getElementById('heroVideo') || document.querySelector('video.hero-video');
  if (!hv) return;
  hv.removeAttribute('poster');

  function markReady() {
    hv.classList.add('is-ready');
    var p = hv.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  if (hv.readyState >= 2) {
    markReady();
  } else {
    hv.addEventListener('loadeddata', markReady, { once: true });
    hv.addEventListener('canplay', markReady, { once: true });
    hv.addEventListener('playing', markReady, { once: true });
  }
  function unlock() {
    hv.muted = true;
    markReady();
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('click', unlock);
  }
  document.addEventListener('touchstart', unlock, { once: true, passive: true });
  document.addEventListener('click', unlock, { once: true });
})();

// Header scroll
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
  if (document.body.classList.contains('page-inner')) {
    header.classList.add('scrolled');
  }
}

// Mobile menu — ONE close control (header hamburger becomes X)
if (menuToggle && nav) {
  function setMenuState(open) {
    nav.classList.toggle('open', open);
    menuToggle.classList.toggle('active', open);
    menuToggle.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      var first = nav.querySelector('a');
      if (first) try { first.focus(); } catch (e) {}
    }
  }

  function closeMenu() { setMenuState(false); }
  function openMenu() { setMenuState(true); }

  // Remove leftover double-X from older deploys
  nav.querySelectorAll('.nav-close').forEach(function (el) { el.remove(); });

  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-controls', 'nav');

  menuToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (nav.classList.contains('open')) closeMenu();
    else openMenu();
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { closeMenu(); });
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const API_BASE = window.location.port === '3000' || window.TEG_API
  ? (window.TEG_API || '')
  : '';

const form = document.getElementById('quoteForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var name = (form.querySelector('#name') || {}).value || '';
    var phone = (form.querySelector('#phone') || {}).value || '';
    var email = (form.querySelector('#email') || {}).value || '';
    var service = (form.querySelector('#service') || {}).value || '';
    var message = (form.querySelector('#message') || {}).value || '';
    var btn = form.querySelector('button[type="submit"]');
    var original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      var res = await fetch(API_BASE + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, phone: phone, email: email, service: service, message: message })
      });
      var data = await res.json().catch(function () { return {}; });
      if (res.ok && data.ok) {
        btn.textContent = 'Request Received ✓';
        form.reset();
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
        }, 3500);
        return;
      }
      throw new Error(data.error || 'Server error');
    } catch (err) {
      var subject = encodeURIComponent('Quote Request — T.E.G Carpet Cleaning');
      var body = encodeURIComponent(
        'Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + email +
        '\nService: ' + service + '\n\nDetails:\n' + message
      );
      window.location.href = 'mailto:contact@teg-carpetsteamcleaning.com?subject=' + subject + '&body=' + body;
      btn.textContent = 'Opening email…';
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 2500);
    }
  });
}

var scrollObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.anim-on-scroll').forEach(function (el) {
  scrollObserver.observe(el);
});

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var id = this.getAttribute('href');
    if (id.length > 1) {
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }
  });
});

function startPhoneShake() {
  var phones = document.querySelectorAll('.phone-link, .phone-shake');
  if (!phones.length) return;
  setInterval(function () {
    phones.forEach(function (el) {
      el.classList.add('is-shaking');
      setTimeout(function () { el.classList.remove('is-shaking'); }, 900);
    });
  }, 6000);
}
startPhoneShake();

(function ensureSmsFloat() {
  function run() {
    document.querySelectorAll('a.whatsapp-float, a[href*="wa.me"]').forEach(function (el) {
      if (el.closest && el.closest('.contact-item')) return;
      if (el.classList && el.classList.contains('whatsapp-float')) el.remove();
    });
    var existing = document.querySelector('a.sms-float');
    var html = '<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h10v2H7V9zm0-3h10v2H7V6zm0 6h7v2H7v-2z"/></svg>';
    if (!existing) {
      var a = document.createElement('a');
      a.href = 'sms:+14147753705';
      a.className = 'sms-float';
      a.setAttribute('rel', 'noopener');
      a.setAttribute('aria-label', 'Text us');
      a.innerHTML = html;
      document.body.appendChild(a);
    } else {
      existing.href = 'sms:+14147753705';
      existing.className = 'sms-float';
      existing.setAttribute('aria-label', 'Text us');
      existing.removeAttribute('target');
      if (!existing.querySelector('svg')) existing.innerHTML = html;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
