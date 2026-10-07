import { initAnalytics, initTrackedClicks } from './lib/analytics.js';
import { initLangSwitch } from './i18n/index.js';
import { observeReveals } from './lib/reveal.js';
import { initRouter } from './lib/router.js';
import { initRipple } from './lib/ripple.js';
import { initMobileMenu } from './components/header/header.js';
import { initRegBar } from './components/reg-bar/reg-bar.js';
import { renderServices } from './components/services/services.js';
import { renderWhy } from './components/why/why.js';
import { renderProcess } from './components/process/process.js';
import { renderFaq } from './components/faq/faq.js';
import { renderContactCountries, initContactForm } from './components/contact/contact-form.js';
import { initAdminPanel } from './components/admin-panel/admin-panel.js';
import { initStartProject } from './components/start-project/start-project.js';

// Order matters: content is rendered before reveal/router observe it,
// and the reg bar restores before the form draft (the draft wins).
initAnalytics();
initTrackedClicks();
initLangSwitch();
initMobileMenu();

renderServices();
renderWhy();
renderProcess();
renderFaq();
renderContactCountries();

initRegBar();

observeReveals();
setTimeout(observeReveals, 60);

initContactForm();
initAdminPanel();
initRouter();
initStartProject();
initRipple();

document.getElementById('footer-year').textContent = new Date().getFullYear();
