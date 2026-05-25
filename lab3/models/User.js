import { db } from "../config/db.js";

export const User = {
    async findAll({ search = "", limit = 10, offset = 0, sort = "id", order = "ASC" }) {
        const query = `
            SELECT * FROM users
            WHERE name LIKE ?
            ORDER BY ${sort} ${order}
            LIMIT ?
            OFFSET ?
        `;
        const [rows] = await db.query(query, [`%${search}%`, limit, offset]);
        return rows;
    },

    async count(search = "") {
        const [rows] = await db.query(
            "SELECT COUNT(*) AS total FROM users WHERE name LIKE ?",
            [`%${search}%`]
        );
        return rows[0].total;
    },

    async findById(id) {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0] || null;
    },

    async findByEmail(email) {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows[0] || null;
    },

    async create({ name, email, password, age, role }) {
        const query = `
            INSERT INTO users (name, email, password, age, role)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [name, email, password, age, role]);
        return result.insertId;
    },

    async update(id, { name, email, age, role }) {
        const query = `
            UPDATE users SET name=?, email=?, age=?, role=? WHERE id=?
        `;
        await db.query(query, [name, email, age, role, id]);
    },

    async updatePassword(id, password) {
        await db.query("UPDATE users SET password=? WHERE id=?", [password, id]);
    },

    async delete(id) {
        await db.query("DELETE FROM users WHERE id=?", [id]);
    }
};
