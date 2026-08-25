import { stockMovementRepository } from "./stock-movement.repository.js";
import { inventoryRepository } from "../inventory/inventory.repository.js";
import { productRepository } from "../products/product.repository.js";
import { AppError } from "../../shared/errors/index.js";
import { prisma } from "../../database/prisma.js";

type StockMovementType =
  | "IN"
  | "OUT"
  | "ADJUSTMENT";

type StockMovementReason =
  | "PURCHASE"
  | "SALE"
  | "DAMAGE"
  | "RETURN"
  | "MANUAL_ADJUSTMENT";

export class StockMovementService {
  async createMovement(data: {
  inventoryId: number;
  type: StockMovementType;
  reason: StockMovementReason;
  quantity: number;
  reference?: string;
  notes?: string;
}) {
  if (data.quantity <= 0) {
    throw new AppError(
      "Movement quantity must be greater than zero.",
      400
    );
  }

  const movement = await prisma.$transaction(
    async (tx) => {
      const inventory =
        await inventoryRepository.findForUpdate(
          data.inventoryId,
          tx
        );

      if (!inventory) {
        throw new AppError(
          "Inventory not found.",
          404
        );
      }

      const product =
        await productRepository.findById(
          inventory.productId
        );

      if (!product) {
        throw new AppError(
          "Product not found.",
          404
        );
      }

      if (product.status === "INACTIVE") {
        throw new AppError(
          "Cannot create stock movement for an inactive product.",
          400
        );
      }

      const currentQuantity =
        Number(inventory.quantity);

      let newQuantity: number;

      if (data.type === "IN") {
        newQuantity =
          currentQuantity + data.quantity;

      } else if (data.type === "OUT") {
        newQuantity =
          currentQuantity - data.quantity;

        if (newQuantity < 0) {
          throw new AppError(
            "Insufficient inventory quantity.",
            400
          );
        }

      } else {
        newQuantity = data.quantity;
      }

      const movement =
        await stockMovementRepository.create(
          data,
          tx
        );

      await inventoryRepository.update(
        data.inventoryId,
        {
          quantity: newQuantity,
        },
        tx
      );

      return movement;
    }
  );

  return movement;  
}

  async getMovementById(id: number) {
  const movement =
    await stockMovementRepository.findById(id);

  if (!movement) {
    throw new AppError(
      "Stock movement not found.",
      404
    );
  }

  return movement;
}

async getMovementsByInventoryId(
  inventoryId: number
) {
  const inventory =
    await inventoryRepository.findById(inventoryId);

  if (!inventory) {
    throw new AppError(
      "Inventory not found.",
      404
    );
  }

  return stockMovementRepository.findByInventoryId(
    inventoryId
  );
}

}

export const stockMovementService =
  new StockMovementService();