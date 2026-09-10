import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../shared/errors/index.js";

import { prisma } from "../../database/prisma.js";

import { customerRepository } from "../customers/customer.repository.js";
import { deliveryRepository } from "./delivery.repository.js";
import { inventoryRepository } from "../inventory/inventory.repository.js";
import { stockMovementRepository } from "../stock-movements/stock-movement.repository.js";
import { orderRepository } from "../orders/order.repository.js";


export class DeliveryService {
  private deliveryRepository = deliveryRepository;
  private customerRepository = customerRepository;
  private inventoryRepository = inventoryRepository;
  private stockMovementRepository = stockMovementRepository;
  private orderRepository = orderRepository;

  private validateId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError("Invalid delivery ID");
    }
  }

  async getDeliveries() {
    return this.deliveryRepository.findAll();
  }

  async getDeliveryById(id: number) {
    this.validateId(id);

    const delivery = await this.deliveryRepository.findById(id);

    if (!delivery) {
      throw new NotFoundError("Delivery not found");
    }

    return delivery;
  }

  async createDelivery(data: {
  orderId: number;
  deliveryDate: Date;
  notes?: string;
  }) {
  this.validateId(data.orderId);

  const order = await this.orderRepository.findById(data.orderId);

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.status !== "CONFIRMED") {
    throw new ValidationError(
      "Only confirmed orders can be converted into a delivery",
    );
  }

  if (order.delivery) {
    throw new ConflictError(
      "This order already has a delivery",
    );
  }

  if (order.items.length === 0) {
    throw new ValidationError(
      "Cannot create a delivery from an order without items",
    );
  }

  const customer = await this.customerRepository.findById(
    order.customerId,
  );

  if (!customer) {
    throw new NotFoundError("Customer not found");
  }

  const items = order.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
  }));

  return this.deliveryRepository.createFromOrder({
    orderId: order.id,
    customerId: order.customerId,
    deliveryDate: data.deliveryDate,
    notes: data.notes,
    items,
  });
}

async cancelDelivery(id: number) {
  this.validateId(id);

  const delivery = await this.deliveryRepository.findById(id);

  if (!delivery) {
    throw new NotFoundError("Delivery not found");
  }

  if (delivery.status !== "DRAFT") {
    throw new ValidationError(
      "Only draft deliveries can be cancelled",
    );
  }

  return this.deliveryRepository.updateStatus(
    id,
    "CANCELLED",
  );
}

async completeDelivery(id: number) {
  this.validateId(id);

  return prisma.$transaction(async (tx) => {
    // 1. Lock the delivery
    const lockedDelivery =
      await this.deliveryRepository.findForUpdate(
        id,
        tx,
      );

    if (!lockedDelivery) {
      throw new NotFoundError("Delivery not found");
    }

    // 2. Check delivery status
    if (lockedDelivery.status !== "DRAFT") {
      throw new ValidationError(
        "Only draft deliveries can be completed",
      );
    }

    // 3. Get full delivery with items
    const delivery =
      await this.deliveryRepository.findById(
        id,
        tx,
      );

    if (!delivery) {
      throw new NotFoundError("Delivery not found");
    }

    // 4. Check delivery has items
    if (delivery.items.length === 0) {
      throw new ValidationError(
        "Delivery must contain at least one item",
      );
    }

    // 5. Process inventory
    for (const item of delivery.items) {
      const inventory =
        await this.inventoryRepository.findForUpdateByProductId(
          item.productId,
          tx,
        );

      if (!inventory) {
        throw new NotFoundError(
          `Inventory not found for product ${item.productId}`,
        );
      }

      if (inventory.quantity.lt(item.quantity)) {
        throw new ValidationError(
          `Insufficient inventory for product ${item.productId}`,
        );
      }

      // Deduct inventory
      const newQuantity =
        inventory.quantity.minus(item.quantity);

      await this.inventoryRepository.update(
        inventory.id,
        {
          quantity: newQuantity,
        },
        tx,
      );

      // Create stock movement
      await this.stockMovementRepository.create(
        {
          inventoryId: inventory.id,
          type: "OUT",
          reason: "SALE",
          quantity: item.quantity,
          reference: `Delivery #${delivery.id}`,
        },
        tx,
      );
    }

    // 6. Mark delivery as completed
    const completedDelivery =
      await this.deliveryRepository.updateStatus(
        id,
        "COMPLETED",
        tx,
      );

    // 7. Mark related order as completed
    if (delivery.orderId) {
    await tx.order.update({
      where: {
        id: delivery.orderId,
      },
      data: {
        status: "COMPLETED",
      },
    });
  }

    return completedDelivery;

  });
}


}

export const deliveryService = new DeliveryService();