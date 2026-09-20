import { useEffect, useState } from "react";
import { getDashboardSummary, type DashboardSummary } from "../../services/dashboardService";
import PageHeader from "../../components/common/PageHeader";

function ReportsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  useEffect(() => { void getDashboardSummary().then(setSummary); }, []);
  if (!summary) return <p className="text-stone-500">Loading reports...</p>;
  return <section className="space-y-6"><PageHeader eyebrow="Analysis" title="Reports" description="Operational summaries from completed and active workflows." /><div className="grid gap-4 sm:grid-cols-3"><div className="stat-card"><p>Sales today</p><strong>{Number(summary.sales.today).toFixed(2)}</strong></div><div className="stat-card"><p>Sales this week</p><strong>{Number(summary.sales.thisWeek).toFixed(2)}</strong></div><div className="stat-card stat-card-red"><p>Out of stock</p><strong>{summary.inventory.outOfStock}</strong></div></div><div className="surface p-5"><h3 className="mb-4 text-lg font-semibold">Delivery status</h3><div className="grid gap-3 sm:grid-cols-3"><p>Draft: <strong>{summary.deliveries.draft}</strong></p><p>Completed: <strong>{summary.deliveries.completed}</strong></p><p>Cancelled: <strong>{summary.deliveries.cancelled}</strong></p></div></div></section>;
}

export default ReportsPage;