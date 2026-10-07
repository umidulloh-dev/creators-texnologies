import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID, GOOGLE_ADS_LEAD_LABEL } from '../config.js';

// Events that mean "a visitor reached out" — each one is reported to Google Ads as a lead conversion.
const LEAD_EVENTS = ['telegram_click', 'phone_click', 'order_click', 'contact_seller_click', 'form_submit'];

// EEA/UK/Switzerland: no ad/analytics cookies without consent (the site has no consent banner,
// so there Google only gets cookieless pings). Everywhere else tags work normally.
const CONSENT_REGIONS = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH'];

export function track(name, params){
  try{
    if(!window.gtag) return;
    window.gtag('event', name, params||{});
    if(GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL && LEAD_EVENTS.includes(name)){
      window.gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}` });
    }
  }catch(e){} // analytics hook (silent)
}

// Loads the Google tag when Analytics and/or Ads ids are configured in config.js
export function initAnalytics(){
  const ids = [GA_MEASUREMENT_ID, GOOGLE_ADS_ID].filter(Boolean);
  if(!ids.length) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
    region: CONSENT_REGIONS,
  });
  window.gtag('js', new Date());
  ids.forEach(id=> window.gtag('config', id));
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`;
  document.head.appendChild(s);
}

// Links and buttons declare their event in markup: data-track="telegram_click" data-track-source="footer"
export function initTrackedClicks(){
  document.addEventListener('click', (e)=>{
    const t = e.target.closest('[data-track]');
    if(!t) return;
    track(t.dataset.track, t.dataset.trackSource ? { source: t.dataset.trackSource } : undefined);
  });
}
