import { apiRequest } from "../lib/api";
import type { Delivery, Order } from "../types/delivery.types";

interface CollectionResponse<T> {
	success: boolean;
	data: T[];
}

export async function getOrders(): Promise<Order[]> {
	const response = await apiRequest<CollectionResponse<Order>>("/orders");
	return response.data;
}

export async function createOrder(input: {
	customerId: number;
	notes?: string;
	items: { productId: number; quantity: number }[];
}): Promise<Order> {
	const response = await apiRequest<{ data: Order }>("/orders", {
		method: "POST",
		body: input,
	});
	return response.data;
}

export async function confirmOrder(id: number): Promise<Order> {
	const response = await apiRequest<{ data: Order }>(`/orders/${id}/confirm`, {
		method: "PATCH",
	});
	return response.data;
}

export async function getDeliveries(): Promise<Delivery[]> {
	const response = await apiRequest<CollectionResponse<Delivery>>("/deliveries");
	return response.data;
}

export async function createDelivery(input: {
	orderId: number;
	deliveryDate: string;
	notes?: string;
}): Promise<Delivery> {
	const response = await apiRequest<{ data: Delivery }>("/deliveries", {
		method: "POST",
		body: input,
	});
	return response.data;
}

export async function completeDelivery(id: number): Promise<Delivery> {
	const response = await apiRequest<{ data: Delivery }>(`/deliveries/${id}/complete`, {
		method: "PATCH",
	});
	return response.data;
}

export async function cancelDelivery(id: number): Promise<Delivery> {
	const response = await apiRequest<{ data: Delivery }>(`/deliveries/${id}/cancel`, {
		method: "PATCH",
	});
	return response.data;
}
