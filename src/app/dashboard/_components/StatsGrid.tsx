"use client";

import { Truck, ScanSearch, ShieldAlert } from "lucide-react";
import { useStats } from "../_hooks/useStats";

export default function StatsGrid() {
  const { stats, repGrade, detLevel } = useStats();

  return (
    <section className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 mx-auto w-280">
      {/* Active Detections */}
      <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col gap-2 min-h-29 justify-between relative overflow-hidden group">
        <p className="m-0 text-[11px] font-bold text-[#888] tracking-[0.06em] relative z-10">
          ACTIVE DETECTIONS
        </p>
        <div className="flex items-end justify-between relative z-10">
          <div className="flex items-baseline gap-2">
            <p className="m-0 text-[28px] font-black" style={{ color: detLevel.color }}>
              {stats.active_detections}
            </p>
            <span className="text-[12px] font-bold text-[#888] pb-1">Objek</span>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${detLevel.color}18` }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: detLevel.color }} />
            <span className="text-[9px] font-bold" style={{ color: detLevel.color }}>
              {detLevel.label}
            </span>
          </div>
        </div>
        <ScanSearch className="absolute -right-2 -bottom-2 w-20 h-20 text-[#f3f4f6] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
      </div>

      {/* Zone Reputation */}
      <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col gap-2 min-h-29 justify-between relative overflow-hidden group">
        <p className="m-0 text-[11px] font-bold text-[#888] tracking-[0.06em] relative z-10">
          ZONE REPUTATION
        </p>
        <div className="flex items-end justify-between relative z-10">
          <div className="flex items-baseline gap-2">
            <p className="m-0 text-[28px] font-black" style={{ color: repGrade.color }}>
              {stats.zone_reputation}
            </p>
            <span className="text-[12px] font-bold text-[#888] pb-1">/ 100</span>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${repGrade.color}18` }}
          >
            <span className="text-[14px] font-black" style={{ color: repGrade.color }}>
              {repGrade.label}
            </span>
          </div>
        </div>
        <ShieldAlert className="absolute -right-2 -bottom-2 w-20 h-20 text-[#f3f4f6] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
      </div>

      {/* Armada Siaga */}
      <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col gap-2 min-h-29 justify-between relative overflow-hidden group">
        <p className="m-0 text-[11px] font-bold text-[#888] tracking-[0.06em] relative z-10">
          ARMADA SIAGA
        </p>
        <div className="flex items-end justify-between relative z-10">
          <div className="flex items-baseline gap-2">
            <p className="m-0 text-[28px] font-black text-[#588157]">{stats.armada_siaga}</p>
            <span className="text-[12px] font-bold text-[#888] pb-1">Personel</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#f0f5ee] px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[9px] font-bold text-[#588157]">STANDBY</span>
          </div>
        </div>
        <Truck className="absolute -right-2 -bottom-2 w-20 h-20 text-[#f0f5ee] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
      </div>
    </section>
  );
}
