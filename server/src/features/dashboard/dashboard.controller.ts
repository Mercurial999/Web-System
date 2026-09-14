import { Request, Response } from "express";
import { dashboardService } from "./dashboard.service.js";

export class DashboardController {
  private dashboardService = dashboardService;

  async getSalesSummary(
    req: Request,
    res: Response,
  ) {
    const sales =
      await this.dashboardService.getSalesSummary();

    return res.status(200).json({
      success: true,
      data: sales,
    });
  }

  async getDeliverySummary(
  req: Request,
  res: Response,
    ) {
    const deliveries =
        await this.dashboardService.getDeliverySummary();

    return res.status(200).json({
        success: true,
        data: deliveries,
    });
    }

      async getInventorySummary(
    req: Request,
    res: Response,
  ) {
    const inventory =
      await this.dashboardService.getInventorySummary();

    return res.status(200).json({
      success: true,
      data: inventory,
    });
  }

  async getTopSellingProducts(
  req: Request,
  res: Response,
) {
  const products =
    await this.dashboardService.getTopSellingProducts();

  return res.status(200).json({
    success: true,
    data: products,
  });
}

async getProductsInDemand(
  req: Request,
  res: Response,
) {
  const products =
    await this.dashboardService.getProductsInDemand();

  return res.status(200).json({
    success: true,
    data: products,
  });
}

async getRecentOrders(
  req: Request,
  res: Response,
) {
  const orders =
    await this.dashboardService.getRecentOrders();

  return res.status(200).json({
    success: true,
    data: orders,
  });
}

async getOrders(
  req: Request,
  res: Response,
) {
  const status = req.query.status as
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED"
    | undefined;

  const customerId = req.query.customerId
    ? Number(req.query.customerId)
    : undefined;

  const from = req.query.from as
    | string
    | undefined;

  const to = req.query.to as
    | string
    | undefined;

  const limit = req.query.limit
  ? Number(req.query.limit)
  : undefined;

  const orders =
    await this.dashboardService.getOrders({
      status,
      customerId,
      from,
      to,
      limit,
    });

  return res.status(200).json({
    success: true,
    data: orders,
  });
}

async getDeliveries(
  req: Request,
  res: Response,
) {
  const status = req.query.status as
    | "DRAFT"
    | "COMPLETED"
    | "CANCELLED"
    | undefined;

  const customerId = req.query.customerId
    ? Number(req.query.customerId)
    : undefined;

  const from = req.query.from as
    | string
    | undefined;

  const to = req.query.to as
    | string
    | undefined;

  const limit = req.query.limit
  ? Number(req.query.limit)
  : undefined;

  const deliveries =
    await this.dashboardService.getDeliveries({
      status,
      customerId,
      from,
      to,
      limit,
    });

  return res.status(200).json({
    success: true,
    data: deliveries,
  });
}

async getRecentDeliveries(
  req: Request,
  res: Response,
) {
  const deliveries =
    await this.dashboardService.getRecentDeliveries();

  return res.status(200).json({
    success: true,
    data: deliveries,
  });
}

async getSummary(
  req: Request,
  res: Response,
) {
  const summary =
    await this.dashboardService.getSummary();

  return res.status(200).json({
    success: true,
    data: summary,
  });
}

}

export const dashboardController =
  new DashboardController();