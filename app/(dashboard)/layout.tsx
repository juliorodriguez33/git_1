import type { ReactNode } from "react";
import { AppHeader } from "@/components/shared/app-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur md:p-6">{children}</div>
      </main>
    </div>
  );
}
