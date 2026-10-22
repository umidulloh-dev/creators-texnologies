import ru from './ru.js';
import uz from './uz.js';
import en from './en.js';
import { loadState, saveState } from '../lib/storage.js';

const LANGS = { ru, uz, en };
const RU_FALLBACK = ['ru','kk','ky','tg','tk','be','uk'];

function detectLang(){
  const saved = loadState().lang;
  if(LANGS[saved]) return saved;
  const nav = (navigator.language || 'ru').slice(0,2).toLowerCase();
  if(LANGS[nav]) return nav;
  return RU_FALLBACK.includes(nav) ? 'ru' : 'en';
}

let lang = detectLang();
const listeners = [];

export function getLang(){ return lang; }
export function dict(){ return LANGS[lang]; }
export function t(key){ return LANGS[lang].strings[key] ?? ru.strings[key] ?? key; }
export function onLangChange(fn){ listeners.push(fn); }

// Static markup declares its texts:
//   data-i18n="key"                     → textContent
//   data-i18n-html="key"                → innerHTML (only for our own dictionary strings)
//   data-i18n-attr="placeholder:key;…"  → attributes
function applyTranslations(root = document){
  root.querySelectorAll('[data-i18n]').forEach(n=>{ n.textContent = t(n.dataset.i18n); });
  root.querySelectorAll('[data-i18n-html]').forEach(n=>{ n.innerHTML = t(n.dataset.i18nHtml); });
  root.querySelectorAll('[data-i18n-attr]').forEach(n=>{
    n.dataset.i18nAttr.split(';').forEach(pair=>{
      const [attr, key] = pair.split(':').map(s=>s.trim());
      if(attr && key) n.setAttribute(attr, t(key));
    });
  });
  document.documentElement.lang = lang;
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  document.querySelectorAll('[data-lang]').forEach(b=> b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}

function setLang(next){
  if(!LANGS[next] || next === lang) return;
  lang = next;
  saveState({ lang });
  applyTranslations();
  listeners.forEach(fn=> fn(lang));
}

export function initLangSwitch(){
  document.querySelectorAll('[data-lang]').forEach(b=> b.addEventListener('click', ()=> setLang(b.dataset.lang)));
  applyTranslations();
}
