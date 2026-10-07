// press effect: ripple + glow on every button
export function initRipple(){
  document.addEventListener('pointerdown', (e)=>{
    const btn = e.target.closest('.cta-btn,.ghost-btn,.submit-btn,.tile,.burger,.faq-q,.fab,.admin-actions button');
    if(!btn) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.width = dot.style.height = size + 'px';
    dot.style.left = (e.clientX - r.left - size/2) + 'px';
    dot.style.top = (e.clientY - r.top - size/2) + 'px';
    btn.appendChild(dot);
    btn.classList.remove('press-glow'); void btn.offsetWidth; btn.classList.add('press-glow');
    setTimeout(()=> dot.remove(), 650);
  });
}
