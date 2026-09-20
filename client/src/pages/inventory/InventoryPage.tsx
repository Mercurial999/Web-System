import { useEffect, useState } from "react";
import { getInventory, updateInventory } from "../../services/inventoryService";
import type { InventoryItem } from "../../types/inventory.types";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { getStockMovements } from "../../services/stockMovementService";
import type { StockMovement } from "../../types/stock-movement.types";

function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  async function load(): Promise<void> {
    try {
      const [inventory, stockMovements] = await Promise.all([getInventory(), getStockMovements()]);
      setItems(inventory);
      setMovements(stockMovements);
      setError(null);
    }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load inventory."); }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  async function updateMinimum(id: number, value: string): Promise<void> {
    const minimumStock = Number(value);
    if (!Number.isFinite(minimumStock) || minimumStock < 0) return;
    try { await updateInventory(id, { minimumStock }); await load(); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to update inventory."); }
  }

  return <section className="space-y-6"><PageHeader eyebrow="Operations" title="Inventory" description="Monitor stock levels and minimum-stock thresholds." />{error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="surface overflow-x-auto p-4"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-stone-200 text-stone-500"><tr><th className="p-3">Product</th><th className="p-3">Quantity</th><th className="p-3">Minimum stock</th><th className="p-3">Status</th></tr></thead><tbody>{items.map((item) => <tr className="border-b border-stone-100" key={item.id}><td className="p-3 font-medium">{item.productName}</td><td className="p-3">{Number(item.quantity)}</td><td className="p-3"><input className="w-28 rounded border border-stone-300 px-2 py-1" type="number" min="0" defaultValue={Number(item.minimumStock)} onBlur={(event) => void updateMinimum(item.id, event.target.value)} /></td><td className="p-3"><StatusBadge value={item.stockStatus} /></td></tr>)}</tbody></table>{items.length === 0 && <p className="p-3 text-sm text-stone-500">No inventory records found.</p>}</div><div className="surface overflow-x-auto p-4"><h3 className="mb-3 text-lg font-semibold">Recent stock movements</h3><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-stone-200 text-stone-500"><tr><th className="p-3">Product</th><th className="p-3">Type</th><th className="p-3">Reason</th><th className="p-3">Quantity</th><th className="p-3">Date</th></tr></thead><tbody>{movements.slice(0, 12).map((movement) => <tr className="border-b border-stone-100" key={movement.id}><td className="p-3">{movement.inventory?.product?.name ?? movement.inventoryId}</td><td className="p-3"><StatusBadge value={movement.type} /></td><td className="p-3">{movement.reason.replaceAll("_", " ")}</td><td className="p-3">{Number(movement.quantity)}</td><td className="p-3">{new Date(movement.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>{movements.length === 0 && <p className="text-sm text-stone-500">No stock movements recorded.</p>}</div></section>;
}

export default InventoryPage;