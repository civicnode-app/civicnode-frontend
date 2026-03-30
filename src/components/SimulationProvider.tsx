"use client";

import { useEffect, type ReactNode } from "react";
import { useDashboardStore } from "@/app/dashboard/_store/useDashboardStore";

const MIN_ZONE_SCORE = 0;

/**
 * Menjalankan interval degradasi simulasi secara global — tetap aktif
 * berapapun halaman yang sedang dibuka. Dipasang di AppLayout.
 */
export function SimulationProvider({ children }: { children: ReactNode }) {
  const degradationMs = useDashboardStore((s) => s.config.degradationMs);

  useEffect(() => {
    const interval = setInterval(() => {
      const { zones, zoneDispatches, incrementZoneDetection, updateZoneScore } =
        useDashboardStore.getState();

      const available = zones.filter(
        (z) => !zoneDispatches[z.id] && z.score !== null && z.score > MIN_ZONE_SCORE,
      );
      if (available.length === 0) return;

      const target = available[Math.floor(Math.random() * available.length)];
      incrementZoneDetection(target.id);
      updateZoneScore(target.id, (target.score as number) - 1);
    }, degradationMs);

    return () => clearInterval(interval);
  }, [degradationMs]);

  return <>{children}</>;
}
