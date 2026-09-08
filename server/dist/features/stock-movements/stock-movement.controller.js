import { stockMovementService } from "./stock-movement.service.js";
export class StockMovementController {
    async create(req, res, next) {
        try {
            const movement = await stockMovementService.createMovement(req.body);
            res.status(201).json({
                success: true,
                message: "Stock movement created successfully.",
                data: movement,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const movements = await stockMovementService.getMovements();
            res.status(200).json({
                success: true,
                data: movements,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const movement = await stockMovementService.getMovementById(id);
            res.status(200).json({
                success: true,
                data: movement,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getByInventoryId(req, res, next) {
        try {
            const inventoryId = Number(req.params.inventoryId);
            const movements = await stockMovementService.getMovementsByInventoryId(inventoryId);
            res.status(200).json({
                success: true,
                data: movements,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export const stockMovementController = new StockMovementController();
