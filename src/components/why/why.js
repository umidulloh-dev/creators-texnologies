import { dict, onLangChange } from '../../i18n/index.js';
import { el } from '../../lib/dom.js';
import { observeReveals } from '../../lib/reveal.js';

function render(why){
  why.innerHTML = '';
  dict().why.forEach(w=>{
    why.appendChild(el(`<div class="card reveal" style="text-align:center;"><h3 style="color:#22d3ee; font-size:18px;">${w.title}</h3><p>${w.desc}</p></div>`));
  });
}

export function renderWhy(){
  const why = document.getElementById('why-grid');
  render(why);
  onLangChange(()=>{ render(why); observeReveals(); });
}
