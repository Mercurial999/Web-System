import { Router } from "express";
import { dashboardController } from "./dashboard.controller.js";
import { validateQuery } from "../../middleware/validate-query.middleware.js";

import {
  dashboardOrdersQuerySchema,
  dashboardDeliveriesQuerySchema,
} from "./dashboard.validation.js";

const router = Router();

router.get(
  "/sales",
  dashboardController.getSalesSummary.bind(
    dashboardController,
  ),
);

router.get(
  "/deliveries",
  dashboardController.getDeliverySummary.bind(
    dashboardController,
  ),
);

router.get(
  "/deliveries/list",
  validateQuery(dashboardDeliveriesQuerySchema),
  dashboardController.getDeliveries.bind(
    dashboardController,
  ),
)

router.get(
  "/inventory",
  dashboardController.getInventorySummary.bind(
    dashboardController,
  ),
);

router.get(
  "/top-selling",
  dashboardController.getTopSellingProducts.bind(
    dashboardController,
  ),
);

router.get(
  "/in-demand",
  dashboardController.getProductsInDemand.bind(
    dashboardController,
  ),
);

router.get(
  "/recent-orders",
  dashboardController.getRecentOrders.bind(
    dashboardController,
  ),
);

router.get(
  "/orders",
  validateQuery(dashboardOrdersQuerySchema),
  dashboardController.getOrders.bind(
    dashboardController,
  ),
);

router.get(
  "/recent-deliveries",
  dashboardController.getRecentDeliveries.bind(
    dashboardController,
  ),
);

router.get(
  "/summary",
  dashboardController.getSummary.bind(
    dashboardController,
  ),
);

export default router;