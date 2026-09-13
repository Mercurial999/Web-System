import { Router } from "express";
import { dashboardRepository } from "./dashboard.repository.js";
const router = Router();
router.get("/sales", async (req, res, next) => {
    try {
        const sales = await dashboardRepository.getSalesSummary();
        res.status(200).json({
            success: true,
            data: sales,
        });
    }
    catch (error) {
        next(error);
    }
});
export default router;
