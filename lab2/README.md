# Lab 2 — Менеджер завдань

CRUD-застосунок для управління завданнями. Дані зберігаються у `data/tasks.json` без будь-якої бази даних.

## Стек

- Node.js
- Express
- EJS

## Встановлення та запуск

```bash
cd lab2
npm install
npm run dev     # розробка (nodemon, перезавантажує js/ejs/json)
# або
npm start       # продакшн (node)
```

Відкрий у браузері: [http://localhost:3000](http://localhost:3000)

## Маршрути

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/` | Редирект на `/tasks` |
| GET | `/tasks` | Список завдань |
| GET | `/tasks?status=pending` | Фільтр за статусом |
| GET | `/tasks/:id` | Деталі завдання |
| GET | `/add` | Форма додавання |
| POST | `/add` | Створити завдання |
| POST | `/tasks/:id/delete` | Видалити завдання |

## Структура

```
lab2/
├── app.js              # сервер, маршрути, middleware-логер
├── data/
│   └── tasks.json      # файл-сховище даних
├── views/
│   ├── tasks.ejs
│   ├── task.ejs
│   ├── add.ejs
│   ├── 404.ejs
│   └── partials/
└── public/
    └── style.css
```
