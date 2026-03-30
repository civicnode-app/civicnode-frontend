"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useDashboardStore, SimConfig } from "../_store/useDashboardStore";

// ── Helper: satu baris slider ────────────────────────────────────────────────
function ConfigSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">{label}</span>
        <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md min-w-10 text-center">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-[#588157] cursor-pointer"
      />
    </div>
  );
}

// ── Panel utama ───────────────────────────────────────────────────────────────
export function SimulationPanel() {
  const [open, setOpen] = useState(false);

  const config       = useDashboardStore((s) => s.config);
  const updateConfig = useDashboardStore((s) => s.updateConfig);
  const setArmada    = useDashboardStore((s) => s.setArmada);

  const [armadaInput, setArmadaInput] = useState(
    () => useDashboardStore.getState().armadaSiaga,
  );

  function patch(key: keyof SimConfig, value: number) {
    updateConfig({ [key]: value });
  }

  return (
    <>
      {/* ── Toggle button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Simulation Config"
        className="fixed bottom-6 right-6 z-50 bg-[#588157] text-white p-3.5 rounded-2xl shadow-lg hover:bg-[#4a6f47] active:scale-95 transition-all cursor-pointer"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>

      {/* ── Panel ── */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-slate-100 w-80 overflow-hidden">
          {/* Accent bar */}
          <div className="h-1 w-full bg-[#588157]" />

          <div className="p-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-800 text-sm leading-tight">Simulation Config</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Parameter simulasi real-time</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Timing */}
            <p className="text-[9px] font-extrabold text-slate-300 tracking-widest -mb-2">WAKTU TEMPUH</p>
            <ConfigSlider
              label="MENUJU ZONA"
              value={config.travelToFieldMs / 1000}
              min={0.5} max={30} step={0.5}
              display={`${(config.travelToFieldMs / 1000).toFixed(1)}s`}
              onChange={(v) => patch("travelToFieldMs", v * 1000)}
            />
            <ConfigSlider
              label="PULANG KE MARKAS"
              value={config.travelReturnMs / 1000}
              min={0.5} max={30} step={0.5}
              display={`${(config.travelReturnMs / 1000).toFixed(1)}s`}
              onChange={(v) => patch("travelReturnMs", v * 1000)}
            />

            <div className="h-px bg-slate-100" />

            {/* Speeds */}
            <p className="text-[9px] font-extrabold text-slate-300 tracking-widest -mb-2">KECEPATAN SIMULASI</p>
            <ConfigSlider
              label="INTERVAL DEGRADASI"
              value={config.degradationMs / 1000}
              min={0.2} max={10} step={0.1}
              display={`${(config.degradationMs / 1000).toFixed(1)}s`}
              onChange={(v) => patch("degradationMs", v * 1000)}
            />
            <ConfigSlider
              label="INTERVAL PEMBERSIHAN"
              value={config.recoveryTickMs / 1000}
              min={0.2} max={5} step={0.1}
              display={`${(config.recoveryTickMs / 1000).toFixed(1)}s`}
              onChange={(v) => patch("recoveryTickMs", v * 1000)}
            />
            <ConfigSlider
              label="POIN/PETUGAS/TICK"
              value={config.pointsPerOfficer}
              min={0.1} max={10} step={0.1}
              display={config.pointsPerOfficer % 1 === 0
                ? `${config.pointsPerOfficer}`
                : config.pointsPerOfficer.toFixed(1)}
              onChange={(v) => patch("pointsPerOfficer", v)}
            />

            <div className="h-px bg-slate-100" />

            {/* Armada Siaga */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">ARMADA SIAGA</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={armadaInput}
                  onChange={(e) => setArmadaInput(Number(e.target.value))}
                  className="flex-1 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-800 focus:outline-none focus:border-[#588157] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setArmada(armadaInput)}
                  className="px-4 py-2 bg-[#588157] text-white rounded-xl font-bold text-xs hover:bg-[#4a6f47] transition-colors cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
