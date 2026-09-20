export interface InventoryItem {
	id: number;
	productId: number;
	productName: string;
	quantity: number | string;
	minimumStock: number | string;
	stockStatus: "NORMAL" | "LOW_STOCK" | "OUT_OF_STOCK";
	createdAt: string;
	updatedAt: string;
}

export interface InventoryInput {
	productId: number;
	quantity: number;
	minimumStock: number;
}
