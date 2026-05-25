const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json');

// ─── Допоміжні функції для роботи з файлом ───────────────────────────────────

function readTasks() {
  const raw = fs.readFileSync(TASKS_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// ─── Налаштування EJS ─────────────────────────────────────────────────────────

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Статичні файли ───────────────────────────────────────────────────────────

app.use(express.static(path.join(__dirname, 'public')));

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Власний логер
app.use((req, res, next) => {
  const now = new Date().toLocaleTimeString('uk-UA');
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

// ─── Маршрути ─────────────────────────────────────────────────────────────────

// GET / — головна сторінка
app.get('/', (req, res) => {
  res.render('index', { title: 'Task Manager' });
});

// GET /tasks — список задач (з фільтрацією за ?status=)
app.get('/tasks', (req, res) => {
  let tasks = readTasks();
  const statusFilter = req.query.status;

  if (statusFilter) {
    tasks = tasks.filter(t => t.status === statusFilter);
  }

  res.render('tasks', {
    title: 'Список задач',
    tasks,
    statusFilter: statusFilter || ''
  });
});

// GET /tasks/:id — деталі задачі
app.get('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === parseInt(req.params.id));

  if (!task) {
    return res.status(404).render('404', { title: '404 - Не знайдено' });
  }

  res.render('task', { title: task.title, task });
});

// GET /add — форма додавання
app.get('/add', (req, res) => {
  res.render('add', { title: 'Нова задача' });
});

// POST /add — збереження нової задачі
app.post('/add', (req, res) => {
  const tasks = readTasks();
  const { title, status } = req.body;

  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title: title.trim(),
    status: status || 'pending'
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.redirect('/tasks');
});

// POST /tasks/:id/delete — видалення задачі
app.post('/tasks/:id/delete', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  writeTasks(tasks);
  res.redirect('/tasks');
});

// 404 для всіх інших маршрутів
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Не знайдено' });
});

// ─── Запуск сервера ───────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
