import { CONTACTS } from '../../config.js';
import { fillCountrySelect } from '../../lib/dom.js';
import { getLang, t, onLangChange } from '../../i18n/index.js';
import { loadState, saveState, logSubmission } from '../../lib/storage.js';
import { track } from '../../lib/analytics.js';
import { sendToTelegramBot } from '../../lib/telegram-bot.js';

// must run before initRegBar(), which copies its country into this select
export function renderContactCountries(){
  const select = document.getElementById('country-select');
  fillCountrySelect(select, getLang());
  onLangChange((lang)=> fillCountrySelect(select, lang));
}

// contact form
export function initContactForm(){
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const errBox = document.getElementById('form-error');
  const successBox = document.getElementById('form-success');

  // restore a draft if the visitor left and came back
  const s = loadState();
  if(s.formDraft){
    Object.entries(s.formDraft).forEach(([key, val])=>{
      const field = form.querySelector(`[name="${key}"]`);
      if(field) field.value = val;
    });
  }
  form.addEventListener('input', ()=>{
    const draft = {};
    new FormData(form).forEach((val, key)=>{ draft[key] = val; });
    saveState({ formDraft: draft });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    errBox.style.display='none';

    const receiptConfirm = document.getElementById('receipt-confirm');
    if(!receiptConfirm.checked){
      errBox.textContent = t('form.receiptError');
      errBox.style.display='block';
      receiptConfirm.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = t('form.sending');

    const data = {};
    new FormData(form).forEach((val, key)=>{ data[key] = val; });

    const messageText =
      `Заявка с сайта\nИмя: ${data.name}\nEmail: ${data.email}\nСтрана: ${data.country}\nТелефон: ${data.phone||'—'}\nTelegram/WhatsApp: ${data.telegram||'—'}\nТип проекта: ${data.projectType}\nОписание: ${data.message}`;

    track('form_submit', { projectType: data.projectType, country: data.country }); // no names/emails in analytics
    logSubmission({ type: 'contact_form', ...data });
    // if a bot is configured (see BOT_TOKEN in config.js), this delivers the data automatically;
    // either way we also hand it to the visitor to send themselves, so nothing is lost
    sendToTelegramBot(messageText);
    try{ navigator.clipboard.writeText(messageText); }catch(e){}
    window.open(CONTACTS.telegram, '_blank', 'noopener,noreferrer');

    form.style.display='none';
    successBox.style.display='block';
    submitBtn.disabled = false;
    submitBtn.textContent = t('form.submit');
    form.reset();
    saveState({ formDraft: {} });
  });

  document.getElementById('form-reset-btn').addEventListener('click', ()=>{
    successBox.style.display='none'; form.style.display='block';
  });
}
