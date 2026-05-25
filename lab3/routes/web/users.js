import express from "express";
import { userController } from "../../controllers/userController.js";
import { authOnly, adminOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();

// ВИПРАВЛЕННЯ: специфічні маршрути (/create, /edit/:id, /delete/:id)
// розміщені ДО параметричного /:id, щоб Express не поглинав їх як ID

router.get("/create", adminOnly, userController.createPage);
router.post("/create", adminOnly, userController.create);

router.get("/edit/:id", adminOnly, userController.editPage);
router.post("/edit/:id", adminOnly, userController.update);

router.post("/delete/:id", adminOnly, userController.delete);

router.get("/", authOnly, userController.list);
router.get("/:id", authOnly, userController.details);

export default router;
