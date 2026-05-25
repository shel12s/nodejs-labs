import { userService } from "../services/userService.js";
import { contactService } from "../services/contactService.js";

export const userController = {

    async dashboard(req, res, next) {
        try {
            const { users } = await userService.getUsers({ limit: 5 });
            res.render("dashboard", { title: "Dashboard", users });
        } catch (err) {
            next(err);
        }
    },

    async list(req, res, next) {
        try {
            const search = req.query.search || "";
            const page = Number(req.query.page || 1);
            const limit = 5;
            const offset = (page - 1) * limit;

            const { users, total } = await userService.getUsers({
                search,
                limit,
                offset,
                sort: "created_at",
                order: "DESC"
            });

            const pages = Math.ceil(total / limit);

            res.render("users/list", {
                title: "Список користувачів",
                users,
                search,
                page,
                pages
            });
        } catch (err) {
            next(err);
        }
    },

    createPage(req, res) {
        res.render("users/create", {
            title: "Створення користувача",
            error: null
        });
    },

    async create(req, res, next) {
        const { name, email, password, age, role } = req.body;

        try {
            await userService.createUser({ name, email, password, age, role });
            req.app.get("io").emit("user:created", { name, email });
            res.redirect("/users");
        } catch (err) {
            res.render("users/create", {
                title: "Створення користувача",
                error: err.message
            });
        }
    },

    async details(req, res, next) {
        try {
            // ОПТИМІЗАЦІЯ: паралельний запит через Promise.all —
            // user та contacts не залежать одне від одного
            const [user, contacts] = await Promise.all([
                userService.getUserById(req.params.id),
                contactService.getContacts(req.params.id)
            ]);

            if (!user) {
                return res.status(404).send("Користувача не знайдено");
            }

            res.render("users/details", {
                title: `Профіль: ${user.name}`,
                user,
                contacts
            });
        } catch (err) {
            next(err);
        }
    },

    async editPage(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);

            if (!user) return res.status(404).send("Користувача не знайдено");

            res.render("users/edit", {
                title: `Редагування: ${user.name}`,
                user
            });
        } catch (err) {
            next(err);
        }
    },

    async update(req, res, next) {
        try {
            const { name, email, age, role } = req.body;
            await userService.updateUser(req.params.id, { name, email, age, role });
            req.app.get("io").emit("user:updated", { id: req.params.id, name });
            res.redirect("/users");
        } catch (err) {
            next(err);
        }
    },

    async delete(req, res, next) {
        try {
            await userService.deleteUser(req.params.id);
            req.app.get("io").emit("user:deleted", { id: req.params.id });
            res.redirect("/users");
        } catch (err) {
            next(err);
        }
    }
};
