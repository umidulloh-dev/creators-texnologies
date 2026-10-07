// Site-wide settings. CONTACTS values are also substituted into the HTML
// components wherever {{key}} appears (see vite.config.js).
export const CONTACTS = {
  telegram: 'https://t.me/+998958099922',
  instagram: 'https://www.instagram.com/creatorstexnologies/',
  phone: '+998958099922',
  phoneDisplay: '+998 95 809 99 22',
  instagramHandle: '@creatorstexnologies',
  telegramChannel: 'https://t.me/darknexeditz',
  telegramChannelHandle: '@darknexeditz',
};

// Public address of the site, no trailing slash, e.g. "https://creators-tex.uz".
// When set, the build adds canonical/og:url/og:image tags and sitemap.xml.
export const SITE_URL = '';

// Google Analytics 4 id, e.g. "G-XXXXXXXXXX". Empty = analytics off.
export const GA_MEASUREMENT_ID = '';

// Google Ads: conversion id ("AW-123456789") and the label of a "Lead" conversion action.
// Both are shown in Google Ads → Goals → Conversions → your action → Tag setup → Use Google tag.
// When set, Telegram/phone/order clicks and form submissions are reported as conversions.
export const GOOGLE_ADS_ID = '';
export const GOOGLE_ADS_LEAD_LABEL = '';

// ---- optional: forward every lead/submission to a Telegram bot chat ----
// Fill these in (create a bot via @BotFather, add it to your chat, get the chat id)
// and every registration + form submission will be delivered to you automatically.
// NOTE: anything here ships to the browser — the token is visible to visitors.
export const BOT_TOKEN = ''; // e.g. "123456789:AAExampleToken"
export const BOT_CHAT_ID = ''; // e.g. "958099922" or a group chat id

// SHA-256 of the admin password, so the password itself isn't readable in the page source.
// New hash: run `echo -n 'new-password' | shasum -a 256` and paste the first column here.
export const ADMIN_PASSWORD_SHA256 = '0a97fc1d6207291c2cc24e991593c76bbe007c3406ba1bd08c6a7a904067adde';
