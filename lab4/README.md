# Lab 4 — Система управління інвентарем

Застосунок для обліку товарів на складі з аутентифікацією, двома ролями та автоматичними сповіщеннями при низькому залишку.

## Стек

- Node.js, Express, EJS, express-ejs-layouts
- Mongoose (MongoDB)
- bcrypt, express-session, connect-flash

## Патерни проєктування

| Патерн | Файл | Опис |
|--------|------|------|
| Singleton | `config/database.js` | Одне підключення до MongoDB |
| Factory | `services/UserFactory.js` | Створення користувачів за роллю |
| Observer | `services/InventoryObserver.js` | Сповіщення про транзакції та низький залишок |

## Вимоги

- MongoDB (запущений локально на порту `27017`)

### Запуск MongoDB

```bash
# Linux/Mac
sudo systemctl start mongod
# або
mongod --dbpath /data/db
```

База даних створюється автоматично при першому запуску. Назва: `inventory_lab4`.

## Встановлення та запуск

```bash
cd lab4
npm install
npm run dev     # розробка (nodemon)
# або
npm start       # продакшн (node)
```

Відкрий у браузері: [http://localhost:3000](http://localhost:3000)

## Перший запуск

1. Відкрий [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
2. Зареєструй акаунт з роллю **Admin**
3. Увійди та починай додавати товари

## Ролі

| Роль | Можливості |
|------|-----------|
| `admin` | Перегляд, додавання, редагування, видалення товарів |
| `user` | Перегляд товарів, списання кількості |

## Маршрути

| URL | Опис |
|-----|------|
| `/dashboard` | Панель з статистикою та сповіщеннями |
| `/items` | Список товарів |
| `/items/add` | Додати товар (admin) |
| `/items/:id` | Деталі + списання |
| `/items/:id/edit` | Редагувати (admin) |
| `/history` | Журнал транзакцій |
| `/auth/login` | Вхід |
| `/auth/register` | Реєстрація |

## Структура

```
lab4/
├── app.js
├── config/
│   └── database.js         # Singleton
├── services/
│   ├── UserFactory.js      # Factory
│   └── InventoryObserver.js # Observer
├── models/
│   ├── User.js
│   ├── Item.js
│   └── History.js
├── controllers/
├── middleware/
│   └── authMiddleware.js   # authOnly / adminOnly / guestOnly
├── routes/
└── views/
```
