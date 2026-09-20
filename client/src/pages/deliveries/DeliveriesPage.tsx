import { useEffect, useState } from "react";
import { getCustomers } from "../../services/customerService";
import { getProducts } from "../../services/productService";
import { confirmOrder, createDelivery, createOrder, completeDelivery, getDeliveries } from "../../services/deliveryService";
import type { Customer } from "../../types/customer.types";
import type { Delivery } from "../../types/delivery.types";
import type { Product } from "../../types/product.types";

function DeliveriesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function load(): Promise<void> {
    try {
      const [customerData, productData, deliveryData] = await Promise.all([getCustomers(), getProducts(), getDeliveries()]);
      setCustomers(customerData.filter((customer) => customer.status === "ACTIVE"));
      setProducts(productData.filter((product) => product.status === "ACTIVE"));
      setDeliveries(deliveryData);
      setError(null);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load delivery data."); }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  async function submit(): Promise<void> {
    const parsedCustomerId = Number(customerId);
    const parsedProductId = Number(productId);
    const parsedQuantity = Number(quantity);
    if (!parsedCustomerId || !parsedProductId || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError("Choose a customer and product, then enter a positive whole-number quantity.");
      return;
    }
    setIsSaving(true);
    try {
      const order = await createOrder({ customerId: parsedCustomerId, notes, items: [{ productId: parsedProductId, quantity: parsedQuantity }] });
      const confirmedOrder = await confirmOrder(order.id);
      await createDelivery({ orderId: confirmedOrder.id, deliveryDate: new Date().toISOString(), notes });
      setCustomerId(""); setProductId(""); setQuantity("1"); setNotes("");
      await load();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to create delivery."); }
    finally { setIsSaving(false); }
  }

  async function finish(id: number): Promise<void> {
    try { await completeDelivery(id); await load(); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to complete delivery."); }
  }

  return <section className="space-y-6"><div><p className="text-sm font-semibold uppercase tracking-widest text-amber-700">Operations</p><h2 className="text-3xl font-bold text-stone-800">Deliveries</h2><p className="mt-1 text-stone-600">Create deliveries and complete them through the protected inventory workflow.</p></div>{error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="overflow-x-auto rounded-lg border border-stone-200 bg-white p-4 shadow-sm"><h3 className="mb-4 text-lg font-semibold">Delivery history</h3><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-stone-200 text-stone-500"><tr><th className="p-3">ID</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{deliveries.map((delivery) => <tr className="border-b border-stone-100" key={delivery.id}><td className="p-3">#{delivery.id}</td><td className="p-3">{delivery.customer?.name ?? delivery.customerId}</td><td className="p-3">{new Date(delivery.deliveryDate).toLocaleDateString()}</td><td className="p-3">{delivery.status}</td><td className="p-3">{delivery.status === "DRAFT" && <button className="text-amber-700 underline" onClick={() => void finish(delivery.id)}>Complete</button>}</td></tr>)}</tbody></table></div><div className="space-y-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-semibold">New delivery</h3><select className="w-full rounded border border-stone-300 px-3 py-2" value={customerId} onChange={(event) => setCustomerId(event.target.value)}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select><select className="w-full rounded border border-stone-300 px-3 py-2" value={productId} onChange={(event) => setProductId(event.target.value)}><option value="">Select product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.unit})</option>)}</select><input className="w-full rounded border border-stone-300 px-3 py-2" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /><textarea className="w-full rounded border border-stone-300 px-3 py-2" placeholder="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} /><button className="w-full rounded bg-amber-700 px-4 py-2 font-semibold text-white disabled:opacity-50" disabled={isSaving} onClick={() => void submit()}>{isSaving ? "Creating..." : "Create delivery"}</button></div></div></section>;
}

export default DeliveriesPage;