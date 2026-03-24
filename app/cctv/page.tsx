'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';

type ViewMode = 'single' | 'dual' | 'triple';

const VIEW_OPTIONS: { label: string; value: ViewMode; desc: string }[] = [
  { label: 'Single View', value: 'single', desc: '1×1' },
  { label: 'Dual View',   value: 'dual',   desc: '1×2' },
  { label: 'Triple View', value: 'triple', desc: '1×3' },
];

const CCTV_DATA = [
  { label: 'CCTV 1', id: 'cctv-001', timestamp: '01 Mar 2026  21.24', camera: 'CAM-A', ip_address: '192.168.x.x' },
  { label: 'CCTV 2', id: 'cctv-002', timestamp: '01 Mar 2026  21.25', camera: 'CAM-B', ip_address: '192.168.x.x' },
  { label: 'CCTV 3', id: 'cctv-003', timestamp: '01 Mar 2026  21.26', camera: 'CAM-C', ip_address: '192.168.x.x' },
];

export default function CCTVPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dual');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visibleCount = viewMode === 'single' ? 1 : viewMode === 'dual' ? 2 : 3;
  const visibleNodes  = CCTV_DATA.slice(0, visibleCount);
  const currentView   = VIEW_OPTIONS.find(v => v.value === viewMode)!;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      {/* --- MAIN --- */}
      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6">

        {/* Header — kiri: title+badge | kanan: profile+dropdown */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-white font-extrabold text-xl tracking-[0.05em]">CCTV MONITOR</span>
            <span className="bg-[#a3b18a] text-white px-[14px] py-[5px] rounded-[20px] text-xs font-bold">
              {currentView.label} · {currentView.desc}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile pill */}
            <div className="bg-[#a3b18a] py-[6px] px-5 rounded-full flex items-center gap-3 text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
              <div className="w-10 h-10 bg-[#eee] rounded-full border-2 border-[#333] shrink-0"></div>
              <div className="leading-[1.2]">
                <p className="font-extrabold m-0 text-[15px]">ATUN</p>
                <p className="text-[10px] m-0 opacity-80">OWNER</p>
              </div>
            </div>

            {/* ⋮ Dropdown */}
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="text-[26px] font-bold cursor-pointer text-white bg-transparent border-none leading-none px-[10px] py-[6px] rounded-[10px] transition-colors duration-200 hover:bg-white/[0.18]"
              >
                ⋮
              </button>

              {dropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden min-w-[190px] z-[100] animate-[fadeDropdown_0.15s_ease-out]">
                  <p className="m-0 px-4 pt-3 pb-2 text-[10px] font-extrabold text-[#aaa] tracking-[0.1em] uppercase">
                    LAYOUT VIEW
                  </p>
                  {VIEW_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setViewMode(opt.value); setDropdownOpen(false); }}
                      className={`w-full px-4 py-[11px] border-none cursor-pointer text-left font-semibold text-sm flex justify-between items-center transition-colors duration-150 hover:bg-[#f5f5f5] ${
                        viewMode === opt.value
                          ? 'bg-[#f0f5ee] text-[#588157] font-extrabold hover:bg-[#f0f5ee]'
                          : 'bg-white text-[#333]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className={`text-[11px] font-semibold ${viewMode === opt.value ? 'text-[#a3b18a]' : 'text-[#bbb]'}`}>
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CCTV Grid — jumlah kartu berubah dinamis */}
        <div className="bg-[#CADBB7] rounded-[45px] p-7 flex gap-5 flex-1 items-stretch transition-all duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)]">
          {visibleNodes.map((node) => (
            <div
              key={node.id}
              className="flex-1 min-w-0 bg-white rounded-[36px] h-[550px] p-7 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer hover:scale-[1.025] hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)]"
            >
              {/* Card top */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-black text-lg m-0 text-black">{node.label}</p>
                  <p className="font-extrabold text-xs m-0 text-[#555] mt-1">{node.id}</p>
                </div>
                <p className="font-extrabold text-xs m-0 text-[#555]">{node.timestamp}</p>
              </div>

              {/* Preview area */}
              <div className="flex-1 bg-[#f5f5f5] rounded-3xl my-4 flex items-center justify-center">
                <span className="text-[40px] opacity-25">📷</span>
              </div>

              {/* Card bottom */}
              <div className="flex flex-col gap-1">
                <p className="font-black text-lg m-0 text-black">{node.camera}</p>
                <p className="font-bold text-[11px] m-0 text-[#666] font-mono tracking-[0.03em]">{node.ip_address}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
