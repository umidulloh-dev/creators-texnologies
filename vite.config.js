import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { CONTACTS, SITE_URL } from './src/config.js';
import ru from './src/i18n/ru.js';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const INCLUDE_RE = /<include\s+src="([^"]+)"\s*(?:\/>|><\/include>)/g;
const VAR_RE = /\{\{\s*(\w+)\s*\}\}/g;

// Assembles index.html from src/components/*/*.html:
//   <include src="path/from/project/root.html"></include>  — inlines the file (nested includes work)
//   {{telegram}}                                           — value from CONTACTS in src/config.js
function htmlComponents(){
  const inline = (html) => html.replace(INCLUDE_RE, (_, src) => inline(readFileSync(resolve(ROOT, src), 'utf8')));
  const fill = (html) => html.replace(VAR_RE, (_, key) => {
    if(!(key in CONTACTS)) throw new Error(`Unknown {{${key}}} in HTML — add it to CONTACTS in src/config.js`);
    return CONTACTS[key];
  });
  return {
    name: 'html-components',
    transformIndexHtml: { order: 'pre', handler: (html) => fill(inline(html)) },
    handleHotUpdate({ file, server }){
      if(file.endsWith('.html')){ server.ws.send({ type: 'full-reload' }); return []; }
    },
  };
}

// Search-engine extras: schema.org data, canonical/og:url/og:image (need SITE_URL),
// robots.txt and sitemap.xml in the build.
function siteMeta(){
  const stripTags = (s) => s.replace(/<[^>]+>/g, '');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        name: 'CREATORS TEXNOLOGIES',
        description: ru.strings['meta.description'],
        telephone: CONTACTS.phone,
        priceRange: 'от 1 000 000 UZS / $85',
        areaServed: 'Worldwide',
        availableLanguage: ['ru', 'uz', 'en'],
        sameAs: [CONTACTS.instagram, CONTACTS.telegramChannel],
        ...(SITE_URL && { url: SITE_URL, image: `${SITE_URL}/og-image.jpg`, logo: `${SITE_URL}/og-image.jpg` }),
      },
      {
        '@type': 'FAQPage',
        mainEntity: ru.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: stripTags(a) } })),
      },
    ],
  };
  const tags = [
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
    ...(SITE_URL ? [
      `<link rel="canonical" href="${SITE_URL}/" />`,
      `<meta property="og:url" content="${SITE_URL}/" />`,
      `<meta property="og:image" content="${SITE_URL}/og-image.jpg" />`,
    ] : []),
  ].join('\n');

  return {
    name: 'site-meta',
    transformIndexHtml: (html) => html.replace('<!-- site-meta -->', tags),
    generateBundle(){
      const robots = `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}/sitemap.xml\n` : ''}`;
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      if(SITE_URL){
        const today = new Date().toISOString().slice(0, 10);
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source:
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n` });
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [htmlComponents(), siteMeta()],
});
