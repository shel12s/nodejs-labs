import express from "express";
import { contactController } from "../../controllers/contactController.js";
import { authOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();

// ВИПРАВЛЕННЯ: специфічні маршрути (/edit/:id, /delete/:id)
// розміщені ДО параметричного /:userId, щоб не було конфлікту маршрутів

router.get("/edit/:id", authOnly, contactController.editPage);
router.post("/edit/:id", authOnly, contactController.update);

router.post("/delete/:id", authOnly, contactController.delete);

router.get("/:userId", authOnly, contactController.list);
router.get("/:userId/create", authOnly, contactController.createPage);
router.post("/:userId/create", authOnly, contactController.create);

export default router;
