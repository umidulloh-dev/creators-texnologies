// scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.12});

export function observeReveals(){ document.querySelectorAll('.reveal:not(.in)').forEach(elx=>io.observe(elx)); }
