import { dashboardService } from "./dashboard.service.js";
export class DashboardController {
    dashboardService = dashboardService;
    async getSalesSummary(req, res) {
        const sales = await this.dashboardService.getSalesSummary();
        return res.status(200).json({
            success: true,
            data: sales,
        });
    }
    async getDeliverySummary(req, res) {
        const deliveries = await this.dashboardService.getDeliverySummary();
        return res.status(200).json({
            success: true,
            data: deliveries,
        });
    }
    async getInventorySummary(req, res) {
        const inventory = await this.dashboardService.getInventorySummary();
        return res.status(200).json({
            success: true,
            data: inventory,
        });
    }
    async getTopSellingProducts(req, res) {
        const products = await this.dashboardService.getTopSellingProducts();
        return res.status(200).json({
            success: true,
            data: products,
        });
    }
    async getProductsInDemand(req, res) {
        const products = await this.dashboardService.getProductsInDemand();
        return res.status(200).json({
            success: true,
            data: products,
        });
    }
    async getRecentOrders(req, res) {
        const orders = await this.dashboardService.getRecentOrders();
        return res.status(200).json({
            success: true,
            data: orders,
        });
    }
    async getOrders(req, res) {
        const status = req.query.status;
        const customerId = req.query.customerId
            ? Number(req.query.customerId)
            : undefined;
        const from = req.query.from;
        const to = req.query.to;
        const limit = req.query.limit
            ? Number(req.query.limit)
            : undefined;
        const orders = await this.dashboardService.getOrders({
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
    async getDeliveries(req, res) {
        const status = req.query.status;
        const customerId = req.query.customerId
            ? Number(req.query.customerId)
            : undefined;
        const from = req.query.from;
        const to = req.query.to;
        const limit = req.query.limit
            ? Number(req.query.limit)
            : undefined;
        const deliveries = await this.dashboardService.getDeliveries({
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
    async getRecentDeliveries(req, res) {
        const deliveries = await this.dashboardService.getRecentDeliveries();
        return res.status(200).json({
            success: true,
            data: deliveries,
        });
    }
    async getSummary(req, res) {
        const summary = await this.dashboardService.getSummary();
        return res.status(200).json({
            success: true,
            data: summary,
        });
    }
}
export const dashboardController = new DashboardController();
