"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

type ViewMode = "single" | "dual" | "triple";

const VIEW_OPTIONS: { label: string; value: ViewMode; desc: string }[] = [
  { label: "Single View", value: "single", desc: "1×1" },
  { label: "Dual View",   value: "dual",   desc: "1×2" },
  { label: "Triple View", value: "triple", desc: "1×3" },
];

const DUMMY_LABELS = ["kaleng kosong", "bungkus permen", "botol plastik", "kantong kresek"];

const RESOLUTIONS = [
  { label: "Low",     value: "320x240"  },
  { label: "Medium",  value: "640x480"  },
  { label: "HD",      value: "1280x720" },
  { label: "Full HD", value: "1920x1080"},
];
const DEFAULT_RESOLUTION = "640x480";

interface CCTVNode {
  id: string;
  nama: string;
  ip_address: string;
  stream_url: string;
  status: boolean;
  active_detections: number;
  confidence_score: number;
  jenis_kamera: string;
  created_at: string;
  zona: { id: string; nama: string };
}

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
}

const initBoxes = (): BoundingBox[] =>
  Array.from({ length: 3 }, (_, i) => ({
    id: `box-${i}`,
    x: Math.random() * 55 + 5,
    y: Math.random() * 55 + 5,
    w: Math.random() * 12 + 10,
    h: Math.random() * 12 + 10,
    label: DUMMY_LABELS[i % DUMMY_LABELS.length],
    confidence: parseFloat((Math.random() * 0.25 + 0.72).toFixed(2)),
  }));

const driftBoxes = (prev: BoundingBox[]): BoundingBox[] =>
  prev.map((b) => ({
    ...b,
    x: Math.min(82, Math.max(2, b.x + (Math.random() - 0.5) * 3)),
    y: Math.min(80, Math.max(2, b.y + (Math.random() - 0.5) * 3)),
    confidence: parseFloat(
      Math.min(0.99, Math.max(0.5, b.confidence + (Math.random() - 0.5) * 0.04)).toFixed(2)
    ),
  }));

export default function CCTVPage() {
  const [viewMode, setViewMode]       = useState<ViewMode>("dual");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cctvList, setCctvList]       = useState<CCTVNode[]>([]);
  const [loading, setLoading]         = useState(true);
  const [aiEnabled, setAiEnabled]         = useState<Record<string, boolean>>({});
  const [streamLoaded, setStreamLoaded]   = useState<Record<string, boolean>>({});
  const [resolution, setResolution]       = useState<Record<string, string>>({});
  const [resDropdown, setResDropdown]     = useState<Record<string, boolean>>({});
  const [boxes, setBoxes]                 = useState<BoundingBox[]>(initBoxes);

  const dropRef = useRef<HTMLDivElement>(null);

  // tutup dropdown kalau klik luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // fetch list CCTV dari backend
  useEffect(() => {
    const fetchCctv = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) { setLoading(false); return; }
      try {
        const res  = await fetch(`${BACKEND_URL}/api/cctv`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setCctvList(json.data);
      } catch { /* pertahankan list kosong */ }
      finally { setLoading(false); }
    };
    fetchCctv();
  }, []);

  // animasi bounding box — jalan terus, hanya tampil kalau AI toggle on
  useEffect(() => {
    const id = setInterval(() => setBoxes(driftBoxes), 800);
    return () => clearInterval(id);
  }, []);

  const toggleAI = useCallback((cctv_id: string) => {
    setAiEnabled((prev) => ({ ...prev, [cctv_id]: !prev[cctv_id] }));
  }, []);

  const visibleCount = viewMode === "single" ? 1 : viewMode === "dual" ? 2 : 3;
  const visibleNodes = cctvList.slice(0, visibleCount);
  const currentView  = VIEW_OPTIONS.find((v) => v.value === viewMode)!;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-white font-extrabold text-xl tracking-[0.05em]">
              CCTV MONITOR
            </span>
            <span className="bg-[#a3b18a] text-white px-3.5 py-1.25 rounded-[20px] text-xs font-bold">
              {currentView.label} · {currentView.desc}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#a3b18a] py-1.5 px-5 rounded-full flex items-center gap-3 text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
              <div className="w-10 h-10 bg-[#eee] rounded-full border-2 border-[#333] shrink-0" />
              <div className="leading-[1.2]">
                <p className="font-extrabold m-0 text-[15px]">ATUN</p>
                <p className="text-[10px] m-0 opacity-80">OWNER</p>
              </div>
            </div>

            {/* dropdown layout */}
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="text-[26px] font-bold cursor-pointer text-white bg-transparent border-none leading-none px-2.5 py-1.5 rounded-[10px] transition-colors duration-200 hover:bg-white/18"
              >
                ⋮
              </button>
              {dropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden min-w-47.5 z-100">
                  <p className="m-0 px-4 pt-3 pb-2 text-[10px] font-extrabold text-[#aaa] tracking-widest uppercase">
                    Layout View
                  </p>
                  {VIEW_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setViewMode(opt.value); setDropdownOpen(false); }}
                      className={`w-full px-4 py-2.75 border-none cursor-pointer text-left font-semibold text-sm flex justify-between items-center transition-colors duration-150 hover:bg-[#f5f5f5] ${
                        viewMode === opt.value
                          ? "bg-[#f0f5ee] text-[#588157] font-extrabold hover:bg-[#f0f5ee]"
                          : "bg-white text-[#333]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className={`text-[11px] font-semibold ${viewMode === opt.value ? "text-[#a3b18a]" : "text-[#bbb]"}`}>
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CCTV Grid */}
        <div className="bg-[#CADBB7] rounded-[45px] p-7 flex gap-5 flex-1 items-stretch">

          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[#588157] font-bold opacity-50">Memuat kamera...</p>
            </div>
          )}

          {!loading && cctvList.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[#588157] font-bold opacity-50">Belum ada kamera terdaftar.</p>
            </div>
          )}

          {!loading && visibleNodes.map((node) => {
            const isAI = !!aiEnabled[node.id];
            return (
              <div
                key={node.id}
                className="flex-1 min-w-0 bg-white rounded-[36px] h-137.5 p-7 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
              >
                {/* Card top */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-lg m-0 text-black">{node.nama}</p>
                    <p className="font-extrabold text-xs m-0 text-[#888] mt-0.5">{node.zona.nama}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAI && (
                      <span className="bg-[#f0f5ee] text-[#588157] text-[11px] font-black px-2.5 py-1 rounded-full">
                        {node.active_detections} obj
                      </span>
                    )}
                    <span className={`w-2 h-2 rounded-full ${node.status ? "bg-green-400" : "bg-red-400"}`} />
                  </div>
                </div>

                {/* Preview + bounding box overlay */}
                <div className="relative flex-1 bg-[#f0f0f0] rounded-3xl my-4 overflow-hidden flex items-center justify-center">
                  {/* /video → /mjpegfeed untuk raw MJPEG stream */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${node.stream_url.replace(/\/video$/, "/mjpegfeed")}?${resolution[node.id] ?? DEFAULT_RESOLUTION}`}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoad={() => setStreamLoaded((prev) => ({ ...prev, [node.id]: true }))}
                  />
                  {!streamLoaded[node.id] && (
                    <span className="text-[40px] opacity-20">📷</span>
                  )}

                  {isAI && boxes.map((box) => (
                    <div
                      key={box.id}
                      className="absolute border-2 border-green-400 transition-all duration-700 ease-in-out"
                      style={{
                        left:   `${box.x}%`,
                        top:    `${box.y}%`,
                        width:  `${box.w}%`,
                        height: `${box.h}%`,
                      }}
                    >
                      <span className="absolute -top-5 left-0 bg-green-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                        {box.label} {box.confidence}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card bottom */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-black text-sm m-0 text-black">{node.jenis_kamera.toUpperCase()}</p>
                    <p className="font-bold text-[11px] m-0 text-[#666] font-mono tracking-[0.03em]">
                      {node.ip_address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Resolution dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setResDropdown((prev) => ({ ...prev, [node.id]: !prev[node.id] }))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black border-2 border-[#ddd] bg-white text-[#666] hover:border-[#a3b18a] hover:text-[#588157] transition-all duration-200 cursor-pointer"
                      >
                        <span>🖥</span>
                        <span>{resolution[node.id] ?? DEFAULT_RESOLUTION}</span>
                      </button>

                      {resDropdown[node.id] && (
                        <div className="absolute bottom-[calc(100%+6px)] right-0 bg-white rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden z-50 min-w-32">
                          <p className="m-0 px-3 pt-2.5 pb-1.5 text-[9px] font-extrabold text-[#aaa] tracking-widest uppercase">Resolusi</p>
                          {RESOLUTIONS.map((r) => (
                            <button
                              key={r.value}
                              onClick={() => {
                                setResolution((prev) => ({ ...prev, [node.id]: r.value }));
                                setStreamLoaded((prev) => ({ ...prev, [node.id]: false }));
                                setResDropdown((prev) => ({ ...prev, [node.id]: false }));
                              }}
                              className={`w-full px-3 py-2 border-none cursor-pointer text-left text-[11px] flex justify-between items-center transition-colors duration-150 hover:bg-[#f5f5f5] ${
                                (resolution[node.id] ?? DEFAULT_RESOLUTION) === r.value
                                  ? "bg-[#f0f5ee] text-[#588157] font-extrabold"
                                  : "bg-white text-[#333] font-semibold"
                              }`}
                            >
                              <span>{r.label}</span>
                              <span className="text-[10px] text-[#bbb]">{r.value}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* AI toggle */}
                    <button
                      onClick={() => toggleAI(node.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-black border-2 transition-all duration-200 cursor-pointer ${
                        isAI
                          ? "bg-[#588157] border-[#588157] text-white"
                          : "bg-white border-[#ddd] text-[#aaa] hover:border-[#a3b18a] hover:text-[#588157]"
                      }`}
                    >
                      <span>{isAI ? "🤖" : "🎥"}</span>
                      <span>{isAI ? "AI ON" : "AI OFF"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
