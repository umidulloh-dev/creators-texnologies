import { COUNTRIES } from '../data/countries.js';

export function el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstChild; }

export function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Option values stay Russian (saved state, leads and the admin table rely on them); labels follow the UI language.
export function fillCountrySelect(select, lang){
  const current = select.value;
  select.innerHTML = '';
  COUNTRIES.forEach(c=>{ select.appendChild(new Option(c[lang] || c.ru, c.ru)); });
  if(current) select.value = current;
}
