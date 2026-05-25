const socket = io();

function showToast(msg, type = "info") {
    const box = document.createElement("div");
    box.className = "toast " + type;
    box.textContent = msg;

    document.body.appendChild(box);

    setTimeout(() => box.remove(), 3000);
}

socket.on("user:created", data => {
    showToast(`Новий користувач: ${data.name}`, "success");
});

socket.on("user:updated", data => {
    showToast(`Оновлено користувача ID=${data.id}`, "info");
});

socket.on("user:deleted", data => {
    showToast(`Видалено користувача ID=${data.id}`, "error");
});

document.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {
        if (!confirm("Ви впевнені, що хочете видалити?")) {
            e.preventDefault();
        }
    }
});

function highlightRow(id) {
    const row = document.querySelector(`[data-user="${id}"]`);
    if (!row) return;

    row.classList.add("highlight");
    setTimeout(() => row.classList.remove("highlight"), 2000);
}

socket.on("user:created", data => highlightRow(data.id));
socket.on("user:updated", data => highlightRow(data.id));
socket.on("server:hello", msg => {
    console.log("%c" + msg, "color: green; font-weight: bold;");
});
