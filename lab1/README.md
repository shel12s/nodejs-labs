# Lab 1 — Погодний застосунок

Простий веб-застосунок на Express із шаблонізатором Handlebars, що відображає погоду для чотирьох міст України (mock-дані).

## Стек

- Node.js
- Express
- hbs (Handlebars)

## Встановлення та запуск

```bash
cd lab1
npm install
npm run dev     # розробка (nodemon)
# або
npm start       # продакшн (node)
```

Відкрий у браузері: [http://localhost:3000](http://localhost:3000)

## Маршрути

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/` | Головна сторінка |
| GET | `/weather/:city` | Погода для міста |

Доступні міста: `zhytomyr`, `kyiv`, `poltava`, `sumy`

Приклад: [http://localhost:3000/weather/kyiv](http://localhost:3000/weather/kyiv)

## Структура

```
lab1/
├── app.js          # сервер, маршрути, mock-дані
├── views/
│   ├── index.hbs
│   ├── weather.hbs
│   ├── 404.hbs
│   └── partials/
└── public/
    └── style.css
```
