import { customerService } from "./customer.service.js";
export class CustomerController {
    customerService = customerService;
    async getCustomers(req, res) {
        const customers = await this.customerService.getCustomers();
        return res.status(200).json({
            success: true,
            data: customers,
        });
    }
    async getCustomerById(req, res) {
        const id = Number(req.params.id);
        const customer = await this.customerService.getCustomerById(id);
        return res.status(200).json({
            success: true,
            data: customer,
        });
    }
    async createCustomer(req, res) {
        const customer = await this.customerService.createCustomer(req.body);
        return res.status(201).json({
            success: true,
            data: customer,
        });
    }
    async updateCustomer(req, res) {
        const id = Number(req.params.id);
        const customer = await this.customerService.updateCustomer(id, req.body);
        return res.status(200).json({
            success: true,
            data: customer,
        });
    }
    async deactivateCustomer(req, res) {
        const id = Number(req.params.id);
        const customer = await this.customerService.deactivateCustomer(id);
        return res.status(200).json({
            success: true,
            data: customer,
        });
    }
}
export const customerController = new CustomerController();
