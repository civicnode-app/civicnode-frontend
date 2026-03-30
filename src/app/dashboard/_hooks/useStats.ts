"use client";

import { useEffect, useState } from "react";
import { RealtimeStats, detectionLevel, scoreGrade } from "../_types";
import { useDashboardStore } from "../_store/useDashboardStore";

export function useStats() {
  const armadaSiaga       = useDashboardStore((s) => s.armadaSiaga);
  const fluctuateArmada   = useDashboardStore((s) => s.fluctuateArmada);

  const [stats, setStats] = useState<Omit<RealtimeStats, "armada_siaga">>({
    active_detections: 12,
    zone_reputation: 64,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        active_detections: Math.max(
          0,
          prev.active_detections +
            (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
        ),
        zone_reputation: Math.round(
          Math.min(100, Math.max(30, prev.zone_reputation + (Math.random() - 0.5) * 1.5)),
        ),
      }));
      fluctuateArmada(); // fluktuasi alami dari store yang di-share
    }, 2000);
    return () => clearInterval(interval);
  }, [fluctuateArmada]);

  const repGrade  = scoreGrade(stats.zone_reputation);
  const detLevel  = detectionLevel(stats.active_detections);

  return { stats: { ...stats, armada_siaga: armadaSiaga }, repGrade, detLevel };
}
