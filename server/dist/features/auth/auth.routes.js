import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { loginSchema } from "./auth.validation.js";
const router = Router();
router.post("/login", validate(loginSchema), authController.login.bind(authController));
export default router;
