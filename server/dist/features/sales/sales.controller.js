import { salesService } from "./sales.service.js";
export class SalesController {
    async getSalesSummary(req, res) {
        const summary = await salesService.getSalesSummary();
        return res.status(200).json({
            success: true,
            data: summary,
        });
    }
}
export const salesController = new SalesController();
