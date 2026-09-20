import { useEffect, useState } from "react";
import { getDashboardSummary, type DashboardSummary } from "../../services/dashboardService";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";

function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void getDashboardSummary().then(setSummary).catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : "Unable to load dashboard.")); }, []);

  if (error) return <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (!summary) return <p className="text-stone-500">Loading dashboard...</p>;

  const cards = [
    { label: "Products", value: summary.inventory.totalProducts, tone: "warm" as const },
    { label: "Low stock", value: summary.inventory.lowStock, tone: "red" as const },
    { label: "Draft deliveries", value: summary.deliveries.draft, tone: "blue" as const },
    { label: "Completed deliveries", value: summary.deliveries.completed, tone: "green" as const },
  ];

  return (
    <section className="space-y-6">
      <PageHeader eyebrow="Overview" title="Dashboard" description="A quick view of today's bakery distribution operations." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-5"><h3 className="mb-4 text-lg font-semibold">Top selling products</h3>{summary.topSellingProducts.length ? summary.topSellingProducts.map((item) => <p className="flex justify-between border-b border-stone-100 py-2 text-sm" key={item.productName}><span>{item.productName}</span><strong>{item.quantitySold}</strong></p>) : <p className="text-sm text-stone-500">No completed deliveries yet.</p>}</div>
        <div className="surface p-5"><h3 className="mb-4 text-lg font-semibold">Products in demand</h3>{summary.productsInDemand.length ? summary.productsInDemand.map((item) => <p className="flex justify-between border-b border-stone-100 py-2 text-sm" key={item.productName}><span>{item.productName}</span><strong>{item.quantityDemanded}</strong></p>) : <p className="text-sm text-stone-500">No pending demand yet.</p>}</div>
      </div>
    </section>
  );
}

export default DashboardPage;