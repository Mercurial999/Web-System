import { Router } from "express";
import { salesController } from "./sales.controller.js";
const router = Router();
router.get("/summary", salesController.getSalesSummary.bind(salesController));
export default router;
