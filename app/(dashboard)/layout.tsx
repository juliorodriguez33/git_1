import type { ReactNode } from "react";
import { AppHeader } from "@/components/shared/app-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
