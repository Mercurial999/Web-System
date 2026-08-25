import { Router } from "express";

import { userController } from "./user.controller.js";
import { createUserSchema } from "./user.validation.js";
import { updateUserSchema } from "./user.validation.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";


const router = Router();

router.post(
  "/",
  authenticate,
  authorize("users.create"),
  validate(createUserSchema),
  userController.createUser.bind(userController)
);

router.get(
  "/",
  authenticate,
  authorize("users.read"),
  userController.getAllUsers.bind(userController)
);

router.get(
  "/:id",
  authenticate,
  authorize("users.read"),
  userController.getUserById.bind(userController)
);

router.delete(
  "/:id",
  authenticate,
  authorize("users.delete"),
  userController.deleteUser.bind(userController)
);

router.put(
  "/:id",
  authenticate,
  authorize("users.update"),
  validate(updateUserSchema),
  userController.updateUser.bind(userController)
);

export default router;
