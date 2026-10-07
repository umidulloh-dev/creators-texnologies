import { dict, onLangChange } from '../../i18n/index.js';
import { el } from '../../lib/dom.js';
import { observeReveals } from '../../lib/reveal.js';

function render(proc){
  proc.innerHTML = '';
  dict().process.forEach((p,i)=>{
    proc.appendChild(el(`<div class="tstep reveal"><div class="tnum">${i+1}</div><h3>${p.title}</h3><p>${p.desc}</p></div>`));
  });
}

export function renderProcess(){
  const proc = document.getElementById('process-grid');
  render(proc);
  onLangChange(()=>{ render(proc); observeReveals(); });
}
