// ---- persistence: everything typed on the site is remembered in this browser ----
const STORAGE_KEY = 'ct_site_state_v1';
const SUBMISSIONS_KEY = 'ct_submissions_v1';

export function loadState(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch(e){ return {}; }
}
export function saveState(patch){
  try{
    const current = loadState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
  }catch(e){ /* storage unavailable — site still works, just won't remember */ }
}
export function logSubmission(entry){
  try{
    const list = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    list.push({ ...entry, savedAt: new Date().toISOString() });
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  }catch(e){ /* ignore */ }
}
export function readSubmissions(){
  try{ return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]'); }catch(e){ return []; }
}
export function clearSubmissions(){
  try{ localStorage.removeItem(SUBMISSIONS_KEY); }catch(e){}
}
