export type DeliveryStatus = "DRAFT" | "COMPLETED" | "CANCELLED";

export interface DeliveryItem {
	id: number;
	productId: number;
	quantity: number;
	unitPrice: number | string;
	subtotal: number | string;
	product?: { name: string; unit: string };
}

export interface Delivery {
	id: number;
	orderId: number;
	customerId: number;
	deliveryDate: string;
	status: DeliveryStatus;
	notes?: string | null;
	customer?: { name: string };
	items: DeliveryItem[];
}

export interface OrderItem {
	id: number;
	productId: number;
	quantity: number;
	product?: { name: string; unit: string };
}

export interface Order {
	id: number;
	customerId: number;
	status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
	orderDate: string;
	notes?: string | null;
	customer?: { name: string };
	items: OrderItem[];
}
