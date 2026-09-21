import { Request, Response } from "express";
import { salesService } from "./sales.service.js";

export class SalesController {
  async getSalesSummary(req: Request, res: Response) {
    const summary = await salesService.getSalesSummary();

    return res.status(200).json({
      success: true,
      data: summary,
    });
  }
}

export const salesController = new SalesController();