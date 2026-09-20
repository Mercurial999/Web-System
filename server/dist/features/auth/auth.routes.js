import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { loginSchema } from "./auth.validation.js";
import { authenticate } from "../../middleware/auth.middleware.js";
const router = Router();
router.post("/login", validate(loginSchema), authController.login.bind(authController));
router.get("/permissions", authenticate, authController.getPermissions.bind(authController));
export default router;
