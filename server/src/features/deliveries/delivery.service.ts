import {
  NotFoundError,
  ValidationError,
} from "../../shared/errors/index.js";

import { customerRepository } from "../customers/customer.repository.js";
import { productRepository } from "../products/product.repository.js";
import { deliveryRepository } from "./delivery.repository.js";

export class DeliveryService {
  private deliveryRepository = deliveryRepository;
  private customerRepository = customerRepository;
  private productRepository = productRepository;

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


}

export const deliveryService = new DeliveryService();