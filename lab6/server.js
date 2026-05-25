const express = require('express');
const http    = require('http');
const path    = require('path');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);

// CORS дозволений для будь-якого origin (потрібно для розробки)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const PORT = 3000;

// ─── Кімнати: Map<roomName, Set<socketId>> ────────────────────────────────
const rooms = new Map();

// ─── Статичні файли ───────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Допоміжна функція: вихід із кімнати ─────────────────────────────────
function leaveRoom(socket) {
  const roomName = socket.data.roomName;
  if (!roomName) return;

  const room = rooms.get(roomName);
  if (room) {
    room.delete(socket.id);
    if (room.size === 0) rooms.delete(roomName);
  }

  // Сповіщаємо решту учасників кімнати
  socket.to(roomName).emit('peer-left', { peerId: socket.id });
  socket.leave(roomName);
  socket.data.roomName = null;

  console.log(`[leave-room] socket.id=${socket.id} room="${roomName}"`);
}

// ─── Підключення ─────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[connect]    socket.id=${socket.id}`);

  // ── Приєднання до кімнати ─────────────────────────────────────────────
  socket.on('join-room', (roomName) => {
    if (!rooms.has(roomName)) {
      rooms.set(roomName, new Set());
    }

    const room  = rooms.get(roomName);
    const peers = [...room]; // список ID існуючих учасників

    room.add(socket.id);
    socket.join(roomName);
    socket.data.roomName = roomName;

    console.log(`[join-room]  socket.id=${socket.id} room="${roomName}" peers=${peers.length}`);

    // Новому учаснику — список існуючих пірів
    socket.emit('room-joined', { peers });

    // Решті учасників кімнати — повідомлення про нового піра
    socket.to(roomName).emit('peer-joined', { peerId: socket.id });
  });

  // ── Вихід із кімнати (без відключення сокета) ─────────────────────────
  socket.on('leave-room', () => {
    leaveRoom(socket);
  });

  // ── Сигналізація: сервер лише пересилає повідомлення потрібному пірові ─
  socket.on('offer', ({ targetId, offer }) => {
    io.to(targetId).emit('offer', { fromId: socket.id, offer });
  });

  socket.on('answer', ({ targetId, answer }) => {
    io.to(targetId).emit('answer', { fromId: socket.id, answer });
  });

  socket.on('ice-candidate', ({ targetId, candidate }) => {
    io.to(targetId).emit('ice-candidate', { fromId: socket.id, candidate });
  });

  // ── Відключення ───────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[disconnect] socket.id=${socket.id}`);
    leaveRoom(socket);
  });
});

// ─── Запуск ───────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`);
});
