import { inventoryRepository } from "./inventory.repository.js";
import { productRepository } from "../products/product.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
export class InventoryService {
    async getAllInventory() {
        const inventory = await inventoryRepository.findAll();
        return inventory.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            minimumStock: item.minimumStock,
            stockStatus: this.getStockStatus(Number(item.quantity), Number(item.minimumStock)),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));
    }
    async getInventoryById(id) {
        const inventory = await inventoryRepository.findById(id);
        if (!inventory) {
            throw new Error("Inventory record not found.");
        }
        return {
            id: inventory.id,
            productId: inventory.productId,
            productName: inventory.product.name,
            quantity: inventory.quantity,
            minimumStock: inventory.minimumStock,
            stockStatus: this.getStockStatus(Number(inventory.quantity), Number(inventory.minimumStock)),
            createdAt: inventory.createdAt,
            updatedAt: inventory.updatedAt,
        };
    }
    async createInventory(data) {
        // Business rule 1:
        // Quantity cannot be negative.
        if (data.quantity < 0) {
            throw new Error("Quantity cannot be negative.");
        }
        // Business rule 2:
        // Minimum stock cannot be negative.
        if (data.minimumStock < 0) {
            throw new Error("Minimum stock cannot be negative.");
        }
        // Business rule 3:
        // Product must exist.
        const product = await productRepository.findById(data.productId);
        if (!product) {
            throw new Error("Product not found.");
        }
        // Business rule 4:
        // Product must be active.
        if (product.status !== "ACTIVE") {
            throw new AppError("Cannot create inventory for an inactive product.", 409);
        }
        // Business rule 5:
        // Product can have only one inventory record.
        const existingInventory = await inventoryRepository.findByProductId(data.productId);
        if (existingInventory) {
            throw new AppError("Inventory already exists for this product.", 409);
        }
        return inventoryRepository.create(data);
    }
    async updateInventory(id, data) {
        // Make sure the inventory exists.
        const inventory = await inventoryRepository.findById(id);
        if (!inventory) {
            throw new Error("Inventory record not found.");
        }
        // Validate quantity if provided.
        if (data.quantity !== undefined &&
            data.quantity < 0) {
            throw new Error("Quantity cannot be negative.");
        }
        // Validate minimum stock if provided.
        if (data.minimumStock !== undefined &&
            data.minimumStock < 0) {
            throw new Error("Minimum stock cannot be negative.");
        }
        return inventoryRepository.update(id, data);
    }
    getStockStatus(quantity, minimumStock) {
        if (quantity === 0) {
            return "OUT_OF_STOCK";
        }
        if (quantity <= minimumStock) {
            return "LOW_STOCK";
        }
        return "NORMAL";
    }
}
export const inventoryService = new InventoryService();
