"use client";

import { useEffect, useState } from "react";
import ScoreRing from "./ScoreRing";

interface RealtimeStats {
  active_detections: number;
  confidence_score: number;
  zone_reputation: number;
}

export default function StatsGrid() {
  const [stats, setStats] = useState<RealtimeStats>({
    active_detections: 12,
    confidence_score: 0.82,
    zone_reputation: 64,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        active_detections: Math.max(0, prev.active_detections + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)),
        confidence_score: Math.min(0.99, Math.max(0.70, prev.confidence_score + (Math.random() - 0.5) * 0.05)),
        zone_reputation: Math.round(Math.min(100, Math.max(30, prev.zone_reputation + (Math.random() - 0.5) * 1.5))),
      }));
    }, 2000); // perbarui stat setiap 2 detik seolah-olah streaming
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
