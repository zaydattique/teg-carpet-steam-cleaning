// Load CMS config applicator
(function loadSiteConfig() {
  if (window.TEG_SITE) return;
  var s = document.createElement('script');
  s.src = 'site-config.js';
  s.async = false;
  document.head.appendChild(s);
})();

// Analytics tracker (Call Now, GMB, CTAs, page views)
(function loadAnalytics() {
  var s = document.createElement('script');
  s.src = 'analytics-tracker.js';
  s.async = true;
  document.head.appendChild(s);
})();

// Hero video
(function initHeroVideo() {
  var hv = document.getElementById('heroVideo') || document.querySelector('video.hero-video');
  if (!hv) return;
  hv.removeAttribute('poster');
  function markReady() {
    hv.classList.add('is-ready');
    if (hv.parentElement) hv.parentElement.classList.add('video-ready');
    var p = hv.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }
  if (hv.readyState >= 2) markReady();
  else {
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

const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (header) {
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
  if (document.body.classList.contains('page-inner')) header.classList.add('scrolled');
}

if (menuToggle && nav) {
  function setMenuState(open) {
    nav.classList.toggle('open', open);
    menuToggle.classList.toggle('active', open);
    menuToggle.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeMenu() { setMenuState(false); }
  function openMenu() { setMenuState(true); }
  menuToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (nav.classList.contains('open')) closeMenu();
    else openMenu();
  });
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { closeMenu(); });
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}

var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

var API_BASE = window.location.port === '3000' || window.TEG_API ? (window.TEG_API || '') : '';

function bindEstimateForm(form) {
  if (!form || form.getAttribute('data-teg-bound') === '1') return;
  form.setAttribute('data-teg-bound', '1');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var name = (form.querySelector('[name="name"], #name') || {}).value || '';
    var phone = (form.querySelector('[name="phone"], #phone') || {}).value || '';
    var email = (form.querySelector('[name="email"], #email') || {}).value || '';
    var service = (form.querySelector('[name="service"], #service') || {}).value || '';
    var message = (form.querySelector('[name="message"], #message') || {}).value || '';
    var btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    var original = btn.textContent;
    var feedback = form.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('p');
      feedback.className = 'form-feedback';
      feedback.setAttribute('role', 'status');
      feedback.style.marginTop = '12px';
      feedback.style.fontWeight = '600';
      btn.parentNode.insertBefore(feedback, btn.nextSibling);
    }
    feedback.textContent = '';
    feedback.style.color = '';
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
        if (window.TEG_TRACK) window.TEG_TRACK('form_submit', { form: form.id || 'estimate', ok: true });
        btn.textContent = 'Request Received';
        feedback.style.color = '#0a7a3e';
        feedback.textContent = 'Thanks! We received your request and will get back to you soon.';
        form.reset();
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
          feedback.textContent = '';
        }, 4500);
        return;
      }
      throw new Error(data.error || 'Server error');
    } catch (err) {
      feedback.style.color = '#b45309';
      feedback.textContent = 'Could not reach the server. Opening your email app as a backup…';
      var subject = encodeURIComponent('Quote Request - T.E.G Carpet Cleaning');
      var body = encodeURIComponent('Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + email + '\nService: ' + service + '\n\nDetails:\n' + message);
      var cmsEmail = (window.__TEG_BUSINESS && window.__TEG_BUSINESS.email) || (window.__TEG_CONTENT && window.__TEG_CONTENT.contact && window.__TEG_CONTENT.contact.email) || '';
      if (cmsEmail) window.location.href = 'mailto:' + encodeURIComponent(cmsEmail) + '?subject=' + subject + '&body=' + body;
      else feedback.textContent = 'Could not reach the server and no business email is configured.';
      btn.textContent = 'Opening email…';
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 2500);
    }
  });
}

['quoteForm', 'homeContactForm'].forEach(function (id) {
  var f = document.getElementById(id);
  if (f) bindEstimateForm(f);
});
document.querySelectorAll('form.contact-form').forEach(function (f) {
  bindEstimateForm(f);
});

var scrollObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.anim-on-scroll').forEach(function (el) { scrollObserver.observe(el); });

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

(function ensureMobileActionBar() {
  function run() {
    if (document.getElementById('teg-mobile-actions')) return;
    if (!document.body || !window.matchMedia('(max-width: 767px)').matches) return;
    var business = window.__TEG_BUSINESS || {};
    var bar = document.createElement('div');
    bar.id = 'teg-mobile-actions';
    bar.className = 'teg-mobile-actions';
    var tel = business.tel || '';
    var sms = business.sms || tel;
    bar.innerHTML =
      '<a href="tel:' + tel + '" class="teg-mobile-action teg-mobile-call" aria-label="Call T.E.G now">Call</a>' +
      '<a href="sms:' + sms + '" class="teg-mobile-action teg-mobile-text" aria-label="Text T.E.G now">Text</a>' +
      '<a href="contact.html#quoteForm" class="teg-mobile-action teg-mobile-estimate">Free Estimate</a>';
    document.body.appendChild(bar);
    document.body.classList.add('has-mobile-actions');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

(function ensureSmsFloat() {
  function run() {
    document.querySelectorAll('a.whatsapp-float').forEach(function (el) { el.remove(); });
    var existing = document.querySelector('a.sms-float');
    var html = '<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h10v2H7V9zm0-3h10v2H7V6zm0 6h7v2H7v-2z"/></svg>';
    if (!existing) {
      var a = document.createElement('a');
      a.href = 'sms:' + ((window.__TEG_BUSINESS && window.__TEG_BUSINESS.tel) || '');
      a.className = 'sms-float';
      a.setAttribute('aria-label', 'Text us');
      a.innerHTML = html;
      document.body.appendChild(a);
    } else {
      existing.href = 'sms:' + ((window.__TEG_BUSINESS && window.__TEG_BUSINESS.tel) || '');
      existing.className = 'sms-float';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

(function markActiveNav() {
  try {
    var path = (location.pathname || '/').split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a[href]').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      if (href === path || (path === 'index.html' && (href === 'index.html' || href === ''))) a.classList.add('active');
    });
  } catch (e) {}
})();
