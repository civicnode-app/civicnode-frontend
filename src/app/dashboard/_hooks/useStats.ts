"use client";

import { detectionLevel, scoreGrade } from "../_types";
import { useDashboardStore } from "../_store/useDashboardStore";

export function useStats() {
  const armadaSiaga      = useDashboardStore((s) => s.armadaSiaga);
  const activeDetections = useDashboardStore((s) => s.activeDetections);
  const zones            = useDashboardStore((s) => s.zones);

  // Zone Reputation hanya dihitung dari zona yang terpantau (score !== null)
  const monitored = zones.filter((z) => z.score !== null);
  const zone_reputation = monitored.length > 0
    ? Math.round(monitored.reduce((sum, z) => sum + (z.score as number), 0) / monitored.length)
    : 0;

  const repGrade = scoreGrade(zone_reputation);
  const detLevel = detectionLevel(activeDetections);

  return {
    stats: { active_detections: activeDetections, zone_reputation, armada_siaga: armadaSiaga },
    repGrade,
    detLevel,
  };
}
