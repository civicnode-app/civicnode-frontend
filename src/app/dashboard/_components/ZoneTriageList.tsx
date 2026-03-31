"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Search, ChevronRight, CheckCircle2, Video, Wifi, WifiOff, Users, CameraOff, Cctv, Layers } from "lucide-react";
import { DispatchModal } from "./DispatchModal";
import { useZoneTriage } from "../_hooks/useZoneTriage";
import { getAccentColor } from "../_types";

type Filter = "semua" | "tidak-terpantau" | "kritis" | "kotor" | "bersih";

const FILTERS: { id: Filter; label: string; color: string; activeClass: string }[] = [
  { id: "semua",           label: "Semua Zona",       color: "#64748b", activeClass: "bg-white text-slate-700"          },
  { id: "tidak-terpantau", label: "Tidak Terpantau",  color: "#94a3b8", activeClass: "bg-slate-400 text-white"          },
  { id: "kritis",          label: "Zona Kritis",      color: "#ef4444", activeClass: "bg-red-500 text-white"            },
  { id: "kotor",           label: "Zona Kotor",       color: "#f97316", activeClass: "bg-orange-500 text-white"         },
  { id: "bersih",          label: "Zona Bersih",      color: "#588157", activeClass: "bg-[#588157] text-white"          },
];

function matchFilter(score: number | null, filter: Filter): boolean {
  if (filter === "semua")           return true;
  if (filter === "tidak-terpantau") return score === null;
  if (filter === "kritis")          return score !== null && score < 40;
  if (filter === "kotor")           return score !== null && score >= 40 && score < 80;
  if (filter === "bersih")          return score !== null && score >= 80;
  return true;
}

export default function ZoneTriageList() {
  const {
    sortedZones,
    zoneDispatches,
    dispatchTarget,
    activeCameraCount,
    getCamerasForZone,
    openDispatch,
    closeDispatch,
    handleDispatchConfirm,
  } = useZoneTriage();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<Filter>("semua");

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-white font-extrabold text-2xl tracking-tight">Zone Triage System</h2>
          <p className="text-white/80 font-medium text-sm mt-1">
            Memprioritaskan pengiriman petugas kebersihan ke zona kritis.
          </p>
        </div>
        <div className="bg-white/10 p-2 px-4 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-white text-xs font-bold">{activeCameraCount} Active AI Nodes</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(({ id, label, activeClass }) => {
          const count = id === "semua"
            ? sortedZones.length
            : sortedZones.filter((z) => matchFilter(z.score, id)).length;
          const isActive = activeFilter === id;
          return (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-black border-none cursor-pointer transition-all duration-200 ${
                isActive
                  ? activeClass
                  : "bg-white/15 text-white/70 hover:bg-white/25 hover:text-white"
              }`}
            >
              {id === "semua" && <Layers size={11} strokeWidth={2.5} />}
              {label}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-black/15" : "bg-white/20"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {sortedZones.filter((z) => matchFilter(z.score, activeFilter)).map((zone) => {
          const isUnmonitored = zone.score === null;
          const isCritical    = zone.score !== null && zone.score < 50;
          const accentColor   = getAccentColor(zone.score);
          const zoneCameras   = getCamerasForZone(zone.id);
          const dispatched    = zoneDispatches[zone.id] ?? 0;

          return (
            <motion.div
              key={zone.id}
              layout
              transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 overflow-hidden transition-shadow hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] flex flex-col"
            >
              {/* Accent top bar */}
              <div
                className={`h-1 w-full ${isUnmonitored ? "bg-[repeating-linear-gradient(90deg,#cbd5e1_0px,#cbd5e1_8px,transparent_8px,transparent_16px)]" : ""}`}
                style={isUnmonitored ? undefined : { backgroundColor: accentColor }}
              />

              <div className="flex flex-1 min-h-0">
                {/* ── LEFT PANEL ── */}
                <div className="flex flex-col p-5 flex-2 border-r border-slate-100">

                  {/* Header — sama untuk semua zona */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-lg text-slate-800 leading-tight">{zone.name}</h3>
                      <div className="flex items-center gap-1 mt-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{zone.location}</span>
                      </div>
                    </div>
                    <div className="p-1.5 rounded-full shrink-0" style={{ backgroundColor: `${accentColor}18` }}>
                      {isUnmonitored
                        ? <CameraOff    className="w-4 h-4 text-slate-400" />
                        : isCritical
                          ? <AlertTriangle className="w-4 h-4" style={{ color: accentColor }} />
                          : <CheckCircle2  className="w-4 h-4" style={{ color: accentColor }} />
                      }
                    </div>
                  </div>

                  {isUnmonitored ? (
                    /* ── State: Tidak Terpantau ── */
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-2xl mb-4 gap-3 py-10 border-2 border-dashed border-slate-200">
                      <div className="p-3 rounded-full bg-white border border-slate-200">
                        <CameraOff className="w-5 h-5 text-slate-300" />
                      </div>
                      <div className="text-center px-4">
                        <p className="text-[11px] font-extrabold text-slate-400 tracking-wider">TIDAK TERPANTAU</p>
                        <p className="text-[10px] text-slate-300 font-medium mt-1 leading-relaxed">
                          Belum ada kamera aktif.<br />Tingkat kebersihan tidak diketahui.
                        </p>
                      </div>
                      {/* Badge petugas — tampil di dalam placeholder saat ada dispatch */}
                      {dispatched > 0 && (
                        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5">
                          <Users className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="text-[10px] font-extrabold text-amber-700 leading-none">
                            {dispatched} Petugas di Lapangan
                          </span>
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-1 shrink-0" />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ── State: Terpantau — score + thumbnail ── */
                    <>
                      {/* Cleanliness Score */}
                      <div className="mb-4">
                        <div className="flex justify-between items-end mb-1.5">
                          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">CLEANLINESS</span>
                          <span className="font-black text-lg leading-none" style={{ color: accentColor }}>
                            {parseFloat((zone.score as number).toFixed(2))}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${zone.score}%`, backgroundColor: accentColor }}
                            className="h-full rounded-full transition-all duration-1000"
                          />
                        </div>
                        {dispatched > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                            <Users className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="text-[10px] font-extrabold text-amber-700 leading-none">
                              {dispatched} Petugas di Lapangan
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-auto shrink-0" />
                          </div>
                        )}
                      </div>

                      {/* AI Evidence Thumbnail */}
                      <div className="relative w-full aspect-square bg-slate-100 rounded-2xl mb-4 overflow-hidden group/thumb shrink-0">
                        {zone.evidence_url ? (
                          <Image
                            src={zone.evidence_url}
                            alt="AI Evidence"
                            fill
                            className="object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                            Tidak ada gambar
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-2.5">
                          <span className="text-white text-[10px] font-bold tracking-wide">{zone.last_updated}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    {!isUnmonitored && (
                      <button className="flex-1 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                        <Search className="w-3.5 h-3.5" />
                        Bukti
                      </button>
                    )}
                    <button
                      onClick={() => isUnmonitored ? router.push("/cctv") : openDispatch(zone)}
                      className="flex-[1.5] py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors border-2 cursor-pointer text-white"
                      style={{
                        backgroundColor: isUnmonitored ? "#588157" : accentColor,
                        borderColor:     isUnmonitored ? "#588157" : accentColor,
                        boxShadow: isCritical ? `0 4px 14px ${accentColor}40` : "none",
                      }}
                    >
                      {isUnmonitored ? (
                        <><Cctv className="w-3.5 h-3.5" />Pasang CCTV</>
                      ) : (
                        <>Kirim Petugas<ChevronRight className="w-3.5 h-3.5" /></>
                      )}
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
                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                      {isUnmonitored && <CameraOff className="w-5 h-5 text-slate-200" />}
                      <p className="text-slate-300 text-xs font-bold text-center">
                        {isUnmonitored ? "Pasang kamera untuk\nmemantau zona ini" : "Belum ada kamera"}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 overflow-y-auto">
                      {zoneCameras.map((cam) => (
                        <div
                          key={cam.id}
                          className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5 border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                        >
                          {cam.status
                            ? <Wifi    className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            : <WifiOff className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                          }
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black text-slate-700 truncate leading-tight">{cam.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono leading-tight">{cam.ip_address}</p>
                          </div>
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
            </motion.div>
          );
        })}
      </div>

      {/* Dispatch Modal */}
      <DispatchModal
        target={dispatchTarget}
        onClose={closeDispatch}
        onConfirm={handleDispatchConfirm}
      />
    </div>
  );
}
