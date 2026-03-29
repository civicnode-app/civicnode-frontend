import { CCTVNode } from "../_types";
import { Camera, MapPin, Activity } from "lucide-react";

interface Props {
  node: CCTVNode;
  onEdit: () => void;
  onDelete: () => void;
}

export function CctvCard({ node, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-[36px] p-7 flex flex-col justify-between aspect-square shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] hover:-translate-y-1">
      {/* ── Top Header ── */}
      <div className="flex justify-between items-start">
        <div className="flex bg-[#f0f5ee] rounded-full p-2.5 items-center justify-center">
          <Camera className="w-5 h-5 text-[#588157]" />
        </div>
        <div className="flex items-center gap-2">
          {node.active_detections > 0 && (
            <span className="bg-[#588157] text-white text-[11px] font-black px-2.5 py-1 rounded-full animate-pulse shadow-sm shadow-[#588157]/30">
              {node.active_detections} ALERT
            </span>
          )}
          <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${node.status ? "bg-green-400 shadow-green-400/50" : "bg-red-400 shadow-red-400/50"}`} />
        </div>
      </div>

      {/* ── Middle Info ── */}
      <div className="flex flex-col flex-1 justify-center mt-4">
        <h3 className="font-black text-2xl text-gray-900 leading-tight line-clamp-2 mb-1.5">{node.nama}</h3>
        <div className="flex items-center gap-1.5 text-[#666]">
          <MapPin className="w-3.5 h-3.5" />
          <p className="font-bold text-xs m-0 truncate">{node.zona.nama}</p>
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-[#888]">
          <Activity className="w-4 h-4" />
          <span className="font-bold text-[11px] font-mono tracking-widest truncate">{node.ip_address}</span>
        </div>
        
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
    </div>
  );
}
