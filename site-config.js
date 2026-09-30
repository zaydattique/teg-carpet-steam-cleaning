/**
 * T.E.G — UI + LocalBusiness schema + AEO/GMB CTAs
 * AEO_ENABLED = true — AI/GMB optimization active
 */
(function () {
  var AEO_ENABLED = true;

  if (!document.querySelector('meta[name="google-site-verification"]')) {
    var gv = document.createElement('meta');
    gv.setAttribute('name', 'google-site-verification');
    gv.setAttribute('content', 'O74SPC3MeJdRX26ydxXIWdr2OF2C8dgGeWqJ4xRKJGU');
    (document.head || document.documentElement).appendChild(gv);
  }

  var GMB = 'https://g.page/teg-carpet-steam-cleaning';
  var GMB_REVIEW = 'https://g.page/teg-carpet-steam-cleaning/review';
  var MAP_EMBED = 'https://www.google.com/maps?q=TEG+Carpet+%26+Furniture+Steam+Cleaning,+4111+N+Port+Washington+Rd+suite+1,+Milwaukee,+WI+53217&hl=en&z=16&output=embed';
  var MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=TEG+Carpet+%26+Furniture+Steam+Cleaning+4111+N+Port+Washington+Rd+Milwaukee+WI';

  if (!document.getElementById('teg-ui-css')) {
    var st = document.createElement('style');
    st.id = 'teg-ui-css';
    st.textContent = ['.whatsapp-float{display:none!important}','.sms-float{position:fixed;bottom:28px;right:28px;z-index:999;width:60px;height:60px;background:#0ea5e9;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(14,165,233,.45)}','.sms-float svg{width:28px;height:28px}','.footer .logo-mark,.footer-brand .logo-mark{color:#38bdf8!important}','.footer .logo-text,.footer-brand .logo-text{color:#ffffff!important}','.footer-brand p,.footer-links a,.footer-contact a,.footer-contact p{color:rgba(255,255,255,.85)!important}','.footer-links h4,.footer-contact h4{color:#fff!important}','.footer-bottom p,.footer-bottom .support{color:rgba(255,255,255,.55)!important}','.page-inner .header .logo-text{color:#0a3d6b!important}','.page-inner .header .logo-mark{color:#0ea5e9!important}','@media (min-width:769px){','.header .container{padding-left:28px!important;padding-right:28px!important;max-width:100%!important}','.header-inner{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;width:100%!important;flex-wrap:nowrap!important}','.header .nav{display:flex!important;flex:1 1 auto!important;flex-wrap:nowrap!important;justify-content:center!important;align-items:center!important;gap:clamp(8px,1.2vw,18px)!important;min-width:0!important}','.header .nav > a{white-space:nowrap!important;font-size:clamp(12px,1.15vw,14px)!important}','.header-actions{display:flex!important;align-items:center!important;gap:10px!important;border:none!important;flex:0 0 auto!important}','}','.header-actions .phone-link{display:inline-flex!important;padding:7px 14px!important;border-radius:10px!important;border:2px solid #0ea5e9!important;background:transparent!important;color:#0ea5e9!important;font-weight:600!important;white-space:nowrap!important}','body:not(.page-inner) .header:not(.scrolled) .header-actions .phone-link{border-color:rgba(255,255,255,.75)!important;color:#fff!important}','a.btn.phone-shake,a.btn[href^="tel:"]{background:transparent!important;border:2px solid #0ea5e9!important;color:#0ea5e9!important;box-shadow:none!important}','.cta-banner a.btn.phone-shake,.hero a.btn.phone-shake{border-color:rgba(255,255,255,.85)!important;color:#fff!important;background:transparent!important}','.page-hero a.btn.phone-shake,.hero-ctas a.btn.phone-shake{background:transparent!important;border:2px solid #0ea5e9!important;color:#0ea5e9!important}','.teg-gmb-bar{position:relative;background:#071a2e;color:#fff;padding:36px 20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,.08)}','.teg-gmb-bar p{margin:0 0 20px;font-size:16px;line-height:1.5;max-width:520px;margin-left:auto;margin-right:auto}','.teg-gmb-bar .teg-gmb-actions{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}','.teg-gmb-bar a{display:inline-flex;padding:13px 22px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;min-width:200px;justify-content:center}','.teg-gmb-bar a.teg-review{border:2px solid #4285F4;color:#4285F4;background:transparent}','.teg-gmb-bar a.teg-maps{background:#0ea5e9;color:#fff}','.teg-footer-map{margin:0 0 28px;padding:0 0 24px;border-bottom:1px solid rgba(255,255,255,.1)}','.teg-footer-map-inner{background:linear-gradient(145deg,rgba(14,165,233,.12),rgba(7,26,46,.9));border:1px solid rgba(125,211,252,.25);border-radius:16px;overflow:hidden}','.teg-footer-map-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;background:rgba(10,61,107,.55)}','.teg-footer-map-head h4{margin:0;color:#fff;font-size:15px;font-weight:700}','.teg-footer-map-head a{color:#7dd3fc;font-size:13px;font-weight:600;text-decoration:none}','.teg-footer-map iframe{display:block;width:100%;height:220px;border:0}','.teg-footer-map-addr{padding:12px 18px 16px;color:rgba(255,255,255,.88);font-size:13px;line-height:1.55}','.teg-footer-map-addr strong{display:block;color:#fff;font-size:14px;margin-bottom:4px}','.page-inner .anim-on-scroll{opacity:1!important;transform:none!important}','.teg-contact-map-box{margin-top:28px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden}','.teg-contact-map-box .teg-map-top{display:grid;grid-template-columns:1fr 1.2fr}','.teg-contact-map-box .teg-map-info{padding:28px 26px;background:linear-gradient(160deg,#0a3d6b,#0c4a7a);color:#fff}','.teg-contact-map-box .teg-map-info h2{margin:0 0 8px;font-size:22px;color:#fff}','.teg-contact-map-box .teg-addr-line{margin-bottom:12px;font-size:14px;line-height:1.5}','.teg-contact-map-box .teg-addr-line a{color:#7dd3fc;font-weight:600}','.teg-contact-map-box iframe{display:block;width:100%;min-height:280px;border:0}','.teg-contact-map-box .teg-map-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}','.teg-contact-map-box .teg-map-actions a.primary{background:#0ea5e9;color:#fff;padding:10px 16px;border-radius:10px;font-weight:700;text-decoration:none}','.teg-contact-map-box .teg-map-actions a.ghost{border:2px solid rgba(255,255,255,.35);color:#fff;padding:10px 16px;border-radius:10px;font-weight:700;text-decoration:none}','@media (max-width:900px){.teg-contact-map-box .teg-map-top{grid-template-columns:1fr}}','.ba-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:28px}','.ba-pair{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}','.ba-pair .ba-imgs{display:grid;grid-template-columns:1fr 1fr}','.ba-pair img{width:100%;height:160px;object-fit:cover;display:block}','.ba-pair .ba-label{font-size:11px;font-weight:700;text-transform:uppercase;padding:6px 10px;background:#0a3d6b;color:#fff}'].join('');
    (document.head || document.documentElement).appendChild(st);
  }

  if (!document.getElementById('teg-schema-ld')) {
    var schema = {
      '@context': 'https://schema.org',
      '@graph': [{
        '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
        '@id': 'https://tegcarpetfurniturecleaning.com/#business',
        'name': 'T.E.G Carpet & Furniture Steam Cleaning',
        'alternateName': ['TEG Carpet Steam Cleaning', 'T.E.G Carpet Steam Cleaning'],
        'description': 'Professional carpet cleaning, steam cleaning, tile and grout, upholstery, area rugs, pet odor and stain removal, commercial carpet cleaning, water damage restoration, carpet stretching, and hardwood floor cleaning in Milwaukee, WI and western suburbs. Upfront pricing, kid and pet safe, licensed and insured, available 24/7.',
        'url': 'https://tegcarpetfurniturecleaning.com/',
        'telephone': '+1-414-775-3705',
        'email': 'contact@teg-carpetsteamcleaning.com',
        'image': 'https://tegcarpetfurniturecleaning.com/favicon.svg',
        'priceRange': '$$',
        'address': { '@type': 'PostalAddress', 'streetAddress': '4111 N Port Washington Rd suite 1', 'addressLocality': 'Milwaukee', 'addressRegion': 'WI', 'postalCode': '53217', 'addressCountry': 'US' },
        'geo': { '@type': 'GeoCoordinates', 'latitude': 43.0895, 'longitude': -87.8910 },
        'openingHoursSpecification': { '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], 'opens': '00:00', 'closes': '23:59' },
        'knowsAbout': ['carpet cleaning','steam cleaning','tile and grout cleaning','upholstery cleaning','area rug cleaning','pet odor removal','stain removal','commercial carpet cleaning','hot water extraction','water damage restoration','carpet stretching','hardwood floor cleaning'],
        'areaServed': ['Milwaukee, WI', 'Wauwatosa, WI', 'Brookfield, WI', 'New Berlin, WI', 'West Allis, WI', 'Greenfield, WI', 'Franklin, WI', 'Muskego, WI', 'Pewaukee, WI', 'Oak Creek, WI', 'Elm Grove, WI', 'Hales Corners, WI', 'Greendale, WI'],
        'sameAs': ['https://g.page/teg-carpet-steam-cleaning'],
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Cleaning services',
          'itemListElement': [
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Carpet Cleaning','url':'https://tegcarpetfurniturecleaning.com/service-carpet-cleaning.html'}},
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Tile and Grout Cleaning','url':'https://tegcarpetfurniturecleaning.com/service-tile-grout.html'}},
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Upholstery Cleaning','url':'https://tegcarpetfurniturecleaning.com/service-couch-cleaning.html'}},
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Area Rug Cleaning','url':'https://tegcarpetfurniturecleaning.com/service-area-rug.html'}},
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Pet Odor and Stain Removal','url':'https://tegcarpetfurniturecleaning.com/service-stain-removal.html'}},
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Steam Cleaning','url':'https://tegcarpetfurniturecleaning.com/service-steam-cleaning.html'}},
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Commercial Carpet Cleaning','url':'https://tegcarpetfurniturecleaning.com/service-commercial.html'}},
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Water Damage Restoration','url':'https://tegcarpetfurniturecleaning.com/service-water-damage.html'}},
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Carpet Stretching and Repair','url':'https://tegcarpetfurniturecleaning.com/service-carpet-stretching.html'}},
            {'@type':'Offer','itemOffered':{'@type':'Service','name':'Hardwood Floor Cleaning','url':'https://tegcarpetfurniturecleaning.com/service-hardwood.html'}}
          ]
        }
      }, {
        '@type': 'WebSite',
        '@id': 'https://tegcarpetfurniturecleaning.com/#website',
        'url': 'https://tegcarpetfurniturecleaning.com/',
        'name': 'T.E.G Carpet & Furniture Steam Cleaning',
        'publisher': { '@id': 'https://tegcarpetfurniturecleaning.com/#business' }
      }]
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'teg-schema-ld';
    s.textContent = JSON.stringify(schema);
    (document.head || document.documentElement).appendChild(s);
  }

  function injectFooterMap() {
    var footer = document.querySelector('footer.footer .container');
    if (!footer || document.getElementById('teg-footer-map')) return;
    var box = document.createElement('div');
    box.id = 'teg-footer-map';
    box.className = 'teg-footer-map';
    box.innerHTML = '<div class="teg-footer-map-inner"><div class="teg-footer-map-head"><h4>Find us on the map</h4><a href="' + MAP_LINK + '" target="_blank" rel="noopener">Open in Google Maps</a></div><iframe title="T.E.G location map" width="600" height="220" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' + MAP_EMBED + '" allowfullscreen></iframe><div class="teg-footer-map-addr"><strong>T.E.G Carpet & Furniture Steam Cleaning</strong>4111 N Port Washington Rd suite 1<br>Milwaukee, WI 53217</div></div>';
    var grid = footer.querySelector('.footer-grid');
    if (grid) footer.insertBefore(box, grid); else footer.appendChild(box);
  }

  function injectContactMapBox() {
    if (!/contact/i.test(location.pathname)) return;
    if (document.getElementById('teg-contact-map-box')) return;
    var section = document.querySelector('section.contact .container') || document.querySelector('main .container');
    if (!section) return;
    var box = document.createElement('div');
    box.id = 'teg-contact-map-box';
    box.className = 'teg-contact-map-box';
    var gbp = AEO_ENABLED ? '<a class="ghost" href="' + GMB + '" target="_blank" rel="noopener">Google Business Profile</a>' : '';
    box.innerHTML = '<div class="teg-map-top"><div class="teg-map-info"><h2>Our location</h2><p>Milwaukee and western suburbs.</p><div class="teg-addr-line"><strong>Address</strong><br>4111 N Port Washington Rd suite 1<br>Milwaukee, WI 53217</div><div class="teg-addr-line"><strong>Phone</strong><br><a href="tel:+14147753705">Call Now</a></div><div class="teg-addr-line"><strong>Hours</strong><br>24/7 — Always Available</div><div class="teg-map-actions"><a class="primary" href="' + MAP_LINK + '" target="_blank" rel="noopener">Get directions</a>' + gbp + '</div></div><div class="teg-map-frame"><iframe title="Map" width="600" height="320" style="border:0" loading="lazy" src="' + MAP_EMBED + '" allowfullscreen></iframe></div></div>';
    section.appendChild(box);
  }

  function injectGmbUi() {
    if (!AEO_ENABLED) return;
    if (document.getElementById('teg-gmb-bar')) return;
    var footer = document.querySelector('footer.footer');
    if (!footer) return;
    var bar = document.createElement('div');
    bar.id = 'teg-gmb-bar';
    bar.className = 'teg-gmb-bar';
    bar.innerHTML = '<p>Happy with your clean? <strong>Leave a Google review</strong> — it helps neighbors in Milwaukee find us.</p><div class="teg-gmb-actions"><a class="teg-review" href="' + GMB_REVIEW + '" target="_blank" rel="noopener">Write a Google Review</a><a class="teg-maps" href="' + GMB + '" target="_blank" rel="noopener">View on Google Maps</a></div>';
    footer.parentNode.insertBefore(bar, footer);
  }

  function ensureReviewsNav() {
    document.querySelectorAll('nav.nav, .footer-links').forEach(function (nav) {
      if (nav.querySelector('a[href="reviews.html"]')) return;
      var contact = null;
      nav.querySelectorAll('a').forEach(function (a) {
        if ((a.getAttribute('href') || '').indexOf('contact.html') !== -1) contact = a;
      });
      if (!contact) return;
      var link = document.createElement('a');
      link.href = 'reviews.html';
      link.textContent = 'Reviews';
      contact.parentNode.insertBefore(link, contact);
    });
  }

  function localizeAreaServiceTitles() {
    var path = (location.pathname || '').split('/').pop() || '';
    var m = path.match(/^area-(.+)\.html$/i);
    if (!m) return;
    var map = { 'wauwatosa': 'Wauwatosa', 'brookfield': 'Brookfield', 'new-berlin': 'New Berlin', 'west-allis': 'West Allis', 'greenfield': 'Greenfield', 'franklin': 'Franklin', 'muskego': 'Muskego', 'pewaukee': 'Pewaukee', 'oak-creek': 'Oak Creek', 'elm-grove': 'Elm Grove', 'hales-corners': 'Hales Corners', 'greendale': 'Greendale', 'milwaukee': 'Milwaukee' };
    var city = map[m[1].toLowerCase()];
    if (!city) return;
    var renames = [[/^Carpet Cleaning$/i, 'Carpet Cleaning in ' + city], [/^Tile\\s*&\\s*Grout( Cleaning)?$/i, 'Tile & Grout Cleaning in ' + city], [/^Upholstery( Cleaning)?$/i, 'Upholstery Cleaning in ' + city], [/^Steam Cleaning$/i, 'Steam Cleaning in ' + city], [/^Pet Odor\\s*&\\s*Stain( Removal)?$/i, 'Pet Odor & Stain Removal in ' + city], [/^Commercial( Carpet Cleaning)?$/i, 'Commercial Carpet Cleaning in ' + city]];
    document.querySelectorAll('.services-grid h3, .service-card-img h3, section.services h3').forEach(function (h) {
      var t = (h.textContent || '').trim();
      if (t.indexOf(' in ') !== -1) return;
      for (var i = 0; i < renames.length; i++) {
        if (renames[i][0].test(t)) { h.textContent = renames[i][1]; break; }
      }
    });
  }

  function injectRelatedServices() {
    var path = (location.pathname || '').split('/').pop() || '';
    if (path.indexOf('service-') !== 0) return;
    if (document.getElementById('teg-related-services')) return;
    var all = [
      {h:'service-carpet-cleaning.html',n:'Carpet Cleaning'},{h:'service-tile-grout.html',n:'Tile & Grout'},{h:'service-couch-cleaning.html',n:'Upholstery'},{h:'service-area-rug.html',n:'Area Rugs'},{h:'service-stain-removal.html',n:'Pet Odor & Stain'},{h:'service-steam-cleaning.html',n:'Steam Cleaning'},{h:'service-commercial.html',n:'Commercial'},{h:'service-water-damage.html',n:'Water Damage'},{h:'service-carpet-stretching.html',n:'Carpet Stretching'},{h:'service-hardwood.html',n:'Hardwood Floors'}
    ];
    var links = all.filter(function(x){ return x.h !== path; }).slice(0,6).map(function(x){ return '<a href="'+x.h+'">'+x.n+'</a>'; }).join('');
    var box = document.createElement('section');
    box.id = 'teg-related-services';
    box.className = 'svc-block';
    box.innerHTML = '<div class="container"><p class="section-eyebrow">Related services</p><h2>Also available from the same team</h2><p>Book multiple services in one visit when it makes sense for your home.</p><div class="svc-areas-list">'+links+'<a href="services.html">All 10 services →</a></div></div>';
    var cta = document.querySelector('section.cta-banner');
    if (cta && cta.parentNode) cta.parentNode.insertBefore(box, cta);
    else { var main = document.querySelector('main'); if (main) main.appendChild(box); }
  }

  function injectAnswerFacts() {
    if (document.getElementById('teg-answer-facts')) return;
    var path = (location.pathname || '').split('/').pop() || '';
    if (path.indexOf('service-') !== 0) return;
    var facts = ['Price agreed before we start — no surprise fees','Open 24/7 for booking and emergencies','Kid- and pet-safe products (once dry)','Licensed & insured Milwaukee local team','Hot water extraction / professional steam methods for deep clean'];
    var el = document.createElement('div');
    el.id = 'teg-answer-facts';
    el.setAttribute('style','background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px 18px;margin:20px auto;max-width:920px');
    el.innerHTML = '<strong style="display:block;margin-bottom:8px;color:#0a3d6b">Quick facts</strong><ul style="margin:0;padding-left:18px;color:#334155;line-height:1.6">' + facts.map(function(f){ return '<li>'+f+'</li>'; }).join('') + '</ul>';
    var block = document.querySelector('.svc-block');
    if (block && block.parentNode) block.parentNode.insertBefore(el, block);
  }

  function injectAreaDepth() {
    var path = (location.pathname || '').split('/').pop() || '';
    var m = path.match(/^area-(.+)\.html$/i);
    if (!m || document.getElementById('teg-area-depth')) return;
    var map = {'milwaukee':'Milwaukee','wauwatosa':'Wauwatosa','brookfield':'Brookfield','new-berlin':'New Berlin','west-allis':'West Allis','greenfield':'Greenfield','franklin':'Franklin','muskego':'Muskego','pewaukee':'Pewaukee','oak-creek':'Oak Creek','elm-grove':'Elm Grove','hales-corners':'Hales Corners','greendale':'Greendale'};
    var city = map[m[1].toLowerCase()];
    if (!city) return;
    var services = [['service-carpet-cleaning.html','Carpet Cleaning'],['service-tile-grout.html','Tile & Grout'],['service-couch-cleaning.html','Upholstery'],['service-area-rug.html','Area Rugs'],['service-stain-removal.html','Pet Odor & Stain'],['service-steam-cleaning.html','Steam Cleaning'],['service-commercial.html','Commercial'],['service-water-damage.html','Water Damage'],['service-carpet-stretching.html','Carpet Stretching'],['service-hardwood.html','Hardwood Floors']];
    var chips = services.map(function(s){ return '<a class="area-chip" href="'+s[0]+'">'+s[1]+' in '+city+'</a>'; }).join('');
    var box = document.createElement('section');
    box.id = 'teg-area-depth';
    box.className = 'section';
    box.innerHTML = '<div class="container" style="max-width:800px"><p class="section-eyebrow">Local guide</p><h2 class="section-title">Carpet cleaning in '+city+': what to expect</h2><p>T.E.G serves '+city+' on our regular Milwaukee-metro route with upfront pricing, hot water extraction for carpet, and the same crew for tile, upholstery, rugs, pet odor, commercial, water extraction, stretching, and hardwood when you need them.</p><p>Call <a href="tel:+14147753705">+1 (414) 775-3705</a> 24/7 or <a href="contact.html">request an estimate</a>. Price is agreed before we start. Most carpet dries in about 4–8 hours. Kid- and pet-safe products are standard once dry.</p><p>See the full process on <a href="how-it-works.html">how it works</a> and answers on the <a href="faq.html">FAQ</a>.</p><div class="home-areas-chips" style="margin-top:18px">'+chips+'</div></div>';
    var cta = document.querySelector('section.cta-banner');
    if (cta && cta.parentNode) cta.parentNode.insertBefore(box, cta);
    else { var main = document.querySelector('main') || document.body; main.appendChild(box); }
  }

  function forceUI() {
    document.querySelectorAll('a[href^="tel:"], a.phone-link, a.phone-shake').forEach(function (a) {
      if (a.closest && (a.closest('.sms-float') || a.closest('.whatsapp-float'))) return;
      a.setAttribute('href', 'tel:+14147753705');
      var t = (a.textContent || '').trim();
      if (t.indexOf('414') !== -1 || t.indexOf('Call') === 0 || /^\+?[\d\s().-]{7,}$/.test(t) || t === 'Call Now') a.textContent = 'Call Now';
      if (a.classList.contains('btn')) { a.classList.remove('btn-primary'); a.classList.add('phone-shake'); }
    });
    document.querySelectorAll('a.whatsapp-float').forEach(function (a) { a.remove(); });
    document.querySelectorAll('a.btn, button.btn, h3').forEach(function (el) {
      var t = el.textContent || '';
      if (/Get a Free Quote/i.test(t)) el.textContent = t.replace(/Get a Free Quote/ig, 'Get a Free Estimate');
      else if (/Get a Quote/i.test(t)) el.textContent = t.replace(/Get a Quote/ig, 'Get an Estimate');
      else if (/Request a Quote/i.test(t)) el.textContent = t.replace(/Request a Quote/ig, 'Request an Estimate');
      else if (/Get My Quote/i.test(t)) el.textContent = t.replace(/Get My Quote/ig, 'Get My Estimate');
    });
    document.querySelectorAll('.stat').forEach(function (el) {
      var s = el.querySelector('strong');
      if (s && /Mon/i.test(s.textContent || '')) { s.textContent = '24/7'; var sp = el.querySelector('span'); if (sp) sp.textContent = 'Always open'; }
    });
    document.querySelectorAll('.logo-text').forEach(function (el) {
      if ((el.textContent || '').indexOf('Furniture') === -1) el.textContent = 'Carpet & Furniture Steam Cleaning';
    });
    ensureReviewsNav();
    localizeAreaServiceTitles();
    injectGmbUi();
    injectFooterMap();
    injectContactMapBox();
    injectRelatedServices();
    injectAnswerFacts();
    injectAreaDepth();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', forceUI);
  else forceUI();
  setTimeout(forceUI, 400);
  setTimeout(forceUI, 1200);

  if (!document.querySelector('script[src*="cms-apply"]')) {
    var cms = document.createElement('script');
    cms.src = 'cms-apply.js';
    cms.defer = true;
    (document.body || document.documentElement).appendChild(cms);
  }

  window.TEG_SITE = { forceUI: forceUI, AEO_ENABLED: AEO_ENABLED };
})();
