import { db } from "../config/db.js";

export const LogService = {

    async add(message) {
        await db.query(
            "INSERT INTO logs (message) VALUES (?)",
            [message]
        );
    },

    async getRecent(limit = 10) {
        const [rows] = await db.query(
            "SELECT * FROM logs ORDER BY created_at DESC LIMIT ?",
            [limit]
        );
        return rows;
    }
};
