// mobile hamburger menu
export function initMobileMenu(){
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const setOpen = (open)=>{
    burgerBtn.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    burgerBtn.setAttribute('aria-expanded', String(open));
  };
  burgerBtn.addEventListener('click', ()=> setOpen(!mobileMenu.classList.contains('open')));
  mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> setOpen(false)));
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && mobileMenu.classList.contains('open')){ setOpen(false); burgerBtn.focus(); }
  });
}
