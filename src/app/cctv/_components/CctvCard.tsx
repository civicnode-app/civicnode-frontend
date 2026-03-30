import { CCTVNode } from "../_types";
import { Camera, MapPin, Activity, Wifi, WifiOff, Eye } from "lucide-react";

interface Props {
  node: CCTVNode;
  onEdit: () => void;
  onDelete: () => void;
}

export function CctvCard({ node, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-6 flex flex-col gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex bg-[#f0f5ee] rounded-full p-2.5 items-center justify-center shrink-0">
            <Camera className="w-4 h-4 text-[#588157]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-[15px] text-gray-900 leading-tight truncate">{node.nama}</h3>
            <div className="flex items-center gap-1 mt-0.5 text-[#888]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="text-[11px] font-bold truncate">{node.zona.nama}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {node.active_detections > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {node.active_detections} ALERT
            </span>
          )}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${
            node.status
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}>
            {node.status
              ? <Wifi    className="w-3 h-3" />
              : <WifiOff className="w-3 h-3" />
            }
            {node.status ? "ONLINE" : "OFFLINE"}
          </div>
        </div>
      </div>

      {/* ── Info Grid ── */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-3 bg-[#f8faf7] rounded-2xl p-4">
        <div>
          <p className="text-[9px] font-extrabold text-[#aaa] tracking-widest mb-0.5">IP ADDRESS</p>
          <p className="text-[12px] font-black text-gray-800 font-mono">{node.ip_address}</p>
        </div>
        <div>
          <p className="text-[9px] font-extrabold text-[#aaa] tracking-widest mb-0.5">JENIS</p>
          <p className="text-[12px] font-black text-gray-800 uppercase">{node.jenis_kamera}</p>
        </div>
        <div>
          <p className="text-[9px] font-extrabold text-[#aaa] tracking-widest mb-0.5">DETEKSI AKTIF</p>
          <div className="flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-[#588157]" />
            <p className="text-[12px] font-black text-gray-800">{node.active_detections} objek</p>
          </div>
        </div>
      </div>

      {/* ── Stream URL ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f5ee] rounded-xl">
        <Activity className="w-3 h-3 text-[#588157] shrink-0" />
        <span className="text-[10px] font-mono text-[#666] truncate">{node.stream_url}</span>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-2">
        <button onClick={onEdit}
          className="flex-1 py-2 rounded-full text-[11px] font-black border-2 border-[#a3b18a] text-[#588157] bg-white hover:bg-[#588157] hover:text-white transition-all duration-200 cursor-pointer">
          Edit
        </button>
        <button onClick={onDelete}
          className="flex-1 py-2 rounded-full text-[11px] font-black border-2 border-red-200 text-red-500 bg-white hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer">
          Hapus
        </button>
      </div>
    </div>
  );
}
