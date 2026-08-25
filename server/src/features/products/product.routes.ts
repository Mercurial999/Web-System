import { Router } from "express";

import { ProductController } from "./product.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";

import {
  createProductSchema,
  updateProductSchema,
} from "./product.validation.js";

const router = Router();

const controller = new ProductController();

router.get(
  "/",
  authenticate,
  authorize("products.read"),
  controller.getAll.bind(controller)
);

router.get(
  "/:id",
  authenticate,
  authorize("products.read"),
  controller.getById.bind(controller)
);

router.post(
  "/",
  authenticate,
  authorize("products.create"),
  validate(createProductSchema),
  controller.create.bind(controller)
);

router.put(
  "/:id",
  authenticate,
  authorize("products.update"),
  validate(updateProductSchema),
  controller.update.bind(controller)
);

router.delete(
  "/:id",
  authenticate,
  authorize("products.delete"),
  controller.delete.bind(controller)
);

export default router;