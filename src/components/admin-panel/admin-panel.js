import { ADMIN_PASSWORD_SHA256 } from '../../config.js';
import { esc } from '../../lib/dom.js';
import { readSubmissions, clearSubmissions } from '../../lib/storage.js';

// ---- admin panel ----
export function initAdminPanel(){
  const adminToggleBtn = document.getElementById('admin-toggle-btn');
  const adminPanel = document.getElementById('admin-panel');
  const adminLock = document.getElementById('admin-lock');
  const adminContent = document.getElementById('admin-content');
  const adminPasswordInput = document.getElementById('admin-password');
  const adminErr = document.getElementById('admin-err');
  const adminUnlockBtn = document.getElementById('admin-unlock-btn');
  const adminLockBtn = document.getElementById('admin-lock-btn');
  const adminRefreshBtn = document.getElementById('admin-refresh-btn');
  const adminClearBtn = document.getElementById('admin-clear-btn');
  const adminTableHolder = document.getElementById('admin-table-holder');

  adminToggleBtn.addEventListener('click', ()=>{
    const opening = getComputedStyle(adminPanel).display === 'none';
    adminPanel.style.display = opening ? 'block' : 'none';
    if(opening){
      adminPasswordInput.value=''; adminErr.style.display='none'; adminLock.style.display='block'; adminContent.classList.remove('show');
      setTimeout(()=>{
        adminPanel.scrollIntoView({behavior:'smooth', block:'center'});
        try{ adminPasswordInput.focus({preventScroll:true}); }catch(e){}
      }, 50);
    }
  });

  async function sha256(text){
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b=> b.toString(16).padStart(2,'0')).join('');
  }
  async function tryUnlock(){
    let ok = false;
    try{ ok = (await sha256(adminPasswordInput.value)) === ADMIN_PASSWORD_SHA256; }catch(e){ /* crypto.subtle needs https or localhost */ }
    if(ok){
      adminLock.style.display='none';
      adminContent.classList.add('show');
      renderAdminTable();
    }else{
      adminErr.style.display='block';
    }
  }
  adminUnlockBtn.addEventListener('click', tryUnlock);
  adminPasswordInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') tryUnlock(); });

  adminLockBtn.addEventListener('click', ()=>{
    adminContent.classList.remove('show');
    adminLock.style.display='block';
    adminPasswordInput.value='';
  });
  adminRefreshBtn.addEventListener('click', renderAdminTable);
  adminClearBtn.addEventListener('click', ()=>{
    if(confirm('Удалить всю локальную историю заявок?')){
      clearSubmissions();
      renderAdminTable();
    }
  });

  function renderAdminTable(){
    const list = readSubmissions();
    if(!list.length){
      adminTableHolder.innerHTML = '<div class="admin-empty">Пока нет сохранённых заявок в этом браузере.</div>';
      return;
    }
    const rows = list.slice().reverse().map(r=>`
      <tr>
        <td>${esc((r.savedAt||'').replace('T',' ').slice(0,16))}</td>
        <td>${esc(r.type||'')}</td>
        <td>${esc(r.name||[r.firstName,r.lastName].filter(Boolean).join(' ')||'')}</td>
        <td>${esc(r.email||'')}</td>
        <td>${esc(r.country||'')}</td>
        <td>${esc(r.phone||r.telegram||'')}</td>
        <td>${esc(r.projectType||r.currency||'')}</td>
        <td style="white-space:normal; max-width:220px;">${esc(r.message||'')}</td>
      </tr>`).join('');
    adminTableHolder.innerHTML = `
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr>
            <th>Дата</th><th>Тип</th><th>Имя</th><th>Email</th><th>Страна</th><th>Контакт</th><th>Тип/валюта</th><th>Сообщение</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }
}
