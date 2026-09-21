import { reportsService } from "./reports.service.js";
export class ReportsController {
    reportsService = reportsService;
    async getSalesSummary(req, res) {
        const from = typeof req.query.from === "string"
            ? req.query.from
            : undefined;
        const to = typeof req.query.to === "string"
            ? req.query.to
            : undefined;
        const summary = await this.reportsService.getSalesSummary(from, to);
        return res.status(200).json({
            success: true,
            data: summary,
        });
    }
    async getSalesDetails(req, res) {
        const from = typeof req.query.from === "string"
            ? req.query.from
            : undefined;
        const to = typeof req.query.to === "string"
            ? req.query.to
            : undefined;
        const details = await this.reportsService.getSalesDetails(from, to);
        return res.status(200).json({
            success: true,
            data: details,
        });
    }
    async getProductSales(req, res) {
        const from = typeof req.query.from === "string"
            ? req.query.from
            : undefined;
        const to = typeof req.query.to === "string"
            ? req.query.to
            : undefined;
        const productSales = await this.reportsService.getProductSales(from, to);
        return res.status(200).json({
            success: true,
            data: productSales,
        });
    }
    async getCustomerSales(req, res) {
        const from = typeof req.query.from === "string"
            ? req.query.from
            : undefined;
        const to = typeof req.query.to === "string"
            ? req.query.to
            : undefined;
        const customerSales = await this.reportsService.getCustomerSales(from, to);
        return res.status(200).json({
            success: true,
            data: customerSales,
        });
    }
    async getInventoryReport(req, res) {
        const inventory = await this.reportsService.getInventoryReport();
        return res.status(200).json({
            success: true,
            data: inventory,
        });
    }
    async getStockMovementReport(req, res) {
        const from = typeof req.query.from === "string" ? req.query.from : undefined;
        const to = typeof req.query.to === "string" ? req.query.to : undefined;
        const movements = await this.reportsService.getStockMovementReport(from, to);
        return res.status(200).json({
            success: true,
            data: movements,
        });
    }
    async getDeliveryReport(req, res) {
        const from = typeof req.query.from === "string" ? req.query.from : undefined;
        const to = typeof req.query.to === "string" ? req.query.to : undefined;
        const deliveries = await this.reportsService.getDeliveryReport(from, to);
        return res.status(200).json({
            success: true,
            data: deliveries,
        });
    }
}
export const reportsController = new ReportsController();
