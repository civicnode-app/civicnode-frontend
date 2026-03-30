"use client";

import { useState, useRef } from "react";
import { X, Minus, Plus, Truck, MapPin, AlertTriangle } from "lucide-react";
import { TriageZone, getAccentColor } from "../_types";

const MAX_PERSONEL = 30;
const MIN_PERSONEL = 1;

interface DispatchModalProps {
  target: TriageZone | null;
  onClose: () => void;
  onConfirm: (zone: TriageZone, jumlah: number) => void;
}

// Inner component — di-mount ulang via key setiap zona berganti,
// sehingga state jumlah otomatis reset ke 3 tanpa useEffect.
function ModalContent({
  target,
  onClose,
  onConfirm,
}: {
  target: TriageZone;
  onClose: () => void;
  onConfirm: (zone: TriageZone, jumlah: number) => void;
}) {
  const [jumlah, setJumlah] = useState(3);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCritical  = target.score < 50;
  const accentColor = getAccentColor(target.score);

  function clamp(val: number) {
    return Math.max(MIN_PERSONEL, Math.min(MAX_PERSONEL, val));
  }

  function handleInput(raw: string) {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) setJumlah(clamp(parsed));
    else if (raw === "") setJumlah(MIN_PERSONEL);
  }

  function handleConfirm() {
    onConfirm(target, jumlah);
    onClose();
  }

  const sliderPercent = ((jumlah - MIN_PERSONEL) / (MAX_PERSONEL - MIN_PERSONEL)) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
      {/* Accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl" style={{ backgroundColor: `${accentColor}18` }}>
            <Truck className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <div>
            <h2 className="font-black text-slate-800 text-lg leading-tight">Kirim Petugas</h2>
            <div className="flex items-center gap-1 text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span className="text-xs font-bold">{target.name} · {target.location}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Critical warning */}
      {isCritical && (
        <div className="mx-6 mb-4 flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-xs font-bold text-red-600">
            Zona ini dalam kondisi <span className="uppercase">kritis</span> (skor {target.score}%). Segera laksanakan pengiriman!
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="px-6 pb-2 flex flex-col gap-6">

        {/* Jumlah display + tombol +/- */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] font-extrabold text-slate-400 tracking-wider">JUMLAH PERSONEL</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setJumlah(clamp(jumlah - 1))}
              disabled={jumlah <= MIN_PERSONEL}
              className="w-9 h-9 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white"
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              ref={inputRef}
              type="number"
              min={MIN_PERSONEL}
              max={MAX_PERSONEL}
              value={jumlah}
              onChange={(e) => handleInput(e.target.value)}
              className="w-16 text-center text-2xl font-black text-slate-800 border-2 border-slate-200 rounded-xl py-1.5 focus:outline-none focus:border-[#588157] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <button
              onClick={() => setJumlah(clamp(jumlah + 1))}
              disabled={jumlah >= MAX_PERSONEL}
              className="w-9 h-9 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="flex flex-col gap-2">
          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
              style={{ width: `${sliderPercent}%`, backgroundColor: accentColor }}
            />
            <input
              type="range"
              min={MIN_PERSONEL}
              max={MAX_PERSONEL}
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-300">
            <span>{MIN_PERSONEL} orang</span>
            <span>{MAX_PERSONEL} orang</span>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex gap-3 p-6 pt-4">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer bg-white"
        >
          Batal
        </button>
        <button
          onClick={handleConfirm}
          className="flex-2 py-3 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-colors cursor-pointer border-2"
          style={{
            backgroundColor: accentColor,
            borderColor: accentColor,
            boxShadow: `0 4px 14px ${accentColor}40`,
          }}
        >
          <Truck className="w-4 h-4" />
          Laksanakan · {jumlah} Personel
        </button>
      </div>
    </div>
  );
}

// Wrapper — menangani backdrop dan null-guard
export function DispatchModal({ target, onClose, onConfirm }: DispatchModalProps) {
  if (!target) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <ModalContent key={target.id} target={target} onClose={onClose} onConfirm={onConfirm} />
    </div>
  );
}
