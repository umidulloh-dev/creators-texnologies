import { track } from '../../lib/analytics.js';

// "Начать проект" buttons: choose Telegram or Instagram
export function initStartProject(){
  const spPopover = document.getElementById('sp-popover');
  let opener = null;
  const open = (btn)=>{
    opener = btn;
    spPopover.classList.add('show');
    document.getElementById('sp-tg').focus();
  };
  const close = ()=>{
    if(!spPopover.classList.contains('show')) return;
    spPopover.classList.remove('show');
    opener?.focus();
  };
  document.querySelectorAll('.start-project-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      track('start_project', { source: btn.dataset.source });
      open(btn);
    });
  });
  document.getElementById('sp-close').addEventListener('click', close);
  spPopover.addEventListener('click', (e)=>{ if(e.target===spPopover) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
  document.getElementById('sp-tg').addEventListener('click', ()=> track('telegram_click',{source:'start_project_popover'}));
  document.getElementById('sp-ig').addEventListener('click', ()=> track('instagram_click',{source:'start_project_popover'}));
}
