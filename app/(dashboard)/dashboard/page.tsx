import { getTodayCards } from "@/actions/cards";
import { DailyGrid } from "@/components/dashboard/daily-grid";
import { DashboardLiveSync } from "@/components/dashboard/dashboard-live";
import { UnresolvedPanel } from "@/components/dashboard/unresolved-panel";

export default async function DashboardPage() {
  const cards = await getTodayCards();

  return (
    <div className="space-y-4">
      <DashboardLiveSync />
      <h2 className="text-2xl font-semibold">Panel diario</h2>
      <p className="text-sm text-slate-600">Tarjetas por franja horaria con sincronización en tiempo real.</p>
      <UnresolvedPanel cards={cards} />
      <DailyGrid cards={cards} />
    </div>
  );
}
