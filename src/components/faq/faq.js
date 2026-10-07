import { dict, onLangChange } from '../../i18n/index.js';
import { el } from '../../lib/dom.js';
import { observeReveals } from '../../lib/reveal.js';

function render(faqList){
  faqList.innerHTML = '';
  dict().faqs.forEach((f,i)=>{
    const item = el(`<div class="faq-item reveal">
      <button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-a-${i}"><span>${f[0]}</span><span class="faq-plus" aria-hidden="true">+</span></button>
      <div class="faq-a" id="faq-a-${i}"><p>${f[1]}</p></div>
    </div>`);
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    btn.addEventListener('click', ()=>{
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o=>{
        o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight=null;
        o.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if(!isOpen){ item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight+'px'; btn.setAttribute('aria-expanded','true'); }
    });
    faqList.appendChild(item);
  });
}

export function renderFaq(){
  const faqList = document.getElementById('faq-list');
  render(faqList);
  onLangChange(()=>{ render(faqList); observeReveals(); });
}
