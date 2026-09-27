(function () {
  function inject() {
    var sidebar = document.getElementById('adminSidebar');
    var main = document.querySelector('main.main');
    if (!sidebar || !main || document.getElementById('panel-analytics')) return;
    var g = document.createElement('div');
    g.className = 'group';
    g.textContent = 'Analytics';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-panel', 'analytics');
    btn.textContent = 'Traffic & Conversions';
    btn.onclick = function () {
      if (typeof showPanel === 'function') showPanel('analytics');
      loadAnalytics();
    };
    sidebar.appendChild(g);
    sidebar.appendChild(btn);
    var panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = 'panel-analytics';
    panel.innerHTML =
      '<h2>Analytics — Traffic & Conversions</h2>' +
      '<p style="font-size:13px;color:#64748b;margin-bottom:16px">Tracks Call Now, GMB profile, SMS, estimate CTAs, page views on the live site.</p>' +
      '<div class="form-row" style="margin-bottom:16px"><div class="form-group"><label>Range</label>' +
      '<select id="analyticsDays" onchange="loadAnalytics()"><option value="7">Last 7 days</option><option value="30" selected>Last 30 days</option><option value="90">Last 90 days</option></select></div>' +
      '<div class="form-group" style="display:flex;align-items:flex-end"><button type="button" class="btn btn-secondary btn-sm" onclick="loadAnalytics()">Refresh</button></div></div>' +
      '<div id="analyticsKpis" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:20px"></div>' +
      '<div class="section-label">Funnel</div><div id="analyticsFunnel" style="margin-bottom:20px"></div>' +
      '<div class="section-label">Top pages</div><div id="analyticsPages" style="margin-bottom:20px"></div>' +
      '<div class="section-label">Events</div><div id="analyticsEvents" style="margin-bottom:20px"></div>' +
      '<div class="section-label">Recent</div><div id="analyticsRecent" style="max-height:280px;overflow:auto;font-size:12px"></div>';
    main.appendChild(panel);
  }
  window.loadAnalytics = function () {
    var token = sessionStorage.getItem('teg_admin') || '';
    var days = (document.getElementById('analyticsDays') || {}).value || 30;
    fetch('/api/admin/analytics?days=' + days, { headers: { 'x-admin-key': token } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.ok) {
          document.getElementById('analyticsKpis').innerHTML = '<p style="color:#b91c1c">Login required.</p>';
          return;
        }
        renderAnalytics(j.data);
      })
      .catch(function () {
        document.getElementById('analyticsKpis').innerHTML = '<p style="color:#b91c1c">Server error — is Node running?</p>';
      });
  };
  function kpi(label, value, hi) {
    return '<div style="background:#f8fafc;border:1px solid ' + (hi ? '#0ea5e9' : '#e2e8f0') + ';border-radius:12px;padding:14px' + (hi ? ';background:#f0f9ff' : '') + '"><div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase">' + label + '</div><div style="font-size:22px;font-weight:700;color:#0a3d6b;margin-top:4px">' + value + '</div></div>';
  }
  function renderAnalytics(d) {
    document.getElementById('analyticsKpis').innerHTML =
      kpi('Page views', d.pageViews || 0) + kpi('Sessions', d.sessions || 0) +
      kpi('Call Now clicks', d.phoneClicks || 0, true) + kpi('GMB / Maps', d.gmbClicks || 0, true) +
      kpi('SMS', d.smsClicks || 0) + kpi('Estimate CTAs', d.ctaClicks || 0) +
      kpi('Forms', d.formSubmits || 0) + kpi('Conv %', (d.conversionRate || 0) + '%', true);
    document.getElementById('analyticsFunnel').innerHTML =
      '<div class="sub-card"><p>Views ' + (d.pageViews || 0) + ' → CTA ' + (d.ctaClicks || 0) + ' → Call Now ' + (d.phoneClicks || 0) + ' | GMB ' + (d.gmbClicks || 0) + ' | Forms ' + (d.formSubmits || 0) + '</p></div>';
    var pages = d.topPages || [];
    document.getElementById('analyticsPages').innerHTML = pages.length
      ? pages.map(function (p) { return '<div class="sub-card"><h4 style="margin:0">' + p.path + '</h4><p style="margin:4px 0 0">' + p.views + ' views</p></div>'; }).join('')
      : '<p style="color:#94a3b8">No data yet — traffic on live site fills this.</p>';
    var by = d.byEvent || {};
    var keys = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; });
    document.getElementById('analyticsEvents').innerHTML = keys.length
      ? keys.map(function (k) { return '<div class="sub-card" style="display:flex;justify-content:space-between"><span>' + k + '</span><strong>' + by[k] + '</strong></div>'; }).join('')
      : '<p style="color:#94a3b8">No events yet.</p>';
    document.getElementById('analyticsRecent').innerHTML = (d.recent || []).slice(0, 40).map(function (e) {
      return '<div style="padding:6px 0;border-bottom:1px solid #e2e8f0"><strong>' + (e.event || '') + '</strong> · ' + (e.path || '') + ' <span style="color:#94a3b8">' + (e.ts || '') + '</span></div>';
    }).join('') || '<p style="color:#94a3b8">No recent events.</p>';
  }
  var orig = window.showPanel;
  if (typeof orig === 'function') {
    window.showPanel = function (id) { orig(id); if (id === 'analytics') loadAnalytics(); };
  }
  var t = setInterval(function () {
    var dash = document.getElementById('dashboard');
    if (dash && dash.classList.contains('active')) { inject(); clearInterval(t); }
  }, 400);
  setTimeout(inject, 2000);
})();
