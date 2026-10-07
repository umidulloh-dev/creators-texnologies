import { SERVICES } from '../../data/content.js';
import { CONTACTS } from '../../config.js';
import { dict, t, onLangChange } from '../../i18n/index.js';
import { el } from '../../lib/dom.js';
import { track } from '../../lib/analytics.js';
import { showToast } from '../../lib/toast.js';
import { observeReveals } from '../../lib/reveal.js';

function render(svc){
  svc.innerHTML = '';
  SERVICES.forEach(s=>{
    const { title, desc } = dict().services[s.type];
    svc.appendChild(el(`<div class="card card-svc reveal"><div class="icon-badge" aria-hidden="true">${s.icon}</div><h3>${title}</h3><p>${desc}</p><a href="${CONTACTS.telegram}" target="_blank" rel="noopener noreferrer" class="cta-btn order-btn" data-type="${s.type}" data-title="${title}">${t('services.order')}</a></div>`));
  });
}

export function renderServices(){
  const svc = document.getElementById('services-grid');
  render(svc);
  onLangChange(()=>{ render(svc); observeReveals(); });

  // "Заказать" buttons: open Telegram, copy a ready message to paste into the chat
  svc.addEventListener('click', (e)=>{
    const btn = e.target.closest('.order-btn');
    if(!btn) return;
    const text = t('services.orderMsg') + btn.dataset.title;
    try{ navigator.clipboard.writeText(text).then(()=>showToast(t('services.copied'))).catch(()=>{}); }catch(e){}
    track('order_click', { service: btn.dataset.type });
  });
}
