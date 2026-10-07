import { observeReveals } from './reveal.js';

// ---- pages (hash routing): each nav item shows its own page ----
const PAGE_SECTIONS = {
  home:     ['home','pricing','final'],
  services: ['pricing','services','final'],
  about:    ['why','process','world','final'],
  faq:      ['faq','final'],
  contact:  ['contact']
};
const PAGE_ALIAS = { pricing:'home', why:'about', process:'about', world:'about' };

function route(scroll){
  let key = (location.hash || '#home').slice(1);
  let page = PAGE_ALIAS[key] || key;
  if(!PAGE_SECTIONS[page]) page = 'home';
  const visible = PAGE_SECTIONS[page];
  document.querySelectorAll('main > section').forEach(sec=>{
    const on = visible.includes(sec.id);
    sec.style.display = on ? '' : 'none';
    if(on){ sec.style.animation='none'; void sec.offsetWidth; sec.style.animation=''; }
  });
  document.querySelectorAll('.navlinks a, .mobile-menu a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === '#' + page);
  });
  if(scroll) window.scrollTo({top:0, behavior:'instant'});
  observeReveals();
}

export function initRouter(){
  window.addEventListener('hashchange', ()=> route(true));
  route(false);
}
