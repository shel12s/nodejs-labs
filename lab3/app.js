import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import expressLayouts from "express-ejs-layouts";

import { sessionConfig } from "./config/auth.js";
import { initUserSocket } from "./sockets/userSocket.js";

import authWebRoutes from "./routes/web/auth.js";
import userWebRoutes from "./routes/web/users.js";
import contactWebRoutes from "./routes/web/contacts.js";

import apiUserRoutes from "./routes/api/apiUsers.js";
import apiContactRoutes from "./routes/api/apiContacts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));

// Передаємо user та title у всі шаблони через res.locals
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.title = "User Management Pro";
    next();
});

// ─── EJS + Layouts ────────────────────────────────────────────────────────────

app.use(expressLayouts);
app.set("layout", "layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ─── Socket.io ────────────────────────────────────────────────────────────────

initUserSocket(io);
app.set("io", io);

// ─── Маршрути ─────────────────────────────────────────────────────────────────

app.use("/", authWebRoutes);
app.use("/users", userWebRoutes);
app.use("/contacts", contactWebRoutes);

app.use("/api/users", apiUserRoutes);
app.use("/api/contacts", apiContactRoutes);

// ─── Глобальний обробник помилок ──────────────────────────────────────────────

app.use((err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.url}:`, err.message);
    res.status(500).send(`<h2>Внутрішня помилка сервера</h2><p>${err.message}</p>`);
});

// ─── Запуск ───────────────────────────────────────────────────────────────────

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
