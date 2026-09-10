import { deliveryService } from "./delivery.service.js";
export class DeliveryController {
    deliveryService = deliveryService;
    async getDeliveries(req, res) {
        const deliveries = await this.deliveryService.getDeliveries();
        return res.status(200).json({
            success: true,
            data: deliveries,
        });
    }
    async getDeliveryById(req, res) {
        const id = Number(req.params.id);
        const delivery = await this.deliveryService.getDeliveryById(id);
        return res.status(200).json({
            success: true,
            data: delivery,
        });
    }
    async createDelivery(req, res) {
        const delivery = await this.deliveryService.createDelivery(req.body);
        return res.status(201).json({
            success: true,
            data: delivery,
        });
    }
    async cancelDelivery(req, res) {
        const id = Number(req.params.id);
        const delivery = await this.deliveryService.cancelDelivery(id);
        return res.status(200).json({
            success: true,
            data: delivery,
        });
    }
    async completeDelivery(req, res) {
        const id = Number(req.params.id);
        const delivery = await this.deliveryService.completeDelivery(id);
        return res.status(200).json({
            success: true,
            data: delivery,
        });
    }
}
export const deliveryController = new DeliveryController();
