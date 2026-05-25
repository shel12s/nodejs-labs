import express from "express";
import { contactService } from "../../services/contactService.js";

const router = express.Router();

router.get("/:userId", async (req, res, next) => {
    try {
        const contacts = await contactService.getContacts(req.params.userId);
        res.json(contacts);
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const id = await contactService.createContact(req.body);
        res.status(201).json({ success: true, id });
    } catch (err) {
        next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        await contactService.updateContact(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await contactService.deleteContact(req.params.id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export default router;
