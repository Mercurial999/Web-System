import { Request, Response } from "express";
import { orderService } from "./order.service.js";

export class OrderController {
  private orderService = orderService;

  async getOrders(req: Request, res: Response) {
    const orders = await this.orderService.getOrders();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  }

  async getOrderById(req: Request, res: Response) {
    const id = Number(req.params.id);

    const order = await this.orderService.getOrderById(id);

    return res.status(200).json({
      success: true,
      data: order,
    });
  }

  async createOrder(req: Request, res: Response) {
    const order = await this.orderService.createOrder(req.body);

    return res.status(201).json({
      success: true,
      data: order,
    });
  }

  async addOrderItem(req: Request, res: Response) {
    const orderId = Number(req.params.id);

    const item = await this.orderService.addOrderItem(
      orderId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      data: item,
    });
  }

  async updateOrderItem(req: Request, res: Response) {
    const orderId = Number(req.params.id);
    const itemId = Number(req.params.itemId);

    const item = await this.orderService.updateOrderItem(
      orderId,
      itemId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      data: item,
    });
  }

  async deleteOrderItem(req: Request, res: Response) {
    const orderId = Number(req.params.id);
    const itemId = Number(req.params.itemId);

    const item = await this.orderService.deleteOrderItem(
      orderId,
      itemId,
    );

    return res.status(200).json({
      success: true,
      data: item,
    });
  }

  async updateOrder(req: Request, res: Response) {
    const id = Number(req.params.id);

    const order = await this.orderService.updateOrder(
      id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      data: order,
    });
  }

  async confirmOrder(req: Request, res: Response) {
    const id = Number(req.params.id);

    const order = await this.orderService.confirmOrder(id);

    return res.status(200).json({
      success: true,
      data: order,
    });
  }

  async cancelOrder(req: Request, res: Response) {
    const id = Number(req.params.id);

    const order = await this.orderService.cancelOrder(id);

    return res.status(200).json({
      success: true,
      data: order,
    });
  }
}

export const orderController = new OrderController();