"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  MapPin,
  Search,
  ChevronRight,
  CheckCircle2,
  Video,
  Wifi,
  WifiOff,
} from "lucide-react";

type TriageZone = {
  id: string;
  name: string;
  location: string;
  score: number;
  evidence_url: string;
  last_updated: string;
};

type CameraNode = {
  id: string;
  zone_id: string;
  name: string;
  ip_address: string;
  status: boolean;
  active_detections: number;
};

const DUMMY_ZONES: TriageZone[] = [
  {
    id: "z1",
    name: "Simpang Antasari",
    location: "Kecamatan Selatan",
    score: 42,
    evidence_url:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
    last_updated: "2 Menit Yg Lalu",
  },
  {
    id: "z2",
    name: "Pasar Sudimampur",
    location: "Kecamatan Barat",
    score: 28,
    evidence_url:
      "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&h=300&fit=crop",
    last_updated: "1 Menit Yg Lalu",
  },
  {
    id: "z3",
    name: "Taman Kamboja",
    location: "Kecamatan Tengah",
    score: 85,
    evidence_url:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    last_updated: "10 Menit Yg Lalu",
  },
  {
    id: "z4",
    name: "Jalan Veteran",
    location: "Kecamatan Timur",
    score: 62,
    evidence_url:
      "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400&h=300&fit=crop",
    last_updated: "5 Menit Yg Lalu",
  },
];

const DUMMY_CAMERAS: CameraNode[] = [
  {
    id: "c1",
    zone_id: "z1",
    name: "CCTV Antasari 01",
    ip_address: "192.168.1.10",
    status: true,
    active_detections: 4,
  },
  {
    id: "c2",
    zone_id: "z1",
    name: "CCTV Antasari 02",
    ip_address: "192.168.1.11",
    status: true,
    active_detections: 1,
  },
  {
    id: "c3",
    zone_id: "z2",
    name: "Node Sudimampur T",
    ip_address: "192.168.1.12",
    status: false,
    active_detections: 0,
  },
  {
    id: "c4",
    zone_id: "z2",
    name: "CCTV Pasar Malam",
    ip_address: "192.168.1.16",
    status: true,
    active_detections: 7,
  },
  {
    id: "c5",
    zone_id: "z3",
    name: "Node Kamboja 01",
    ip_address: "192.168.1.13",
    status: true,
    active_detections: 0,
  },
  {
    id: "c6",
    zone_id: "z3",
    name: "Node Kamboja 02",
    ip_address: "192.168.1.15",
    status: true,
    active_detections: 0,
  },
  {
    id: "c7",
    zone_id: "z4",
    name: "CCTV Veteran 01",
    ip_address: "192.168.1.14",
    status: true,
    active_detections: 5,
  },
];

export default function ZoneTriageList() {
  const [zones] = useState<TriageZone[]>(DUMMY_ZONES);

  // Sorting: Zona paling kritis (skor terendah) tampil di atas
  const sortedZones = useMemo(
    () => [...zones].sort((a, b) => a.score - b.score),
    [zones],
  );

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-white font-extrabold text-2xl tracking-tight">
            Zone Triage System
          </h2>
          <p className="text-white/80 font-medium text-sm mt-1">
            Memprioritaskan pengiriman petugas kebersihan ke zona kritis.
          </p>
        </div>
        <div className="bg-white/10 p-2 px-4 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-white text-xs font-bold">
            {DUMMY_CAMERAS.filter((c) => c.status).length} Active AI Nodes
          </span>
        </div>
      </div>

      {/* 2-column grid of zone cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {sortedZones.map((zone) => {
          const isCritical = zone.score < 50;
          const isWarning = zone.score >= 50 && zone.score < 80;


          const accentColor = isCritical
            ? "#ef4444"
            : isWarning
              ? "#f59e0b"
              : "#22c55e";
          const zoneCameras = DUMMY_CAMERAS.filter(
            (c) => c.zone_id === zone.id,
          );

          return (
            <div
              key={zone.id}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 overflow-hidden transition-shadow hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] flex flex-col"
            >
              {/* Accent top bar */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: accentColor }}
              />

              <div className="flex flex-1 min-h-0">
                {/* ── LEFT PANEL: Info Zona ── */}
                <div className="flex flex-col p-5 flex-2 border-r border-slate-100">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-lg text-slate-800 leading-tight">
                        {zone.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">
                          {zone.location}
                        </span>
                      </div>
                    </div>
                    <div
                      className="p-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: `${accentColor}18` }}
                    >
                      {isCritical ? (
                        <AlertTriangle
                          className="w-4 h-4"
                          style={{ color: accentColor }}
                        />
                      ) : (
                        <CheckCircle2
                          className="w-4 h-4"
                          style={{ color: accentColor }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Cleanliness Score */}
                  <div className="mb-4">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">
                        CLEANLINESS
                      </span>
                      <span
                        className="font-black text-lg leading-none"
                        style={{ color: accentColor }}
                      >
                        {zone.score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${zone.score}%`,
                          backgroundColor: accentColor,
                        }}
                        className="h-full rounded-full transition-all duration-1000"
                      />
                    </div>
                  </div>

                  {/* AI Evidence Thumbnail */}
                  <div className="relative w-full aspect-square bg-slate-100 rounded-2xl mb-4 overflow-hidden group/thumb shrink-0">
                    <Image
                      src={zone.evidence_url}
                      alt="AI Evidence"
                      fill
                      className="object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-2.5">
                      <span className="text-white text-[10px] font-bold tracking-wide">
                        {zone.last_updated}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                      <Search className="w-3.5 h-3.5" />
                      Bukti
                    </button>
                    <button
                      className="flex-[1.5] py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors border-2 cursor-pointer text-white"
                      style={{
                        backgroundColor: accentColor,
                        borderColor: accentColor,
                        boxShadow: isCritical
                          ? `0 4px 14px ${accentColor}40`
                          : "none",
                      }}
                    >
                      Kirim Petugas
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ── RIGHT PANEL: Daftar Kamera ── */}
                <div className="flex flex-col p-5 flex-[1.5] bg-slate-50/60 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">
                      KAMERA TERHUBUNG ({zoneCameras.length})
                    </span>
                  </div>

                  {zoneCameras.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-slate-300 text-xs font-bold text-center">
                        Belum ada kamera
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 overflow-y-auto">
                      {zoneCameras.map((cam) => (
                        <div
                          key={cam.id}
                          className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5 border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                        >
                          {/* Status dot */}
                          {cam.status ? (
                            <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <WifiOff className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black text-slate-700 truncate leading-tight">
                              {cam.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono leading-tight">
                              {cam.ip_address}
                            </p>
                          </div>

                          {/* Detection badge */}
                          {cam.active_detections > 0 && (
                            <span className="shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-50 text-red-500">
                              {cam.active_detections}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
