/* T.E.G admin UI cleanup + rich quote inbox */
(function () {
  function hideBanners() {
    var st = document.getElementById('connStatus');
    if (st) { st.style.display = 'none'; st.textContent = ''; }
    document.querySelectorAll('.panel .note, .panel > .desc').forEach(function (el) {
      el.remove();
    });
  }
  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  window.loadInbox = async function () {
    var box = document.getElementById('inboxList');
    if (!box) return;
    if (typeof serverMode !== 'undefined' && !serverMode) {
      box.innerHTML = '<p class="desc">Server mode required</p>';
      return;
    }
    try {
      var items = await TEG.loadSubmissions();
      if (!items || !items.length) {
        box.innerHTML = '<p class="desc">No submissions yet</p>';
        return;
      }
      box.innerHTML = items.map(function (s) {
        var when = '';
        if (s.createdAt) {
          try {
            when = new Date(s.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
          } catch (e) { when = String(s.createdAt); }
        }
        return '<div class="sub-card">' +
          '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px">' +
            '<h4 style="margin:0">' + esc(s.name || 'Lead') + '</h4>' +
            (when ? '<span style="font-size:12px;color:#64748b">' + esc(when) + '</span>' : '') +
          '</div>' +
          (s.service ? '<p style="margin:0 0 4px"><strong>Service:</strong> ' + esc(s.service) + '</p>' : '') +
          (s.phone ? '<p style="margin:0 0 4px"><strong>Phone:</strong> <a href="tel:' + esc(s.phone) + '">' + esc(s.phone) + '</a></p>' : '') +
          (s.email ? '<p style="margin:0 0 4px"><strong>Email:</strong> <a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a></p>' : '') +
          (s.message ? '<p style="margin:8px 0 0"><strong>Message:</strong> ' + esc(s.message) + '</p>' : '') +
          (s.read ? '<p style="margin:6px 0 0;font-size:11px;color:#94a3b8">Read</p>' : '<p style="margin:6px 0 0;font-size:11px;color:#0ea5e9">New</p>') +
        '</div>';
      }).join('');
    } catch (e) {
      box.innerHTML = '<p class="desc">Could not load inbox</p>';
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hideBanners);
  else hideBanners();
  setTimeout(hideBanners, 400);
})();
