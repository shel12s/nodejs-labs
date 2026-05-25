import bcrypt from "bcrypt";
import { User } from "../models/User.js";

export const authController = {

    showLogin(req, res) {
        res.render("auth/login", {
            title: "Вхід до системи",
            error: null
        });
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);

            // ВИПРАВЛЕННЯ: оригінал порівнював рядки напряму (password !== user.password),
            // що робило вхід неможливим після хешування паролів через bcrypt.hash().
            // Правильно — використовувати bcrypt.compare().
            const isValid = user && await bcrypt.compare(password, user.password);

            if (!isValid) {
                return res.render("auth/login", {
                    title: "Вхід до системи",
                    error: "Невірний email або пароль"
                });
            }

            req.session.user = { id: user.id, name: user.name, role: user.role };
            res.redirect("/dashboard");
        } catch (err) {
            next(err);
        }
    },

    logout(req, res, next) {
        req.session.destroy(err => {
            if (err) return next(err);
            res.redirect("/login");
        });
    }
};
