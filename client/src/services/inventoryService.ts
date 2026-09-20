import { apiRequest } from "../lib/api";
import type { InventoryInput, InventoryItem } from "../types/inventory.types";

interface InventoryResponse {
	success: boolean;
	data: InventoryItem[];
}

export async function getInventory(): Promise<InventoryItem[]> {
	const response = await apiRequest<InventoryResponse>("/inventory");
	return response.data;
}

export async function createInventory(input: InventoryInput): Promise<InventoryItem> {
	const response = await apiRequest<{ data: InventoryItem }>("/inventory", {
		method: "POST",
		body: input,
	});
	return response.data;
}

export async function updateInventory(
	id: number,
	input: Partial<Omit<InventoryInput, "productId">>,
): Promise<InventoryItem> {
	const response = await apiRequest<{ data: InventoryItem }>(`/inventory/${id}`, {
		method: "PUT",
		body: input,
	});
	return response.data;
}
