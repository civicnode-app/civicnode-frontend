import { MapPin, Camera, Wifi, WifiOff, Pencil, Trash2 } from "lucide-react";
import { Zona, CCTVNode, repColor, repLabel } from "../_types";

interface Props {
  zona: Zona;
  cameras: CCTVNode[];
  onEdit: () => void;
  onDelete: () => void;
}

function repAccent(score: number): string {
  if (score >= 80) return "#588157";
  if (score >= 60) return "#ca8a04";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function ZonaCard({ zona, cameras, onEdit, onDelete }: Props) {
  const noCam   = cameras.length === 0;
  const rep     = Math.round(zona.zone_reputation);
  const color   = noCam ? { bg: "bg-slate-100", text: "text-slate-400" } : repColor(rep);
  const accent  = noCam ? "#94a3b8" : repAccent(rep);
  const online  = cameras.filter((c) => c.status).length;

  return (
    <div className="bg-white rounded-[28px] overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:shadow-[0_10px_36px_rgba(0,0,0,0.13)] hover:-translate-y-0.5">

      {/* Accent strip */}
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: accent }} />

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 p-2 rounded-xl shrink-0" style={{ backgroundColor: `${accent}1a` }}>
              <MapPin size={14} style={{ color: accent }} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-black text-[15px] text-slate-800 leading-tight m-0">{zona.nama}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 m-0">{cameras.length} kamera terdaftar</p>
            </div>
          </div>
          <span className={`shrink-0 ${color.bg} ${color.text} text-[10px] font-black px-2.5 py-1 rounded-full`}>
            {noCam ? "TIDAK DIKETAHUI" : `${repLabel(rep)} · ${rep}`}
          </span>
        </div>

        {/* Cleanliness bar */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[9px] font-extrabold text-slate-400 tracking-widest">CLEANLINESS SCORE</span>
            <span className="text-[12px] font-black" style={{ color: accent }}>
              {noCam ? "—" : `${rep}%`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: noCam ? "0%" : `${rep}%`, backgroundColor: accent }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-[12px] text-slate-500 leading-relaxed m-0 line-clamp-2">
          {zona.deskripsi || <em className="opacity-40">Tidak ada deskripsi</em>}
        </p>

        {/* Camera list */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Camera size={11} className="text-slate-400" strokeWidth={2.5} />
            <span className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase">Kamera Terhubung</span>
            {online > 0 && (
              <span className="ml-auto text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {online} online
              </span>
            )}
          </div>
          {cameras.length === 0 ? (
            <p className="text-[11px] text-slate-300 italic m-0">Belum ada kamera</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {cameras.map((c) => (
                <span
                  key={c.id}
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status ? "bg-[#f0f5ee] text-[#588157]" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {c.status
                    ? <Wifi    size={8} strokeWidth={3} />
                    : <WifiOff size={8} strokeWidth={3} />
                  }
                  {c.nama}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 px-5 pb-5 pt-3 border-t border-slate-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black border-2 border-[#a3b18a] text-[#588157] bg-white hover:bg-[#f0f5ee] transition-colors duration-150 cursor-pointer"
        >
          <Pencil size={11} strokeWidth={2.5} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black border-2 border-red-200 text-red-400 bg-white hover:bg-red-50 transition-colors duration-150 cursor-pointer"
        >
          <Trash2 size={11} strokeWidth={2.5} /> Hapus
        </button>
      </div>
    </div>
  );
}
