import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { getSalesSummary } from "../../services/salesService";
import type { SalesSummary } from "../../types/sales.types";

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

function SalesPage() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getSalesSummary()
      .then(setSummary)
      .catch(() => setError("Unable to load sales data right now."));
  }, []);

  return (
    <section className="space-y-6">
      <PageHeader eyebrow="Completed deliveries" title="Sales" description="Sales totals from deliveries completed in the system." />
      {error ? <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {!summary && !error ? <p className="text-stone-500">Loading sales...</p> : null}
      {summary ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Completed deliveries" value={summary.completedDeliveries} tone="green" />
          <StatCard label="Quantity sold" value={summary.totalQuantitySold} tone="blue" />
          <StatCard label="Total sales" value={peso.format(Number(summary.totalSales))} tone="warm" />
        </div>
      ) : null}
      {summary && summary.completedDeliveries === 0 ? <div className="surface p-5 text-sm text-stone-500">No completed delivery sales found.</div> : null}
    </section>
  );
}

export default SalesPage;