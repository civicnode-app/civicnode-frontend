interface Zona {
  id: string;
  nama: string;
  deskripsi: string;
  zone_reputation: number;
}

function reputationColor(score: number) {
  if (score >= 80) return { bg: "bg-[#f0f5ee]", text: "text-[#588157]" };
  if (score >= 60) return { bg: "bg-yellow-50",  text: "text-yellow-600" };
  if (score >= 40) return { bg: "bg-orange-50",  text: "text-orange-500" };
  return              { bg: "bg-red-50",      text: "text-red-500"    };
}

function reputationLabel(score: number) {
  if (score >= 80) return "BERSIH";
  if (score >= 60) return "CUKUP";
  if (score >= 40) return "KOTOR";
  return "KRITIS";
}

interface ZonaCardProps {
  zona: Zona;
  onEdit: () => void;
  onDelete: () => void;
}

export function ZonaCard({ zona, onEdit, onDelete }: ZonaCardProps) {
  const rep   = Math.round(zona.zone_reputation);
  const color = reputationColor(rep);

  return (
    <div className="bg-white rounded-[28px] p-6 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      {/* Top */}
      <div className="flex justify-between items-start gap-2">
        <p className="font-black text-[17px] text-black m-0 leading-tight">
          {zona.nama}
        </p>
        <span className={`shrink-0 ${color.bg} ${color.text} text-[10px] font-black px-2.5 py-1 rounded-full`}>
          {reputationLabel(rep)} · {rep}
        </span>
      </div>

      {/* Deskripsi */}
      <p className="text-[13px] text-[#666] m-0 flex-1 leading-relaxed">
        {zona.deskripsi || <span className="italic opacity-40">Tidak ada deskripsi</span>}
      </p>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-[#f0f0f0]">
        <button
          onClick={onEdit}
          className="flex-1 py-1.5 rounded-full text-[11px] font-black border-2 border-[#a3b18a] text-[#588157] bg-white hover:bg-[#f0f5ee] transition-colors duration-150 cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 py-1.5 rounded-full text-[11px] font-black border-2 border-red-200 text-red-400 bg-white hover:bg-red-50 transition-colors duration-150 cursor-pointer"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
