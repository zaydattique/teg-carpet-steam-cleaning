/**
 * T.E.G site analytics — tracks page views, Call Now, GMB, SMS, estimate CTAs, forms
 */
(function () {
  var API = (window.location.port === '3000' || window.TEG_API) ? (window.TEG_API || '') : '';
  var SESSION_KEY = 'teg_sid';
  var sid = null;
  try {
    sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(SESSION_KEY, sid);
    }
  } catch (e) {
    sid = 'anon';
  }

  function track(event, props) {
    var payload = {
      event: event,
      props: props || {},
      path: location.pathname,
      title: document.title || '',
      referrer: (function(){try{return document.referrer ? new URL(document.referrer).origin : '';}catch(e){return '';}})(),
      sid: sid,
      ts: new Date().toISOString(),
      ua: (navigator.userAgent || '').slice(0, 180),
      screen: (screen.width || 0) + 'x' + (screen.height || 0),
      lang: navigator.language || ''
    };
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API + '/api/analytics/event', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      } else {
        fetch(API + '/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(function () {});
      }
    } catch (e) {}
    if (window.gtag) {
      try { window.gtag('event', event, props || {}); } catch (e2) {}
    }
  }

  window.TEG_TRACK = track;
  track('page_view', { path: location.pathname });

  var engaged = 0;
  setInterval(function () {
    if (document.visibilityState === 'visible') {
      engaged += 30;
      if (engaged === 30 || engaged % 60 === 0) track('engagement_tick', { seconds: engaged });
    }
  }, 30000);

  var depths = { 25: false, 50: false, 75: false, 100: false };
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var p = Math.round((window.scrollY / h) * 100);
    [25, 50, 75, 100].forEach(function (d) {
      if (p >= d && !depths[d]) {
        depths[d] = true;
        track('scroll_depth', { percent: d });
      }
    });
  }, { passive: true });

  function bindClicks() {
    document.querySelectorAll('a[href^="tel:"], a.phone-link, a.phone-shake').forEach(function (a) {
      if (a.dataset.tegTrack) return;
      a.dataset.tegTrack = '1';
      a.addEventListener('click', function () {
        track('phone_click', { href: a.getAttribute('href') || '', text: (a.textContent || '').trim().slice(0, 40) });
      });
    });
    document.querySelectorAll('a[href^="sms:"], a.sms-float').forEach(function (a) {
      if (a.dataset.tegTrack) return;
      a.dataset.tegTrack = '1';
      a.addEventListener('click', function () {
        track('sms_click', { href: a.getAttribute('href') || '' });
      });
    });
    document.querySelectorAll('a[href*="g.page"], a[href*="google.com/maps"], a.teg-review, a.teg-maps, a.teg-gmb-link').forEach(function (a) {
      if (a.dataset.tegTrack) return;
      a.dataset.tegTrack = '1';
      a.addEventListener('click', function () {
        var href = a.getAttribute('href') || '';
        var kind = /review/i.test(href) ? 'gmb_review_click' : (/g\.page|maps/i.test(href) ? 'gmb_click' : 'maps_click');
        track(kind, { href: href.slice(0, 200), text: (a.textContent || '').trim().slice(0, 40) });
      });
    });
    document.querySelectorAll('a[href*="contact"], a.btn').forEach(function (a) {
      var t = (a.textContent || '').toLowerCase();
      if (!/estimate|quote|contact|book|schedule/i.test(t) && !(a.getAttribute('href') || '').includes('contact')) return;
      if (a.dataset.tegTrackCta) return;
      a.dataset.tegTrackCta = '1';
      a.addEventListener('click', function () {
        track('cta_click', { text: (a.textContent || '').trim().slice(0, 50), href: a.getAttribute('href') || '' });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindClicks);
  else bindClicks();
  setTimeout(bindClicks, 800);
  setTimeout(bindClicks, 2000);

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || !f.id) return;
    if (f.id === 'quoteForm' || /contact|quote|estimate/i.test(f.id)) {
      track('form_attempt', { form: f.id || 'form' });
    }
  }, true);
})();
