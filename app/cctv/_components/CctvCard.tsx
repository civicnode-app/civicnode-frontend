import { CCTVNode, BoundingBox } from "../_types";
import { StreamImg } from "./StreamImg";

interface Props {
  node: CCTVNode;
  isAI: boolean;
  streamLoaded: boolean;
  boxes: BoundingBox[];
  onToggleAI: () => void;
  onStreamLoad: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CctvCard({ node, isAI, streamLoaded, boxes, onToggleAI, onStreamLoad, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-[36px] p-7 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      {/* Top */}
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

      {/* Stream + bounding boxes */}
      <div className="relative aspect-square bg-[#f0f0f0] rounded-3xl overflow-hidden flex items-center justify-center">
        <StreamImg
          src={node.stream_url.replace(/\/video$/, "/mjpegfeed")}
          onLoad={onStreamLoad}
        />
        {!streamLoaded && <span className="text-[40px] opacity-20">📷</span>}
        {isAI && boxes.map((box) => (
          <div
            key={box.id}
            className="absolute border-2 border-green-400 transition-all duration-700 ease-in-out"
            style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
          >
            <span className="absolute -top-5 left-0 bg-green-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
              {box.label} {box.confidence}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-sm m-0 text-black">{node.jenis_kamera.toUpperCase()}</p>
            <p className="font-bold text-[11px] m-0 text-[#666] font-mono tracking-[0.03em]">{node.ip_address}</p>
          </div>
          <button
            onClick={onToggleAI}
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
        <div className="flex gap-2 pt-2 border-t border-[#f0f0f0]">
          <button onClick={onEdit}
            className="flex-1 py-1.5 rounded-full text-[11px] font-black border-2 border-[#a3b18a] text-[#588157] bg-white hover:bg-[#f0f5ee] transition-colors duration-150 cursor-pointer">
            Edit
          </button>
          <button onClick={onDelete}
            className="flex-1 py-1.5 rounded-full text-[11px] font-black border-2 border-red-200 text-red-400 bg-white hover:bg-red-50 transition-colors duration-150 cursor-pointer">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
