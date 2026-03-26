import { Zona, CCTVNode, repColor, repLabel } from "../_types";

interface Props {
  zona: Zona;
  cameras: CCTVNode[];
  onEdit: () => void;
  onDelete: () => void;
}

export function ZonaCard({ zona, cameras, onEdit, onDelete }: Props) {
  const rep   = Math.round(zona.zone_reputation);
  const color = repColor(rep);

  return (
    <div className="bg-white rounded-[28px] p-6 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex justify-between items-start gap-2">
        <p className="font-black text-[17px] text-black m-0 leading-tight">{zona.nama}</p>
        <span className={`shrink-0 ${color.bg} ${color.text} text-[10px] font-black px-2.5 py-1 rounded-full`}>
          {repLabel(rep)} · {rep}
        </span>
      </div>

      <p className="text-[13px] text-[#666] m-0 leading-relaxed">
        {zona.deskripsi || <span className="italic opacity-40">Tidak ada deskripsi</span>}
      </p>

      <div className="flex flex-col gap-1.5">
        <p className="m-0 text-[10px] font-extrabold text-[#aaa] tracking-widest uppercase">📷 Kamera Terhubung</p>
        {cameras.length === 0 ? (
          <p className="m-0 text-[12px] text-[#bbb] italic">Belum ada kamera</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {cameras.map((c) => (
              <span key={c.id} className="bg-[#f0f5ee] text-[#588157] text-[11px] font-bold px-2.5 py-1 rounded-full">
                {c.nama}
              </span>
            ))}
          </div>
        )}
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
  );
}
