import { Router } from "express";
import { customerController } from "./customer.controller.js";

const router = Router();

router.get(
  "/",
  customerController.getCustomers.bind(customerController),
);

router.get(
  "/:id",
  customerController.getCustomerById.bind(customerController),
);

router.post(
  "/",
  customerController.createCustomer.bind(customerController),
);

router.patch(
  "/:id",
  customerController.updateCustomer.bind(customerController),
);

router.patch(
  "/:id/deactivate",
  customerController.deactivateCustomer.bind(customerController),
);

export default router;