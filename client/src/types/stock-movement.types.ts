export type StockMovementType = "IN" | "OUT" | "ADJUSTMENT";
export type StockMovementReason = "PURCHASE" | "SALE" | "DAMAGE" | "RETURN" | "MANUAL_ADJUSTMENT";

export interface StockMovement {
  id: number;
  inventoryId: number;
  type: StockMovementType;
  reason: StockMovementReason;
  quantity: number | string;
  reference?: string | null;
  notes?: string | null;
  createdAt: string;
  inventory?: { product?: { name: string } };
}
