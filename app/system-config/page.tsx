"use client";
import React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function SystemConfigPage() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-end items-center gap-4">
          <div className="text-[22px] cursor-pointer relative leading-none">
            🔔
            <div className="absolute top-0 right-0 w-2.25 h-2.25 bg-red-500 rounded-full border-2 border-[#588157]"></div>
          </div>
          <div className="bg-[#a3b18a] py-1.5 px-5 rounded-full flex items-center gap-3 text-white">
            <div className="w-9.5 h-9.5 bg-[#eee] rounded-full border-2 border-[#333] shrink-0"></div>
            <div className="leading-[1.3]">
              <p className="font-extrabold m-0 text-sm">ATUN</p>
              <p className="text-[10px] m-0 opacity-80">OWNER</p>
            </div>
          </div>
        </header>

        {/* Config Grid — 3 kolom utama */}
        <div className="bg-[#CADBB7] rounded-[45px] p-9 flex-1 grid grid-cols-3 gap-5">
          {/* ── KOLOM 1: Profil & Favorit ── */}
          <div className="flex flex-col gap-4">
            {/* Profil Card */}
            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                👤 PROFILE
              </p>
              <div className="flex items-center gap-3.5 mt-3.5">
                <div className="w-13 h-13 bg-[#DAD7CD] rounded-full border-[3px] border-[#588157] shrink-0"></div>
                <div>
                  <p className="m-0 font-black text-[16px]">ATUN</p>
                  <p className="m-0 mt-0.5 text-xs text-[#588157] font-bold">
                    OWNER
                  </p>
                  <p className="m-0 mt-0.5 text-[11px] text-[#888]">
                    atun@civicnode.id
                  </p>
                </div>
              </div>
            </div>

            {/* My Favorites */}
            <div className="bg-white rounded-[28px] p-6 flex-1 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                ⭐ MY FAVORITE
              </p>
              <div className="mt-3.5 flex flex-col gap-2.5">
                {["Siring — CCTV 1", "Pasar Lama — CCTV 3"].map((loc) => (
                  <div
                    key={loc}
                    className="bg-[#f0f5ee] rounded-xl px-3.5 py-2.5 flex justify-between items-center"
                  >
                    <span className="font-bold text-[13px] text-[#333]">
                      {loc}
                    </span>
                    <span className="text-[16px] cursor-pointer opacity-50">
                      ✕
                    </span>
                  </div>
                ))}
                <div className="bg-[#e8eee5] rounded-xl px-3.5 py-2.5 border-2 border-dashed border-[#a3b18a] text-center cursor-pointer text-[#a3b18a] font-bold text-[13px]">
                  + Add Location
                </div>
              </div>
            </div>
          </div>

          {/* ── KOLOM 2: Kamera & Deteksi ── */}
          <div className="flex flex-col gap-4">
            {/* Camera Settings */}
            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                📷 CAMERA SETTINGS
              </p>
              <div className="mt-3.5 flex flex-col gap-3">
                {[
                  { label: "Resolution", value: "1080p HD" },
                  { label: "Frame Rate", value: "30 FPS" },
                  { label: "Detection Mode", value: "Auto AI" },
                  { label: "Snapshot Interval", value: "5 sec" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center border-b border-[#e0e8d8] pb-2"
                  >
                    <span className="text-xs text-[#666] font-semibold">
                      {row.label}
                    </span>
                    <span className="text-[13px] font-extrabold text-[#333]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-[28px] p-6 flex-1 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                🔔 NOTIFICATIONS
              </p>
              <div className="mt-3.5 flex flex-col gap-3">
                {[
                  { label: "Waste Detection Alert", on: true },
                  { label: "Node Offline Alert", on: true },
                  { label: "Daily Report", on: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-xs text-[#555] font-semibold">
                      {item.label}
                    </span>
                    <div
                      className={`w-9 h-5 rounded-[10px] relative cursor-pointer transition-colors duration-250 shrink-0 ${item.on ? "bg-[#588157]" : "bg-[#ccc]"}`}
                    >
                      <div
                        className={`absolute top-0.75 size-3.5 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left] duration-250 ${item.on ? "left-4.5" : "left-0.75"}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── KOLOM 3: Sistem & About ── */}
          <div className="flex flex-col gap-4">
            {/* Version System */}
            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                ⚙️ SYSTEM INFO
              </p>
              <div className="mt-3.5 flex flex-col gap-2.5">
                {[
                  { label: "App Version", value: "v1.0.0" },
                  { label: "AI Model", value: "YOLOv8n" },
                  { label: "Chain Network", value: "Polygon" },
                  { label: "Environment", value: "Production" },
                  { label: "Last Updated", value: "09 Mar 2026" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center border-b border-[#e0e8d8] pb-2"
                  >
                    <span className="text-xs text-[#666] font-semibold">
                      {row.label}
                    </span>
                    <span
                      className={`text-xs font-extrabold ${row.value === "v1.0.0" ? "text-[#588157]" : "text-[#333]"}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain Status */}
            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                ⛓️ BLOCKCHAIN
              </p>
              <div className="mt-3.5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] shrink-0"></div>
                  <span className="text-xs font-bold text-[#333]">
                    Node Connected
                  </span>
                </div>
                <p className="m-0 text-[11px] text-[#888] font-mono break-all">
                  0x4f3a...b91c
                </p>
                <p className="m-0 mt-1 text-[11px] text-[#666]">
                  Last TX: 1 min ago
                </p>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-[28px] p-6 flex-1 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
              <p className="m-0 text-[10px] font-extrabold tracking-widest text-[#a3b18a] uppercase">
                ℹ️ ABOUT
              </p>
              <div className="mt-3.5">
                <p className="m-0 font-black text-[15px] text-[#222]">
                  CivicNode AI
                </p>
                <p className="m-0 mt-1.5 text-xs text-[#666] leading-[1.6]">
                  Smart environmental surveillance platform powered by Computer
                  Vision &amp; Blockchain.
                </p>
                <p className="m-0 mt-3 text-[11px] text-[#a3b18a] font-bold">
                  © 2026 CivicNode Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
