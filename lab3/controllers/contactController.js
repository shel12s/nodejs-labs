import { contactService } from "../services/contactService.js";
import { userService } from "../services/userService.js";

export const contactController = {

    async list(req, res, next) {
        try {
            // ОПТИМІЗАЦІЯ: паралельний запит user та contacts через Promise.all
            const [user, contacts] = await Promise.all([
                userService.getUserById(req.params.userId),
                contactService.getContacts(req.params.userId)
            ]);

            if (!user) return res.status(404).send("Користувача не знайдено");

            res.render("contacts/list", {
                title: `Контакти користувача ${user.name}`,
                user,
                contacts
            });
        } catch (err) {
            next(err);
        }
    },

    async createPage(req, res, next) {
        try {
            res.render("contacts/form", {
                title: "Створити контакт",
                userId: req.params.userId,
                contact: null
            });
        } catch (err) {
            next(err);
        }
    },

    async create(req, res, next) {
        try {
            const { phone, address, type } = req.body;
            await contactService.createContact({
                user_id: req.params.userId,
                phone,
                address,
                type
            });
            res.redirect(`/contacts/${req.params.userId}`);
        } catch (err) {
            next(err);
        }
    },

    async editPage(req, res, next) {
        try {
            const contact = await contactService.getContactById(req.params.id);
            if (!contact) return res.status(404).send("Контакт не знайдено");

            res.render("contacts/form", {
                title: "Редагувати контакт",
                userId: contact.user_id,
                contact
            });
        } catch (err) {
            next(err);
        }
    },

    async update(req, res, next) {
        try {
            const { phone, address, type, user_id } = req.body;
            await contactService.updateContact(req.params.id, { phone, address, type });
            res.redirect(`/contacts/${user_id}`);
        } catch (err) {
            next(err);
        }
    },

    async delete(req, res, next) {
        try {
            const contact = await contactService.deleteContact(req.params.id);
            res.redirect(`/contacts/${contact.user_id}`);
        } catch (err) {
            next(err);
        }
    }
};
