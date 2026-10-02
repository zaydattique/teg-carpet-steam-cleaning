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
    st.textContent = ['.whatsapp-float{display:none!important}','.sms-float{position:fixed;bottom:28px;right:28px;z-index:999;width:60px;height:60px;background:#0ea5e9;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(14,165,233,.45)}','.sms-float svg{width:28px;height:28px}','.footer .logo-mark,.footer-brand .logo-mark{color:#38bdf8!important}','.footer .logo-text,.footer-brand .logo-text{color:#ffffff!important}','.footer-brand p,.footer-links a,.footer-contact a,.footer-contact p{color:rgba(255,255,255,.85)!important}','.footer-links h4,.footer-contact h4{color:#fff!important}','.footer-bottom p,.footer-bottom .support{color:rgba(255,255,255,.55)!important}','.page-inner .header .logo-text{color:#0a3d6b!important}','.page-inner .header .logo-mark{color:#0ea5e9!important}','@media (min-width:769px){','.header .container{padding-left:28px!important;padding-right:28px!important;max-width:100%!important}','.header-inner{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;width:100%!important;flex-wrap:nowrap!important}','.header .nav{display:flex!important;flex:1 1 auto!important;flex-wrap:nowrap!important;justify-content:center!important;align-items:center!important;gap:clamp(8px,1.2vw,18px)!important;min-width:0!important}','.header .nav > a{white-space:nowrap!important;font-size:clamp(12px,1.15vw,14px)!important}','.header-actions{display:flex!important;align-items:center!important;gap:10px!important;border:none!important;flex:0 0 auto!important}','}','.header-actions .phone-link{display:inline-flex!important;padding:7px 14px!important;border-radius:10px!important;border:2px solid #0ea5e9!important;background:transparent!important;color:#0ea5e9!important;font-weight:600!important;white-space:nowrap!important}','body:not(.page-inner) .header:not(.scrolled) .header-actions .phone-link{border-color:rgba(255,255,255,.75)!important;color:#fff!important}','a.btn.phone-shake,a.btn[href^="tel:"]{background:transparent!important;border:2px solid #0ea5e9!important;color:#0ea5e9!important;box-shadow:none!important}','.cta-banner a.btn.phone-shake,.hero a.btn.phone-shake{border-color:rgba(255,255,255,.85)!important;color:#fff!important;background:transparent!important}','.page-hero a.btn.phone-shake,.hero-ctas a.btn.phone-shake{background:transparent!important;border:2px solid #0ea5e9!important;color:#0ea5e9!important}','.teg-gmb-bar{position:relative;z-index:5;background:linear-gradient(90deg,#0a3d6b,#0ea5e9);color:#fff;text-align:center;padding:10px 16px;font-size:14px;font-weight:600}','.teg-gmb-bar a{color:#fff;text-decoration:underline;margin:0 6px}'].join('');
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
        'email': 'contact@tegcarpetsteamcleaning.com',
        'image': 'https://tegcarpetfurniturecleaning.com/favicon.svg',
        'priceRange': '$$',
        'address': { '@type': 'PostalAddress', 'streetAddress': '4111 N Port Washington Rd suite 1', 'addressLocality': 'Milwaukee', 'addressRegion': 'WI', 'postalCode': '53217', 'addressCountry': 'US' },
        'geo': { '@type': 'GeoCoordinates', 'latitude': 43.0895, 'longitude': -87.8910 },
        'openingHoursSpecification': { '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], 'opens': '00:00', 'closes': '23:59' },
        'knowsAbout': ['carpet cleaning','steam cleaning','tile and grout cleaning','upholstery cleaning','area rug cleaning','pet odor removal','stain removal','commercial carpet cleaning','hot water extraction','water damage restoration','carpet stretching','hardwood floor cleaning'],
        'sameAs': ['https://g.page/teg-carpet-steam-cleaning'],
        'areaServed': ['Milwaukee WI','Wauwatosa WI','Brookfield WI','New Berlin WI','West Allis WI','Greenfield WI','Franklin WI','Muskego WI','Pewaukee WI','Oak Creek WI','Elm Grove WI','Hales Corners WI','Greendale WI'],
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Cleaning Services',
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
    var se = document.createElement('script');
    se.type = 'application/ld+json';
    se.id = 'teg-schema-ld';
    se.textContent = JSON.stringify(schema);
    (document.head || document.documentElement).appendChild(se);
  }

  function injectFooterMap() {}
  function injectContactMapBox() {}
  function injectGmbUi() {}
  function ensureReviewsNav() {}
  function localizeAreaServiceTitles() {}
  function injectRelatedServices() {}
  function injectAnswerFacts() {}
  function injectAreaDepth() {}

  function forceUI() {
    try {
      document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(function (a) {
        if (a.classList.contains('whatsapp-float')) a.style.display = 'none';
      });
    } catch (e) {}
  }

  function runAll() {
    injectFooterMap();
    injectContactMapBox();
    injectGmbUi();
    ensureReviewsNav();
    localizeAreaServiceTitles();
    injectRelatedServices();
    injectAnswerFacts();
    injectAreaDepth();
    forceUI();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runAll);
  else runAll();

  window.TEG_SITE = { forceUI: forceUI, AEO_ENABLED: AEO_ENABLED };
})();
