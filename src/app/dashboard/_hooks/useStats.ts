"use client";

import { useEffect } from "react";
import { detectionLevel, scoreGrade } from "../_types";
import { useDashboardStore } from "../_store/useDashboardStore";
const MIN_ZONE_SCORE = 0;

export function useStats() {
  const armadaSiaga      = useDashboardStore((s) => s.armadaSiaga);
  const activeDetections = useDashboardStore((s) => s.activeDetections);
  const zones            = useDashboardStore((s) => s.zones);
  const degradationMs    = useDashboardStore((s) => s.config.degradationMs);

  // Zone Reputation hanya dihitung dari zona yang terpantau (score !== null)
  const monitored = zones.filter((z) => z.score !== null);
  const zone_reputation = monitored.length > 0
    ? Math.round(monitored.reduce((sum, z) => sum + (z.score as number), 0) / monitored.length)
    : 0;

  // Tiap tick: active detections naik 1, lalu 1 zona random (yang tidak sedang
  // dibersihkan petugas) kehilangan 1 poin kebersihan.
  // Interval di-restart otomatis setiap degradationMs berubah dari panel config.
  useEffect(() => {
    const interval = setInterval(() => {
      const { zones: cur, zoneDispatches, addDetection, updateZoneScore } =
        useDashboardStore.getState();

      addDetection();

      const available = cur.filter(
        (z) => !zoneDispatches[z.id] && z.score !== null && z.score > MIN_ZONE_SCORE,
      );
      if (available.length === 0) return;

      const target = available[Math.floor(Math.random() * available.length)];
      updateZoneScore(target.id, (target.score as number) - 1);
    }, degradationMs);

    return () => clearInterval(interval);
  }, [degradationMs]);

  const repGrade = scoreGrade(zone_reputation);
  const detLevel = detectionLevel(activeDetections);

  return {
    stats: { active_detections: activeDetections, zone_reputation, armada_siaga: armadaSiaga },
    repGrade,
    detLevel,
  };
}
