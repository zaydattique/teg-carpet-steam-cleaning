/* T.E.G CMS compatibility layer: all site media is assigned and saved through the admin panel. */
(function () {
  'use strict';
  var PAGE_FILES = [
    'index.html','services.html','areas.html','about.html','faq.html','reviews.html','contact.html',
    'service-carpet-cleaning.html','service-tile-grout.html','service-couch-cleaning.html',
    'service-area-rug.html','service-stain-removal.html','service-steam-cleaning.html',
    'service-commercial.html','service-water-damage.html','service-carpet-stretching.html','service-hardwood.html',
    'area-milwaukee.html','area-wauwatosa.html','area-brookfield.html','area-new-berlin.html',
    'area-west-allis.html','area-greenfield.html','area-franklin.html','area-muskego.html',
    'area-pewaukee.html','area-oak-creek.html','area-elm-grove.html','area-hales-corners.html',
    'area-greendale.html'
  ];
  var activeMediaPage = 'index.html';
  var mediaLibrary = [];
  var scanCache = {};
  function el(id) { return document.getElementById(id); }
  function value(id) { var e = el(id); return e ? e.value.trim() : ''; }
  function setValue(id, v) { var e = el(id); if (e) e.value = v == null ? '' : String(v); }
  function fieldValue(id, fallback) { var e=el(id); return e ? e.value.trim() : (fallback == null ? '' : String(fallback)); }
  function esc(v) { return String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function clone(v) { return JSON.parse(JSON.stringify(v || {})); }
  function current() { if (!window.__TEG_ADMIN_DATA) window.__TEG_ADMIN_DATA = {}; return window.__TEG_ADMIN_DATA; }
  function toast(msg, ok) { if (typeof showToast === 'function') showToast(msg, ok); }
  function normalUrl(url) { return String(url || '').trim(); }

  window.fill = function (d) {
    d = d || {};
    window.__TEG_ADMIN_DATA = clone(d);
    var b=d.branding||{}, m=d.media||{}, c=d.contact||{}, s=d.seo||{}, loc=d.location||{};
    setValue('brand-name', b.siteName); setValue('brand-tagline', b.tagline || b.logoText);
    setValue('brand-logo', m.logo || b.logoUrl);
    setValue('contact-phone', c.phone); setValue('contact-phoneTel', c.phoneTel);
    setValue('contact-email', c.email); setValue('contact-street', c.addressLine1 || c.address);
    setValue('contact-city', c.city); setValue('contact-state', c.region); setValue('contact-zip', c.postal);
    setValue('contact-hours', c.hours); setValue('contact-sms', c.sms || c.phoneTel || c.phone);
    setValue('seo-title', s.title); setValue('seo-description', s.description); setValue('seo-keywords', s.keywords);
    setValue('seo-ogTitle', s.ogTitle); setValue('seo-ogDescription', s.ogDescription);
    setValue('seo-ogImage', s.ogImage || m.ogImage); setValue('seo-canonical', s.canonical); setValue('seo-twitterTitle', s.twitterTitle);
    setValue('seo-twitterDescription', s.twitterDescription); setValue('seo-twitterImage', s.twitterImage || s.ogImage || m.ogImage);
    setValue('loc-name', loc.name || b.siteName); setValue('loc-address', loc.address || c.address);
    setValue('loc-city', loc.city || c.city); setValue('loc-region', loc.region || c.region);
    setValue('loc-postal', loc.postal || c.postal); setValue('loc-geoRegion', loc.geoRegion);
    setValue('loc-lat', loc.lat); setValue('loc-lng', loc.lng); setValue('loc-gmb', loc.gmbUrl || loc.mapsUrl);
    window._servicesCache = Array.isArray(d.services) ? clone(d.services) : [];
    if (typeof renderServices === 'function') renderServices(d.services || []);
    if (typeof renderNav === 'function') {
      renderNav('main',(d.nav||{}).main||[]); renderNav('footer',(d.nav||{}).footer||[]); renderNav('services',(d.nav||{}).services||[]);
    }
    window._pagesSeo = d.pages || {};
    if (el('page-key')) setValue('page-key','index.html');
    if (el('page-title')) setValue('page-title', (window._pagesSeo['index.html']||{}).title || '');
    if (el('page-description')) setValue('page-description', (window._pagesSeo['index.html']||{}).description || '');
    renderMediaRoles();
    loadMediaList();
    renderPageMediaEditor();
    if (typeof renderBeforeAfterPanel === 'function') renderBeforeAfterPanel();
  };

  function renderMediaRoles() {
    var box=el('mediaList');
    if (!box) return;
    var d=current(), m=d.media||{}, b=d.branding||{}, s=d.seo||{};
    box.innerHTML =
      '<div class="section-label">Site-wide media assignments</div>' +
      role('logo','Logo','m.logo',m.logo||b.logoUrl,'image') +
      role('favicon','Favicon / app icon','m.favicon',m.favicon||b.faviconUrl,'image') +
      role('heroImage','Homepage hero image fallback','m.heroImage',m.heroImage,'image') +
      role('heroVideo','Homepage hero video','m.heroVideo',m.heroVideo,'video') +
      role('heroPoster','Homepage hero video poster','m.heroPoster',m.heroPoster,'image') +
      role('ogImage','Open Graph / social share image','m.ogImage',s.ogImage||m.ogImage,'image') +
      role('aboutImage','About page image','m.aboutImage',m.aboutImage,'image') +
      '<div class="section-label">Uploaded media library</div><div id="mediaLibraryItems"><p>Loading uploads…</p></div>';
    box.querySelectorAll('[data-role-upload]').forEach(function(input){
      input.addEventListener('change', async function(){
        var file=input.files&&input.files[0]; if(!file)return;
        await uploadAndAssign(file,input.getAttribute('data-role-upload'));
        input.value='';
      });
    });
    box.querySelectorAll('[data-role-url]').forEach(function(input){
      input.addEventListener('change', function(){ assignRole(input.getAttribute('data-role-url'),input.value.trim(),false); });
    });
  }
  function role(key,label,field,url,type) {
    return '<div class="nav-item" style="margin-bottom:12px"><strong>'+esc(label)+'</strong>' +
      '<div class="form-group" style="margin-top:8px"><label>Media URL</label><input data-role-url="'+key+'" value="'+esc(url)+'" placeholder="Upload a file or paste a URL" /></div>' +
      '<div class="upload-box"><label>Upload '+esc(label)+'</label><input type="file" accept="'+(type==='video'?'video/*':'image/*')+'" data-role-upload="'+key+'" /></div>' +
      (url ? (type==='video'?'<video controls style="max-width:100%;max-height:160px" src="'+esc(url)+'"></video>':'<img alt="'+esc(label)+' preview" src="'+esc(url)+'" style="max-width:220px;max-height:110px;object-fit:contain">') : '') +
      '</div>';
  }
  function assignRole(key,url,save) {
    var d=current(); d.media=d.media||{}; d.branding=d.branding||{}; d.seo=d.seo||{};
    if(key==='logo'){d.media.logo=url;d.branding.logoUrl=url;setValue('brand-logo',url);}
    if(key==='favicon'){d.media.favicon=url;d.branding.faviconUrl=url;}
    if(key==='heroImage')d.media.heroImage=url;
    if(key==='heroVideo')d.media.heroVideo=url;
    if(key==='heroPoster')d.media.heroPoster=url;
    if(key==='ogImage'){d.media.ogImage=url;d.seo.ogImage=url;d.seo.twitterImage=url;setValue('seo-ogImage',url);}
    if(key==='aboutImage')d.media.aboutImage=url;
    window.__TEG_ADMIN_DATA=d;
    if(save) window.saveAll();
  }
  async function uploadAndAssign(file,key) {
    if(!window.TEG || !TEG.getKey || !TEG.getKey()){toast('Please log in to upload media.',false);return;}
    try {
      if(typeof showProgress==='function')showProgress(20,'Uploading media…');
      var url=await TEG.uploadFile(file);
      assignRole(key,url,false);
      if(typeof showProgress==='function')showProgress(80,'Saving media assignment…');
      await window.saveAll();
      if(typeof hideProgress==='function')hideProgress();
      toast('Media uploaded and assigned.',true);
      renderMediaRoles(); loadMediaList();
    } catch(e) { if(typeof hideProgress==='function')hideProgress(); toast('Upload failed: '+(e.message||'unknown error'),false); }
  }

  window.loadMediaList = async function() {
    var target=el('mediaLibraryItems');
    if(!target) return;
    try {
      var res=await fetch('/api/admin/media',{headers:{'x-admin-key':sessionStorage.getItem('teg_admin_key')||''}});
      var j=await res.json(); if(!res.ok||!j.ok)throw new Error(j.error||'Media library unavailable');
      mediaLibrary=j.data||[];
      target.innerHTML=mediaLibrary.length?mediaLibrary.map(function(f){
        var preview=f.type==='video'?'<video src="'+esc(f.url)+'" muted controls style="max-width:100%;max-height:90px"></video>':'<img src="'+esc(f.url)+'" alt="" loading="lazy" style="max-width:100%;max-height:90px;object-fit:contain">';
        return '<div class="sub-card" style="display:grid;grid-template-columns:minmax(80px,140px) 1fr;gap:12px;align-items:center"><div>'+preview+'</div><div><strong>'+esc(f.filename)+'</strong><p>'+esc((f.size/1024).toFixed(1))+' KB · '+esc(f.type)+'</p><input readonly value="'+esc(f.url)+'" style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:6px" /><button type="button" class="btn btn-outline btn-sm" data-copy-url="'+esc(f.url)+'">Copy URL</button></div></div>';
      }).join(''):'<p>No uploaded media yet.</p>';
      target.querySelectorAll('[data-copy-url]').forEach(function(b){b.addEventListener('click',function(){var inp=b.parentNode.querySelector('input');if(inp){inp.select();document.execCommand('copy');toast('URL copied.',true);}});});
    } catch(e) { target.innerHTML='<p>Could not load media library.</p>'; }
  };
  window.uploadMediaFiles = async function(input) {
    var files=Array.from(input.files||[]); if(!files.length)return;
    if(!TEG.getKey()){toast('Please log in to upload media.',false);return;}
    var good=0;
    for(var i=0;i<files.length;i++) {
      try { if(typeof showProgress==='function')showProgress(Math.round((i/files.length)*100),'Uploading '+(i+1)+' of '+files.length+'…'); await TEG.uploadFile(files[i]); good++; }
      catch(e){toast('Upload failed for '+files[i].name+': '+(e.message||'error'),false);}
    }
    if(typeof hideProgress==='function')hideProgress();
    input.value=''; await loadMediaList(); toast(good+' file(s) uploaded.',good===files.length);
  };
  window.uploadBrandLogo = async function(input) {
    var f=input.files&&input.files[0]; if(!f)return;
    await uploadAndAssign(f,'logo');
  };

  async function scanPage(file) {
    if(scanCache[file])return scanCache[file];
    try {
      var res=await fetch('/'+file,{cache:'no-store'}); if(!res.ok)throw new Error('HTTP '+res.status);
      var html=await res.text(), doc=new DOMParser().parseFromString(html,'text/html');
      var images=Array.from(doc.querySelectorAll('img')).map(function(img){return {src:img.getAttribute('src')||'',alt:img.getAttribute('alt')||'',title:img.getAttribute('title')||''};});
      var videos=Array.from(doc.querySelectorAll('video')).map(function(v){var s=v.querySelector('source');return {src:(s&&s.getAttribute('src'))||v.getAttribute('src')||'',poster:v.getAttribute('poster')||''};});
      scanCache[file]={images:images,videos:videos}; return scanCache[file];
    } catch(e) { return {images:[],videos:[]}; }
  }
  window.renderPageMediaEditor = async function() {
    var box=el('pageHeroesList'); if(!box)return;
    box.innerHTML='<div class="form-group"><label>Choose page</label><select id="mediaPageSelect">'+PAGE_FILES.map(function(p){return '<option value="'+p+'" '+(p===activeMediaPage?'selected':'')+'>'+p+'</option>';}).join('')+'</select></div><div id="mediaPageSlots"><p>Loading page media…</p></div>';
    el('mediaPageSelect').addEventListener('change',function(){activeMediaPage=this.value;renderPageMediaSlots();});
    var d=current(); d.pageMedia=d.pageMedia||{};
    await Promise.all(PAGE_FILES.map(async function(file){
      var found=await scanPage(file), old=d.pageMedia[file]||{};
      d.pageMedia[file]=Object.assign({},old);
      if(!Array.isArray(old.images))d.pageMedia[file].images=found.images.map(function(i){return i.src;});
      if(!Array.isArray(old.videos))d.pageMedia[file].videos=found.videos.map(function(v){return v.src;});
      if(!Array.isArray(old.videoPosters))d.pageMedia[file].videoPosters=found.videos.map(function(v){return v.poster;});
    }));
    window.__TEG_ADMIN_DATA=d;
    await renderPageMediaSlots();
  };
  async function renderPageMediaSlots() {
    var box=el('mediaPageSlots'); if(!box)return;
    var file=activeMediaPage, found=await scanPage(file), d=current(), pm=d.pageMedia||{}, stored=pm[file]||{};
    var savedImgs=Array.isArray(stored.images)?stored.images:[], savedVideos=Array.isArray(stored.videos)?stored.videos:[];
    var html='<p style="font-size:13px;color:#64748b;margin-bottom:12px">Every image and video element detected on this page is listed below. Upload replacements or edit the URL, then save.</p>';
    html+='<div class="section-label">Page hero / background image</div><div class="nav-item"><label>Hero image URL</label><input data-page-hero value="'+esc(stored.heroImage||'')+'" placeholder="Optional hero/background image URL"><div class="upload-box"><label>Upload hero image</label><input type="file" accept="image/*" data-page-hero-upload></div></div>';
    found.images.forEach(function(img,i){
      var url=(savedImgs[i]&&typeof savedImgs[i]==='string'?savedImgs[i]:(savedImgs[i]&&savedImgs[i].url)||img.src);
      html+='<div class="nav-item"><strong>Image '+(i+1)+'</strong>'+(img.alt?' <span style="color:#64748b;font-size:12px">· '+esc(img.alt)+'</span>':'')+
        '<div class="form-group" style="margin-top:8px"><label>Image URL</label><input data-image-url="'+i+'" value="'+esc(url)+'" placeholder="Upload an image or paste URL"></div>'+
        '<div class="upload-box"><label>Replace image '+(i+1)+'</label><input type="file" accept="image/*" data-image-upload="'+i+'"></div>'+
        (url?'<img src="'+esc(url)+'" alt="" loading="lazy" style="max-width:180px;max-height:90px;object-fit:contain">':'')+'</div>';
    });
    found.videos.forEach(function(v,i){
      var url=savedVideos[i]||v.src;
      html+='<div class="nav-item"><strong>Video '+(i+1)+'</strong><div class="form-group"><label>Video URL</label><input data-video-url="'+i+'" value="'+esc(url)+'" placeholder="Upload a video or paste URL"></div><div class="upload-box"><label>Replace video</label><input type="file" accept="video/*" data-video-upload="'+i+'"></div></div>';
    });
    if(!found.images.length&&!found.videos.length)html+='<p>No image/video elements detected in this page HTML.</p>';
    box.innerHTML=html;
    var heroUpload=box.querySelector('[data-page-hero-upload]');
    if(heroUpload)heroUpload.addEventListener('change',async function(){var f=this.files&&this.files[0];if(!f)return;try{var url=await TEG.uploadFile(f);var d=current();d.pageMedia=d.pageMedia||{};d.pageMedia[file]=d.pageMedia[file]||{};d.pageMedia[file].heroImage=url;window.__TEG_ADMIN_DATA=d;await window.saveAll();renderPageMediaSlots();toast('Hero image assigned.',true);}catch(e){toast('Upload failed: '+e.message,false);}});
    box.querySelectorAll('[data-image-url]').forEach(function(inp){inp.addEventListener('change',function(){saveCurrentPageSlot('images',Number(inp.getAttribute('data-image-url')),inp.value.trim());});});
    box.querySelectorAll('[data-video-url]').forEach(function(inp){inp.addEventListener('change',function(){saveCurrentPageSlot('videos',Number(inp.getAttribute('data-video-url')),inp.value.trim());});});
    box.querySelectorAll('[data-image-upload]').forEach(function(inp){inp.addEventListener('change',async function(){var f=this.files&&this.files[0];if(!f)return;var i=Number(inp.getAttribute('data-image-upload'));try{var url=await TEG.uploadFile(f);saveCurrentPageSlot('images',i,url);await window.saveAll();renderPageMediaSlots();toast('Image uploaded and assigned.',true);}catch(e){toast('Upload failed: '+e.message,false);}});});
    box.querySelectorAll('[data-video-upload]').forEach(function(inp){inp.addEventListener('change',async function(){var f=this.files&&this.files[0];if(!f)return;var i=Number(inp.getAttribute('data-video-upload'));try{var url=await TEG.uploadFile(f);saveCurrentPageSlot('videos',i,url);await window.saveAll();renderPageMediaSlots();toast('Video uploaded and assigned.',true);}catch(e){toast('Upload failed: '+e.message,false);}});});
    var heroInput=box.querySelector('[data-page-hero]');
    if(heroInput)heroInput.addEventListener('change',function(){var d=current();d.pageMedia=d.pageMedia||{};d.pageMedia[file]=d.pageMedia[file]||{};d.pageMedia[file].heroImage=heroInput.value.trim();window.__TEG_ADMIN_DATA=d;});
  }
  function saveCurrentPageSlot(type,index,url) {
    var d=current(); d.pageMedia=d.pageMedia||{}; d.pageMedia[activeMediaPage]=d.pageMedia[activeMediaPage]||{};
    var arr=Array.isArray(d.pageMedia[activeMediaPage][type])?d.pageMedia[activeMediaPage][type].slice():[];
    var found=scanCache[activeMediaPage]||{images:[],videos:[]};
    var len=type==='images'?found.images.length:found.videos.length;
    while(arr.length<len)arr.push('');
    arr[index]=url; d.pageMedia[activeMediaPage][type]=arr; window.__TEG_ADMIN_DATA=d;
  }

  var oldCollect=window.collect;
  window.collect=function(){
    var d=clone(current()), b=d.branding||{}, m=d.media||{}, c=d.contact||{}, s=d.seo||{}, loc=d.location||{};
    d.branding=Object.assign({},b,{siteName:fieldValue('brand-name',b.siteName),tagline:fieldValue('brand-tagline',b.tagline||b.logoText),logoText:fieldValue('brand-tagline',b.logoText),logoUrl:m.logo||b.logoUrl||''});
    d.media=Object.assign({},m,{logo:fieldValue('brand-logo',m.logo),favicon:m.favicon == null ? (b.faviconUrl||'') : m.favicon,ogImage:fieldValue('seo-ogImage',m.ogImage)});
    d.branding.logoUrl=d.media.logo; d.branding.faviconUrl=d.media.favicon;
    d.contact=Object.assign({},c,{phone:fieldValue('contact-phone',c.phone),phoneTel:fieldValue('contact-phoneTel',c.phoneTel),email:fieldValue('contact-email',c.email),addressLine1:fieldValue('contact-street',c.addressLine1),address:[fieldValue('contact-street',c.addressLine1),fieldValue('contact-city',c.city),fieldValue('contact-state',c.region),fieldValue('contact-zip',c.postal)].filter(Boolean).join(', '),city:fieldValue('contact-city',c.city),region:fieldValue('contact-state',c.region),postal:fieldValue('contact-zip',c.postal),hours:fieldValue('contact-hours',c.hours),sms:fieldValue('contact-sms',c.sms)});
    d.seo=Object.assign({},s,{title:fieldValue('seo-title',s.title),description:fieldValue('seo-description',s.description),keywords:fieldValue('seo-keywords',s.keywords),ogTitle:fieldValue('seo-ogTitle',s.ogTitle),ogDescription:fieldValue('seo-ogDescription',s.ogDescription),ogImage:fieldValue('seo-ogImage',m.ogImage),canonical:fieldValue('seo-canonical',s.canonical),twitterTitle:fieldValue('seo-twitterTitle',s.twitterTitle),twitterDescription:fieldValue('seo-twitterDescription',s.twitterDescription),twitterImage:fieldValue('seo-twitterImage',s.twitterImage||m.ogImage)});
    d.location=Object.assign({},loc,{name:fieldValue('loc-name',loc.name),address:fieldValue('loc-address',d.contact.address),city:fieldValue('loc-city',d.contact.city),region:fieldValue('loc-region',d.contact.region),postal:fieldValue('loc-postal',d.contact.postal),geoRegion:fieldValue('loc-geoRegion',loc.geoRegion),lat:fieldValue('loc-lat',loc.lat),lng:fieldValue('loc-lng',loc.lng),gmbUrl:fieldValue('loc-gmb',loc.gmbUrl)});
    if(el('servicesList')&&typeof collectServices==='function')d.services=collectServices();
    if(typeof collectNav==='function')d.nav={main:collectNav('main'),footer:collectNav('footer'),services:collectNav('services')};
    d.pages=window._pagesSeo||d.pages||{};
    if(el('page-key')){var key=value('page-key');if(key){d.pages=d.pages||{};d.pages[key]=Object.assign({},d.pages[key]||{},{title:value('page-title'),description:value('page-description')});}}
    return d;
  };
  window.saveAll=async function(){
    var d=window.collect(); window.__TEG_ADMIN_DATA=d;
    if(!window.TEG||!TEG.getKey||!TEG.getKey()){toast('Login required. Please sign in again.',false);return false;}
    try {
      if(typeof showProgress==='function')showProgress(45,'Saving changes…');
      await TEG.saveContentServer(d);
      var verify=await TEG.loadContentServer();
      if(!verify||!verify.media||!verify.branding)throw new Error('Save verification failed');
      window.__TEG_ADMIN_DATA=verify;
      if(typeof hideProgress==='function')hideProgress();
      toast('Saved to server ✓',true);
      return true;
    } catch(e){if(typeof hideProgress==='function')hideProgress();toast('Save failed: '+(e.message||'server error'),false);return false;}
  };
  window.showPanel=(function(old){return function(id){if(old)old(id);if(id==='media'){renderMediaRoles();loadMediaList();}if(id==='pageheroes')renderPageMediaEditor();if(id==='beforeafter'&&typeof renderBeforeAfterPanel==='function')renderBeforeAfterPanel();};})(window.showPanel);
  window.loadPageSeo=function(){
    var key=value('page-key')||'index.html', p=(window._pagesSeo||{})[key]||{};
    setValue('page-title',p.title);setValue('page-description',p.description);
  };
  window.savePageSeo=async function(){
    var key=value('page-key')||'index.html';window._pagesSeo=window._pagesSeo||{};
    window._pagesSeo[key]={title:value('page-title'),description:value('page-description')};
    return window.saveAll();
  };
  window.exportJSON=function(){
    var d=window.collect(), blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='teg-content.json';a.click();URL.revokeObjectURL(a.href);
  };
  document.addEventListener('DOMContentLoaded',function(){
    var note=document.getElementById('connStatus');if(note)note.remove();
    document.querySelectorAll('.unknown-banner,.guidance-banner,.admin-guidance,.help-banner').forEach(function(n){n.remove();});
  });
})();