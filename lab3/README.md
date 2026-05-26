# Lab 3 — Система управління користувачами

Повноцінний MVC-застосунок з веб-інтерфейсом та REST API, аутентифікацією, управлінням контактами та WebSocket-сповіщеннями.

## Стек

- Node.js (ES Modules)
- Express, EJS, express-ejs-layouts
- express-session, bcrypt
- mysql2, Socket.io, joi

## Вимоги

- MySQL або MariaDB (запущений локально)

## Підготовка бази даних

1. Відкрий MySQL-клієнт (phpMyAdmin, DBeaver або термінал):

```sql
mysql -u root -p
```

2. Імпортуй схему:

```bash
mysql -u root -p < user_management_pro.sql
```

або через phpMyAdmin: **Import → вибери файл `user_management_pro.sql`**.

База даних та таблиці створяться автоматично. Назва БД: `user_management_pro`.

Підключення налаштовано у `config/db.js`:
```
host: localhost
user: root
password: (порожній)
database: user_management_pro
```

Якщо у тебе інший пароль — відредагуй `config/db.js`.

## Встановлення та запуск

```bash
cd lab3
npm install
npm run dev     # розробка (nodemon)
# або
npm start       # продакшн (node)
```

Відкрий у браузері: [http://localhost:3000](http://localhost:3000)

## Маршрути (веб)

| URL | Опис |
|-----|------|
| `/auth/login` | Вхід |
| `/users` | Список користувачів |
| `/users/:id` | Деталі користувача |
| `/contacts` | Список контактів |

## REST API

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/api/users` | Всі користувачі |
| POST | `/api/users` | Створити |
| PUT | `/api/users/:id` | Оновити |
| DELETE | `/api/users/:id` | Видалити |
| GET | `/api/contacts` | Всі контакти |

## Структура

```
lab3/
├── app.js
├── config/
│   ├── db.js           # MySQL підключення
│   └── auth.js
├── controllers/
├── middleware/
├── models/
├── routes/
│   ├── api/
│   └── web/
├── services/
├── sockets/
├── views/
├── user_management_pro.sql   # схема БД
└── Звіт.md                   # технічний звіт по виправленим багам
```
