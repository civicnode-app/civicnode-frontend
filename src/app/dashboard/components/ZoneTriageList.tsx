"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AlertTriangle, MapPin, Search, ChevronRight, CheckCircle2 } from "lucide-react";

// Tipe Data Dummy
type TriageZone = {
  id: string;
  name: string;
  location: string;
  score: number;
  evidence_url: string;
  last_updated: string;
};

// Data Dummy Sesuai Perintah Iterasi
const DUMMY_ZONES: TriageZone[] = [
  {
    id: "z1",
    name: "Simpang Antasari",
    location: "Kecamatan Selatan",
    score: 42,
    evidence_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
    last_updated: "2 Menit Yg Lalu",
  },
  {
    id: "z2",
    name: "Pasar Sudimampur",
    location: "Kecamatan Barat",
    score: 28,
    evidence_url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&h=300&fit=crop",
    last_updated: "1 Menit Yg Lalu",
  },
  {
    id: "z3",
    name: "Taman Kamboja",
    location: "Kecamatan Tengah",
    score: 85,
    evidence_url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    last_updated: "10 Menit Yg Lalu",
  },
  {
    id: "z4",
    name: "Jalan Veteran",
    location: "Kecamatan Timur",
    score: 62,
    evidence_url: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400&h=300&fit=crop",
    last_updated: "5 Menit Yg Lalu",
  },
];

export default function ZoneTriageList() {
  const [zones] = useState<TriageZone[]>(DUMMY_ZONES);

  // Sorting Algorithm: Lowest Cleanliness Score at Top
  const sortedZones = useMemo(() => {
    return [...zones].sort((a, b) => a.score - b.score);
  }, [zones]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-white font-extrabold text-2xl tracking-tight">Zone Triage System</h2>
          <p className="text-white/80 font-medium text-sm mt-1">
            Memprioritaskan pengiriman petugas kebun ke zona kritis.
          </p>
        </div>
        <div className="bg-white/10 p-2 px-4 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-white text-xs font-bold">12 Active AI Nodes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {sortedZones.map((zone) => {
          const isCritical = zone.score < 50;
          const isWarning = zone.score >= 50 && zone.score < 80;
          const isGood = zone.score >= 80;

          return (
            <div
              key={zone.id}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col transition-transform hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] border border-white/50 relative overflow-hidden group"
            >
              {isCritical && (
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded-t-3xl" />
              )}
              {isWarning && (
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-400 rounded-t-3xl" />
              )}
              {isGood && (
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 rounded-t-3xl" />
              )}

              {/* Header Info */}
              <div className="flex justify-between items-start mb-4">
                <div className="pr-2">
                  <h3 className="font-black text-lg text-slate-800 leading-tight">
                    {zone.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{zone.location}</span>
                  </div>
                </div>
                {isCritical ? (
                  <div className="bg-red-100 text-red-600 p-1.5 rounded-full shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Progress Bar / Cleanliness Score */}
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-extrabold text-slate-400 tracking-wider">
                    CLEANLINESS
                  </span>
                  <span
                    className={`font-black text-lg leading-none ${
                      isCritical ? "text-red-500" : isWarning ? "text-amber-500" : "text-emerald-500"
                    }`}
                  >
                    {zone.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${zone.score}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isCritical ? "bg-red-500" : isWarning ? "bg-amber-400" : "bg-emerald-500"
                    }`}
                  />
                </div>
              </div>

              {/* AI Evidence Thumbnail */}
              <div className="relative w-full h-28 bg-slate-100 rounded-2xl mb-4 overflow-hidden">
                <Image
                  src={zone.evidence_url}
                  alt="AI Evidence"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-2.5">
                  <span className="text-white text-[10px] font-bold tracking-wide">
                    {zone.last_updated}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  <Search className="w-3.5 h-3.5" />
                  Bukti
                </button>
                <button
                  className={`flex-[1.5] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors border-2 cursor-pointer ${
                    isCritical
                      ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                      : "bg-slate-800 border-slate-800 text-white hover:bg-black hover:border-black"
                  }`}
                >
                  Kirim Petugas
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
