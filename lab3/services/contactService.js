import { Contact } from "../models/Contact.js";
import { LogService } from "./logService.js";

export const contactService = {

    async getContacts(userId) {
        return await Contact.findByUser(userId);
    },

    async getContactById(id) {
        return await Contact.findById(id);
    },

    async createContact({ user_id, phone, address, type }) {

        const id = await Contact.create({
            user_id,
            phone,
            address,
            type
        });

        await LogService.add(`Додано контакт для user_id=${user_id}`);

        return id;
    },

    async updateContact(id, data) {
        await Contact.update(id, data);
        await LogService.add(`Оновлено контакт ID=${id}`);
    },

    async deleteContact(id) {
        const contact = await Contact.findById(id);
        await Contact.delete(id);

        await LogService.add(`Видалено контакт ID=${id}`);
        return contact;
    }
};
