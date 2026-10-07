import { fillCountrySelect } from '../../lib/dom.js';
import { getLang, t, onLangChange } from '../../i18n/index.js';
import { loadState, saveState, logSubmission } from '../../lib/storage.js';
import { track } from '../../lib/analytics.js';
import { sendToTelegramBot } from '../../lib/telegram-bot.js';

// top registration bar
export function initRegBar(){
  const regCountrySel = document.getElementById('reg-country');
  fillCountrySelect(regCountrySel, getLang());
  onLangChange((lang)=> fillCountrySelect(regCountrySel, lang));

  const regFirst = document.getElementById('reg-firstname');
  const regLast = document.getElementById('reg-lastname');
  const regCurrency = document.getElementById('reg-currency');
  const regContactBtn = document.getElementById('reg-contact-btn');
  const regBar = document.getElementById('reg-bar');
  const regDoneMsg = document.getElementById('reg-done-msg');
  const regDoneName = document.getElementById('reg-done-name');
  const regEditBtn = document.getElementById('reg-edit-btn');
  const form = document.getElementById('contact-form');
  const countrySel = document.getElementById('country-select');

  function showRegDone(fullName){
    regBar.classList.add('hidden');
    regDoneName.textContent = fullName || t('reg.defaultName');
    regDoneMsg.classList.add('show');
  }
  function showRegForm(){
    regBar.classList.remove('hidden');
    regDoneMsg.classList.remove('show');
  }

  // restore previously entered values for this visitor
  const s = loadState();
  if(s.firstName) regFirst.value = s.firstName;
  if(s.lastName) regLast.value = s.lastName;
  if(s.country) regCountrySel.value = s.country;
  if(s.currency) regCurrency.value = s.currency;
  if(s.registered){
    showRegDone([s.firstName, s.lastName].filter(Boolean).join(' '));
  }

  regEditBtn.addEventListener('click', ()=>{
    showRegForm();
    saveState({ registered: false });
  });

  // mirror the bar into the contact form so the visitor doesn't type it twice
  function syncRegToForm(){
    const nameField = form.querySelector('input[name="name"]');
    const fullName = [regFirst.value.trim(), regLast.value.trim()].filter(Boolean).join(' ');
    if(nameField && fullName) nameField.value = fullName;
    if(countrySel && regCountrySel.value) countrySel.value = regCountrySel.value;
    saveState({
      firstName: regFirst.value.trim(),
      lastName: regLast.value.trim(),
      country: regCountrySel.value,
      currency: regCurrency.value
    });
  }
  [regFirst, regLast, regCountrySel, regCurrency].forEach(f=> f.addEventListener('input', syncRegToForm));

  regContactBtn.addEventListener('click', ()=>{
    syncRegToForm();
    const lead = {
      firstName: regFirst.value.trim(),
      lastName: regLast.value.trim(),
      country: regCountrySel.value,
      currency: regCurrency.value
    };
    track('contact_seller_click', { country: lead.country, currency: lead.currency }); // no names: analytics must not receive personal data
    logSubmission({ type: 'contact_seller_click', ...lead });
    sendToTelegramBot(`Новый клиент нажал «Связаться с продавцом»\nИмя: ${lead.firstName} ${lead.lastName}\nСтрана: ${lead.country}\nВалюта: ${lead.currency}`);

    saveState({ registered: true });
    showRegDone([lead.firstName, lead.lastName].filter(Boolean).join(' '));
  });
}
