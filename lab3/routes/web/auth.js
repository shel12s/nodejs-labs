import express from "express";
import { authController } from "../../controllers/authController.js";
import { userController } from "../../controllers/userController.js";
import { guestOnly, authOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/login", guestOnly, authController.showLogin);
router.post("/login", guestOnly, authController.login);
router.get("/logout", authOnly, authController.logout);

// ВИПРАВЛЕННЯ: логіка dashboard перенесена з маршруту до userController.dashboard,
// щоб не дублювати запити до БД і дотримуватись шару контролерів
router.get("/dashboard", authOnly, userController.dashboard);

export default router;
