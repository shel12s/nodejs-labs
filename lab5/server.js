const express = require('express');
const http    = require('http');
const path    = require('path');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server);

const PORT = 3000;

// ─── Static files ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Socket.io Middleware — авторизація ──────────────────────────────────────
// Клієнт передає ім'я через socket.handshake.auth.username.
// Якщо ім'я відсутнє або коротше 2 символів — відхиляємо підключення.
io.use((socket, next) => {
  const username = socket.handshake.auth.username;

  if (!username || typeof username !== 'string' || username.trim().length < 2) {
    return next(new Error('Ім\'я має містити щонайменше 2 символи.'));
  }

  // Зберігаємо ім'я у socket.data для подальшого використання
  socket.data.username = username.trim();
  next();
});

// ─── Підключення клієнта ─────────────────────────────────────────────────────
io.on('connection', (socket) => {
  const username = socket.data.username;

  console.log(`[connect]    socket.id=${socket.id}  username="${username}"`);

  // Повідомляємо всіх ІНШИХ, що новий користувач увійшов
  socket.broadcast.emit('user:joined', { username });

  // ── Обробка повідомлень ──────────────────────────────────────────────────
  // Клієнт надсилає: socket.emit('message:send', text, callback)
  // Сервер повертає через callback: { ok: true } або { ok: false, error: '...' }
  socket.on('message:send', (text, ack) => {
    // Валідація
    if (typeof text !== 'string' || text.trim().length === 0) {
      return ack({ ok: false, error: 'Повідомлення не може бути порожнім.' });
    }
    if (text.trim().length > 300) {
      return ack({ ok: false, error: 'Повідомлення не може перевищувати 300 символів.' });
    }

    // Формуємо об'єкт повідомлення
    const message = {
      author: username,
      text:   text.trim(),
      time:   new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    };

    // Підтверджуємо відправнику
    ack({ ok: true });

    // Розсилаємо всім (включно з відправником)
    io.emit('message:new', message);
  });

  // ── Відключення ─────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[disconnect] socket.id=${socket.id}  username="${username}"`);

    // Повідомляємо всіх, що користувач вийшов
    io.emit('user:left', { username });
  });
});

// ─── Запуск сервера ──────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`);
});
