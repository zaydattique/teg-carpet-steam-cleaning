/** TEG admin API client — no secrets in this file; password only typed by user */
(function () {
  var API = '';
  window.TEG = window.TEG || {};

  TEG.getKey = function () {
    return sessionStorage.getItem('teg_admin_key') || '';
  };

  TEG.api = async function (path, opts) {
    opts = opts || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    if (TEG.getKey()) headers['x-admin-key'] = TEG.getKey();
    var res = await fetch(API + path, Object.assign({}, opts, { headers: headers }));
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
    return data;
  };

  TEG.loginServer = async function (password) {
    if (!password) return false;
    var data = await TEG.api('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password: password })
    });
    if (data.ok && data.token) {
      sessionStorage.setItem('teg_admin_key', data.token);
      return true;
    }
    return false;
  };

  TEG.loadContentServer = async function () {
    var data = await TEG.api('/api/admin/content');
    return data.data;
  };

  TEG.saveContentServer = async function (content) {
    return TEG.api('/api/admin/content', {
      method: 'PUT',
      body: JSON.stringify(content)
    });
  };

  TEG.loadSubmissions = async function () {
    var data = await TEG.api('/api/admin/submissions');
    return data.data || [];
  };

  TEG.uploadFile = async function (file) {
    var fd = new FormData();
    fd.append('file', file);
    var res = await fetch(API + '/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-key': TEG.getKey() },
      body: fd
    });
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  };
})();
