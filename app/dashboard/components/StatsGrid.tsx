"use client";

import { useEffect, useState } from "react";
import ScoreRing from "./ScoreRing";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
const POLL_INTERVAL = 1000;

interface RealtimeStats {
  active_detections: number;
  confidence_score: number;
  zone_reputation: number;
}

export default function StatsGrid() {
  const [stats, setStats] = useState<RealtimeStats>({
    active_detections: 0,
    confidence_score: 0,
    zone_reputation: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await fetch(`${BACKEND_URL}/api/dev/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch {
        // gagal fetch — pertahankan nilai sebelumnya
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const confidencePercent = Math.round(stats.confidence_score * 100);

  const scoreGrade = (val: number) => {
    if (val >= 90) return { label: "A", color: "#22c55e" };
    if (val >= 75) return { label: "B", color: "#84cc16" };
    if (val >= 60) return { label: "C", color: "#eab308" };
    if (val >= 40) return { label: "D", color: "#f97316" };
    return             { label: "F", color: "#ef4444" };
  };

  const detectionLevel = (val: number) => {
    if (val === 0)  return { label: "CLEAR",  color: "#22c55e" };
    if (val <= 3)   return { label: "LOW",    color: "#84cc16" };
    if (val <= 7)   return { label: "MEDIUM", color: "#eab308" };
    return              { label: "HIGH",   color: "#ef4444" };
  };

  const repGrade  = scoreGrade(stats.zone_reputation);
  const confGrade = scoreGrade(confidencePercent);
  const detLevel  = detectionLevel(stats.active_detections);

  return (
    <section className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 mx-auto w-280">
      {/* Active Detections */}
      <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col gap-2 min-h-29 justify-between">
        <p className="m-0 text-[11px] font-bold text-[#888] tracking-[0.06em]">ACTIVE DETECTIONS</p>
        <div className="flex items-end justify-between">
          <p className="m-0 text-[28px] font-black text-[#222]">{stats.active_detections}</p>
          <span className="text-[11px] font-bold pb-1" style={{ color: detLevel.color }}>{detLevel.label}</span>
        </div>
      </div>

      {/* Zone Reputation */}
      <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col gap-2 min-h-29 justify-between">
        <p className="m-0 text-[11px] font-bold text-[#888] tracking-[0.06em]">ZONE REPUTATION</p>
        <div className="flex items-end justify-between">
          <p className="m-0 text-[28px] font-black text-[#222]">{stats.zone_reputation}</p>
          <span className="text-[20px] font-black pb-0.5" style={{ color: repGrade.color }}>{repGrade.label}</span>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col gap-1.5 min-h-29 justify-between">
        <p className="m-0 text-[11px] font-bold text-[#888] tracking-[0.06em]">CONFIDENCE SCORE</p>
        <div className="flex items-center gap-3">
          <ScoreRing score={confidencePercent} size={72} />
          <div className="flex flex-col gap-1">
            <p className="m-0 text-[11px] font-bold text-[#aaa]">{confidencePercent}/100</p>
            <span className="text-[18px] font-black" style={{ color: confGrade.color }}>{confGrade.label}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
