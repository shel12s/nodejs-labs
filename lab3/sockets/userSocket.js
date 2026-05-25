export function initUserSocket(io) {

    console.log("Socket.io: запущено");

    io.on("connection", socket => {
        console.log("Новий клієнт підключився:", socket.id);

        socket.emit("server:hello", "Підключення встановлено!");

        socket.on("disconnect", () => {
            console.log("Клієнт відключився:", socket.id);
        });
    });
}
