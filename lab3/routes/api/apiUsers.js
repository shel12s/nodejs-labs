import express from "express";
import { userService } from "../../services/userService.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const data = await userService.getUsers({ limit: 100 });
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "Користувача не знайдено" });
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const id = await userService.createUser(req.body);
        res.status(201).json({ success: true, id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        await userService.updateUser(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export default router;
