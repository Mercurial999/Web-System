import { useEffect, useState, type FormEvent } from "react";

import {
  createCustomer,
  deactivateCustomer,
  getCustomers,
  updateCustomer,
} from "../../services/customerService";
import type { Customer, CustomerInput } from "../../types/customer.types";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";

const emptyForm: CustomerInput = {
  name: "",
  address: "",
  contactPerson: "",
  phone: "",
};

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<CustomerInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadCustomers(): Promise<void> {
    try {
      setError(null);
      setCustomers(await getCustomers());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load customers.");
    } finally {
      setIsLoading(false);
    }
  }

  // Data loading is an external synchronization and intentionally updates state after the request resolves.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCustomers();
  }, []);

  function resetForm(): void {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (editingId) {
        await updateCustomer(editingId, form);
      } else {
        await createCustomer(form);
      }
      resetForm();
      await loadCustomers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save customer.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeactivate(id: number): Promise<void> {
    try {
      await deactivateCustomer(id);
      await loadCustomers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to deactivate customer.");
    }
  }

  const visibleCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.address} ${customer.contactPerson ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <section className="space-y-6">
      <PageHeader eyebrow="Operations" title="Customers" description="Manage the bakery stores that receive deliveries." />

      {error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-stone-800">Customer directory</h3>
            <input
              className="rounded border border-stone-300 px-3 py-2 text-sm"
              placeholder="Search customers"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {isLoading ? <p className="text-sm text-stone-500">Loading customers...</p> : (
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-stone-200 text-stone-500">
                <tr><th className="p-3">Name</th><th className="p-3">Contact</th><th className="p-3">Address</th><th className="p-3">Status</th><th className="p-3">Action</th></tr>
              </thead>
              <tbody>
                {visibleCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-stone-100">
                    <td className="p-3 font-medium">{customer.name}</td>
                    <td className="p-3">{customer.contactPerson || customer.phone || "-"}</td>
                    <td className="p-3">{customer.address}</td>
                    <td className="p-3"><StatusBadge value={customer.status} /></td>
                    <td className="space-x-2 p-3">
                      <button className="text-amber-700 underline" onClick={() => { setEditingId(customer.id); setForm({ name: customer.name, address: customer.address, contactPerson: customer.contactPerson ?? "", phone: customer.phone ?? "" }); }}>Edit</button>
                      {customer.status === "ACTIVE" && <button className="text-red-700 underline" onClick={() => void handleDeactivate(customer.id)}>Deactivate</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <form className="space-y-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold text-stone-800">{editingId ? "Edit customer" : "Add customer"}</h3>
          {(["name", "address", "contactPerson", "phone"] as const).map((field) => (
            <label className="block space-y-1 text-sm font-medium text-stone-700" key={field}>
              <span>{field === "contactPerson" ? "Contact person" : field[0].toUpperCase() + field.slice(1)}</span>
              <input className="w-full rounded border border-stone-300 px-3 py-2" required={field === "name" || field === "address"} value={form[field] ?? ""} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} />
            </label>
          ))}
          <div className="flex gap-2">
            <button className="rounded bg-amber-700 px-4 py-2 font-semibold text-white disabled:opacity-50" disabled={isSaving}>{isSaving ? "Saving..." : editingId ? "Update" : "Save"}</button>
            {editingId && <button type="button" className="rounded border border-stone-300 px-4 py-2" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>
    </section>
  );
}

export default CustomersPage;
