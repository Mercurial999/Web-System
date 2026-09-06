import { Request, Response } from "express";
import { customerService } from "./customer.service.js";

export class CustomerController {
  private customerService = customerService;

  async getCustomers(req: Request, res: Response) {
    const customers = await this.customerService.getCustomers();

    return res.status(200).json({
      success: true,
      data: customers,
    });
  }

  async getCustomerById(req: Request, res: Response) {
  const id = Number(req.params.id);

  const customer = await this.customerService.getCustomerById(id);

  return res.status(200).json({
    success: true,
    data: customer,
  });
}

async createCustomer(req: Request, res: Response) {
  const customer = await this.customerService.createCustomer(req.body);

  return res.status(201).json({
    success: true,
    data: customer,
  });
}

async updateCustomer(req: Request, res: Response) {
  const id = Number(req.params.id);

  const customer = await this.customerService.updateCustomer(
    id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    data: customer,
  });
}

async deactivateCustomer(req: Request, res: Response) {
  const id = Number(req.params.id);

  const customer = await this.customerService.deactivateCustomer(id);

  return res.status(200).json({
    success: true,
    data: customer,
  });
}
}

export const customerController = new CustomerController();