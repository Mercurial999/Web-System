import {
  NotFoundError,
  ValidationError,
} from "../../shared/errors/index.js";

import { prisma } from "../../database/prisma.js";

import { customerRepository } from "../customers/customer.repository.js";
import { productRepository } from "../products/product.repository.js";
import { deliveryRepository } from "./delivery.repository.js";
import { inventoryRepository } from "../inventory/inventory.repository.js";
import { stockMovementRepository } from "../stock-movements/stock-movement.repository.js";

export class DeliveryService {
  private deliveryRepository = deliveryRepository;
  private customerRepository = customerRepository;
  private productRepository = productRepository;
  private inventoryRepository = inventoryRepository;
  private stockMovementRepository = stockMovementRepository;

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
  customerId: number;
  deliveryDate: Date;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}) {
  this.validateId(data.customerId);

  const customer = await this.customerRepository.findById(
    data.customerId,
  );

  if (!customer) {
    throw new NotFoundError("Customer not found");
  }

  if (customer.status !== "ACTIVE") {
    throw new ValidationError(
      "Cannot create delivery for an inactive customer",
    );
  }

  if (data.items.length === 0) {
  throw new ValidationError(
    "Delivery must contain at least one item",
  );
}

const productIds = data.items.map(
  (item) => item.productId,
);

const uniqueProductIds = new Set(productIds);

if (uniqueProductIds.size !== productIds.length) {
  throw new ValidationError(
    "A product can only appear once in a delivery",
  );
}


  for (const item of data.items) {
    this.validateId(item.productId);

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new ValidationError(
        "Delivery item quantity must be a positive whole number",
      );
    }

    const product = await this.productRepository.findById(
      item.productId,
    );

    if (!product) {
      throw new NotFoundError(
        `Product ${item.productId} not found`,
      );
    }

    if (product.status !== "ACTIVE") {
      throw new ValidationError(
        `Product ${item.productId} is inactive`,
      );
    }
  }

  return this.deliveryRepository.create(data);
}

  async addDeliveryItem(
    deliveryId: number,
    data: {
      productId: number;
      quantity: number;
    },
  ) {
    this.validateId(deliveryId);
    this.validateId(data.productId);

    // 1. Check delivery exists
    const delivery =
      await this.deliveryRepository.findById(deliveryId);

    if (!delivery) {
      throw new NotFoundError("Delivery not found");
    }

    // 2. Only DRAFT deliveries can have items added
    if (delivery.status !== "DRAFT") {
      throw new ValidationError(
        "Only draft deliveries can have items added",
      );
    }

    // 3. Validate quantity
    if (
      !Number.isInteger(data.quantity) ||
      data.quantity <= 0
    ) {
      throw new ValidationError(
        "Delivery item quantity must be a positive whole number",
      );
    }

    // 4. Check product exists
    const product =
      await this.productRepository.findById(
        data.productId,
      );

    if (!product) {
      throw new NotFoundError(
        `Product ${data.productId} not found`,
      );
    }

    // 5. Product must be ACTIVE
    if (product.status !== "ACTIVE") {
      throw new ValidationError(
        `Product ${data.productId} is inactive`,
      );
    }

    // 6. Prevent duplicate product
    const existingItem = delivery.items.find(
      (item) => item.productId === data.productId,
    );

    if (existingItem) {
      throw new ValidationError(
        "A product can only appear once in a delivery",
      );
    }

    // 7. Add the item
    return this.deliveryRepository.addItem(
      deliveryId,
      data,
    );
  }

    async updateDeliveryItem(
    deliveryId: number,
    itemId: number,
    data: {
      quantity: number;
    },
  ) {
    this.validateId(deliveryId);
    this.validateId(itemId);

    // 1. Check delivery exists
    const delivery =
      await this.deliveryRepository.findById(deliveryId);

    if (!delivery) {
      throw new NotFoundError("Delivery not found");
    }

    // 2. Only DRAFT deliveries can have items updated
    if (delivery.status !== "DRAFT") {
      throw new ValidationError(
        "Only draft deliveries can have items updated",
      );
    }

    // 3. Validate quantity
    if (
      !Number.isInteger(data.quantity) ||
      data.quantity <= 0
    ) {
      throw new ValidationError(
        "Delivery item quantity must be a positive whole number",
      );
    }

    // 4. Find the item inside this delivery
    const item = delivery.items.find(
      (item) => item.id === itemId,
    );

    if (!item) {
      throw new NotFoundError(
        "Delivery item not found",
      );
    }

    // 5. Update the quantity
    return this.deliveryRepository.updateItem(
      itemId,
      data,
    );
  }

  async deleteDeliveryItem(
  deliveryId: number,
  itemId: number,
) {
  this.validateId(deliveryId);
  this.validateId(itemId);

  // 1. Check delivery exists
  const delivery =
    await this.deliveryRepository.findById(deliveryId);

  if (!delivery) {
    throw new NotFoundError("Delivery not found");
  }

  // 2. Only DRAFT deliveries can have items removed
  if (delivery.status !== "DRAFT") {
    throw new ValidationError(
      "Only draft deliveries can have items removed",
    );
  }

  // 3. Find the item inside this delivery
  const item = delivery.items.find(
    (item) => item.id === itemId,
  );

  if (!item) {
    throw new NotFoundError(
      "Delivery item not found",
    );
  }

  // 4. Prevent delivery from having zero items
  if (delivery.items.length === 1) {
    throw new ValidationError(
      "Delivery must contain at least one item",
    );
  }

  // 5. Delete the item
  return this.deliveryRepository.deleteItem(itemId);
}

async updateDelivery(
  id: number,
  data: {
    customerId?: number;
    deliveryDate?: Date;
    notes?: string;
  },
) {
  this.validateId(id);

  const delivery = await this.deliveryRepository.findById(id);

  if (!delivery) {
    throw new NotFoundError("Delivery not found");
  }

  if (delivery.status !== "DRAFT") {
    throw new ValidationError(
      "Only draft deliveries can be updated",
    );
  }

  if (data.customerId !== undefined) {
    this.validateId(data.customerId);

    const customer = await this.customerRepository.findById(
      data.customerId,
    );

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    if (customer.status !== "ACTIVE") {
      throw new ValidationError(
        "Cannot assign an inactive customer to a delivery",
      );
    }
  }

  return this.deliveryRepository.update(id, data);
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

    return completedDelivery;

  });
}


}

export const deliveryService = new DeliveryService();