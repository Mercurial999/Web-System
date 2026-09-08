import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";

import {
  createStockMovementSchema,
} from "./stock-movement.validation.js";

import {
  stockMovementController,
} from "./stock-movement.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("inventory.read"),
  stockMovementController.getAll.bind(
    stockMovementController
  )
);

router.get(
  "/inventory/:inventoryId",
  authenticate,
  authorize("inventory.read"),
  stockMovementController.getByInventoryId.bind(
    stockMovementController
  )
);

router.get(
  "/:id",
  authenticate,
  authorize("inventory.read"),
  stockMovementController.getById.bind(
    stockMovementController
  )
);

router.post(
  "/",
  authenticate,
  authorize("inventory.update"),
  validate(createStockMovementSchema),
  stockMovementController.create.bind(
    stockMovementController
  )
);

export default router;