"use client";

import { useEffect, useState } from "react";
import { RealtimeStats, detectionLevel, scoreGrade } from "../_types";

export function useStats() {
  const [stats, setStats] = useState<RealtimeStats>({
    active_detections: 12,
    armada_siaga: 24,
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
        armada_siaga: Math.round(
          Math.min(30, Math.max(15, prev.armada_siaga + (Math.random() - 0.5) * 2)),
        ),
        zone_reputation: Math.round(
          Math.min(100, Math.max(30, prev.zone_reputation + (Math.random() - 0.5) * 1.5)),
        ),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const repGrade  = scoreGrade(stats.zone_reputation);
  const detLevel  = detectionLevel(stats.active_detections);

  return { stats, repGrade, detLevel };
}
