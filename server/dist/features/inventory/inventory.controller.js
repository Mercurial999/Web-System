import { inventoryService } from "./inventory.service.js";
export class InventoryController {
    async getAll(req, res, next) {
        try {
            const inventory = await inventoryService.getAllInventory();
            res.status(200).json({
                success: true,
                data: inventory,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const inventory = await inventoryService.getInventoryById(id);
            res.status(200).json({
                success: true,
                data: inventory,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const inventory = await inventoryService.createInventory(req.body);
            res.status(201).json({
                success: true,
                message: "Inventory created successfully.",
                data: inventory,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const inventory = await inventoryService.updateInventory(id, req.body);
            res.status(200).json({
                success: true,
                message: "Inventory updated successfully.",
                data: inventory,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export const inventoryController = new InventoryController();
