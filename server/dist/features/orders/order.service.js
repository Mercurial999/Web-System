import { ConflictError, NotFoundError, ValidationError, } from "../../shared/errors/index.js";
import { customerRepository } from "../customers/customer.repository.js";
import { productRepository } from "../products/product.repository.js";
import { orderRepository } from "./order.repository.js";
export class OrderService {
    orderRepository = orderRepository;
    customerRepository = customerRepository;
    productRepository = productRepository;
    validateId(id, resource) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new ValidationError(`Invalid ${resource} ID`);
        }
    }
    async getOrders() {
        return this.orderRepository.findAll();
    }
    async getOrderById(id) {
        this.validateId(id, "order");
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new NotFoundError("Order not found");
        }
        return order;
    }
    async createOrder(data) {
        this.validateId(data.customerId, "customer");
        const customer = await this.customerRepository.findById(data.customerId);
        if (!customer) {
            throw new NotFoundError("Customer not found");
        }
        if (customer.status !== "ACTIVE") {
            throw new ValidationError("Cannot create an order for an inactive customer");
        }
        if (data.items.length === 0) {
            throw new ValidationError("Order must contain at least one item");
        }
        const productIds = data.items.map((item) => item.productId);
        const uniqueProductIds = new Set(productIds);
        if (uniqueProductIds.size !== productIds.length) {
            throw new ConflictError("An order cannot contain the same product more than once");
        }
        const orderItems = [];
        for (const item of data.items) {
            this.validateId(item.productId, "product");
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new ValidationError("Order quantity must be a positive integer");
            }
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new NotFoundError(`Product ${item.productId} not found`);
            }
            if (product.status !== "ACTIVE") {
                throw new ValidationError(`Product ${item.productId} is inactive`);
            }
            const unitPrice = product.price;
            const subtotal = unitPrice.mul(item.quantity);
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice,
                subtotal,
            });
        }
        return this.orderRepository.create({
            customerId: data.customerId,
            orderDate: data.orderDate ?? new Date(),
            notes: data.notes,
            items: orderItems,
        });
    }
    async addOrderItem(orderId, data) {
        this.validateId(orderId, "order");
        this.validateId(data.productId, "product");
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }
        if (order.status !== "PENDING") {
            throw new ValidationError("Only pending orders can be modified");
        }
        const existingItem = order.items.find((item) => item.productId === data.productId);
        if (existingItem) {
            throw new ConflictError("Product already exists in this order");
        }
        const product = await this.productRepository.findById(data.productId);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        if (product.status !== "ACTIVE") {
            throw new ValidationError("Product is inactive");
        }
        const unitPrice = product.price;
        const subtotal = unitPrice.mul(data.quantity);
        return this.orderRepository.addItem(orderId, {
            productId: data.productId,
            quantity: data.quantity,
            unitPrice,
            subtotal,
        });
    }
    async updateOrderItem(orderId, itemId, data) {
        this.validateId(orderId, "order");
        this.validateId(itemId, "order item");
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }
        if (order.status !== "PENDING") {
            throw new ValidationError("Only pending orders can be modified");
        }
        const item = order.items.find((item) => item.id === itemId);
        if (!item) {
            throw new NotFoundError("Order item not found");
        }
        if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
            throw new ValidationError("Order quantity must be a positive integer");
        }
        const unitPrice = item.unitPrice;
        const subtotal = unitPrice.mul(data.quantity);
        return this.orderRepository.updateItem(itemId, {
            quantity: data.quantity,
            unitPrice,
            subtotal,
        });
    }
    async deleteOrderItem(orderId, itemId) {
        this.validateId(orderId, "order");
        this.validateId(itemId, "order item");
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }
        if (order.status !== "PENDING") {
            throw new ValidationError("Only pending orders can be modified");
        }
        const item = order.items.find((item) => item.id === itemId);
        if (!item) {
            throw new NotFoundError("Order item not found");
        }
        if (order.items.length === 1) {
            throw new ValidationError("An order must contain at least one item");
        }
        return this.orderRepository.deleteItem(itemId);
    }
    async updateOrder(id, data) {
        this.validateId(id, "order");
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new NotFoundError("Order not found");
        }
        if (order.status !== "PENDING") {
            throw new ValidationError("Only pending orders can be modified");
        }
        if (data.customerId !== undefined) {
            this.validateId(data.customerId, "customer");
            const customer = await this.customerRepository.findById(data.customerId);
            if (!customer) {
                throw new NotFoundError("Customer not found");
            }
            if (customer.status !== "ACTIVE") {
                throw new ValidationError("Cannot assign an inactive customer to an order");
            }
        }
        return this.orderRepository.update(id, data);
    }
    async confirmOrder(id) {
        this.validateId(id, "order");
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new NotFoundError("Order not found");
        }
        if (order.status !== "PENDING") {
            throw new ValidationError("Only pending orders can be confirmed");
        }
        if (order.items.length === 0) {
            throw new ValidationError("Cannot confirm an order without items");
        }
        return this.orderRepository.updateStatus(id, "CONFIRMED");
    }
    async cancelOrder(id) {
        this.validateId(id, "order");
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new NotFoundError("Order not found");
        }
        if (order.status === "CANCELLED") {
            throw new ValidationError("Order is already cancelled");
        }
        if (order.status === "CONFIRMED" && order.delivery) {
            throw new ConflictError("Cannot cancel an order that already has a delivery");
        }
        if (order.status !== "PENDING" &&
            order.status !== "CONFIRMED") {
            throw new ValidationError("Only pending or confirmed orders can be cancelled");
        }
        return this.orderRepository.updateStatus(id, "CANCELLED");
    }
}
export const orderService = new OrderService();
