import { Router } from "express";
import { reportsController } from "./reports.controller.js";

const router = Router();

router.get(
  "/sales/summary",
  reportsController.getSalesSummary.bind(reportsController),
);

router.get(
  "/sales/details",
  reportsController.getSalesDetails.bind(reportsController),
);

router.get(
  "/sales/products",
  reportsController.getProductSales.bind(reportsController),
);

router.get(
  "/sales/customers",
  reportsController.getCustomerSales.bind(reportsController),
);

router.get(
  "/inventory",
  reportsController.getInventoryReport.bind(reportsController),
);

router.get(
  "/stock-movements",
  reportsController.getStockMovementReport.bind(reportsController),
);

router.get(
  "/deliveries",
  reportsController.getDeliveryReport.bind(reportsController),
);

export default router;