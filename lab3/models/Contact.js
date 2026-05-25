import { db } from "../config/db.js";

export const Contact = {

    async findByUser(userId) {
        const [rows] = await db.query(
            "SELECT * FROM contacts WHERE user_id = ?",
            [userId]
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query(
            "SELECT * FROM contacts WHERE id = ?",
            [id]
        );
        return rows[0] || null;
    },

    async create({ user_id, phone, address, type }) {
        const query = `
            INSERT INTO contacts (user_id, phone, address, type)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [user_id, phone, address, type]);
        return result.insertId;
    },

    async update(id, { phone, address, type }) {
        const query = `
            UPDATE contacts SET phone=?, address=?, type=? WHERE id=?
        `;
        await db.query(query, [phone, address, type, id]);
    },

    async delete(id) {
        await db.query("DELETE FROM contacts WHERE id=?", [id]);
    }
};
