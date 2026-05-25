import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { LogService } from "./logService.js";

export const userService = {

    // ОПТИМІЗАЦІЯ: User.findAll і User.count не залежать одне від одного —
    // запускаємо паралельно через Promise.all замість двох послідовних await
    async getUsers(params) {
        const [users, total] = await Promise.all([
            User.findAll(params),
            User.count(params.search)
        ]);
        return { users, total };
    },

    async getUserById(id) {
        return User.findById(id);
    },

    async createUser({ name, email, password, age, role }) {
        const existing = await User.findByEmail(email);
        if (existing) {
            throw new Error("Email вже використовується");
        }

        const hashed = await bcrypt.hash(password, 10);
        const id = await User.create({ name, email, password: hashed, age, role });

        await LogService.add(`Створено користувача "${name}"`);
        return id;
    },

    async updateUser(id, data) {
        await User.update(id, data);
        await LogService.add(`Оновлено користувача ID=${id}`);
    },

    async updatePassword(id, password) {
        const hashed = await bcrypt.hash(password, 10);
        await User.updatePassword(id, hashed);
        await LogService.add(`Оновлено пароль користувача ID=${id}`);
    },

    async deleteUser(id) {
        await User.delete(id);
        await LogService.add(`Видалено користувача ID=${id}`);
    }
};
