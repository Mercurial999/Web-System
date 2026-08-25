import { Router } from "express";

import { permissionController } from "./permission.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/permission.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("permissions.read"),
  permissionController.getAll.bind(permissionController)
);

router.get(
  "/:id",
  authenticate,
  authorize("permissions.read"),
  permissionController.getById.bind(permissionController)
);

export default router;