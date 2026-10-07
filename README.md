# CREATORS TEXNOLOGIES — сайт

Лендинг студии на чистом HTML/CSS/JS, собирается через [Vite](https://vite.dev).

## Запуск

```bash
npm install      # один раз
npm run dev      # разработка: http://localhost:5173
npm run build    # готовый сайт в папке dist/ — её и загружать на хостинг
npm run preview  # посмотреть собранную версию
```

## Где что менять

| Что | Где |
|---|---|
| Телефон, Telegram, Instagram, домен, Google Analytics, бот | `src/config.js` |
| Тексты на русском / узбекском / английском | `src/i18n/ru.js`, `uz.js`, `en.js` (ключи во всех трёх должны совпадать) |
| Список стран | `src/data/countries.js` |
| Иконки услуг | `src/data/content.js` |
| Разметка и стили секции | `src/components/<секция>/` |
| Порядок секций | `index.html` |
| Общие стили, кнопки, поля | `src/styles/base.css` |

Новый текст в HTML: добавьте атрибут `data-i18n="ключ"` и сам ключ во все три словаря.
Контакты в HTML пишутся как `{{telegram}}`, `{{phoneDisplay}}` и т.п. — значения берутся из `CONTACTS`.

## Перед публикацией

1. Укажите домен в `SITE_URL` (`src/config.js`) — появятся canonical, превью ссылок с картинкой и `sitemap.xml`.
2. При желании впишите `GA_MEASUREMENT_ID` — заработает Google Analytics.
3. Смена пароля админки: `echo -n 'новый-пароль' | shasum -a 256` → вставить хеш в `ADMIN_PASSWORD_SHA256`.
