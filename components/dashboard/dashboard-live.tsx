"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeCards } from "@/hooks/use-realtime-cards";

export function DashboardLiveSync() {
  const router = useRouter();
  const onChange = useCallback(() => router.refresh(), [router]);

  useRealtimeCards(onChange);
  return null;
}
