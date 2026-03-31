import { MapPin, X } from "lucide-react";

type ZonaForm = { nama: string; deskripsi: string };

interface Props {
  open: boolean;
  isEdit: boolean;
  editId?: string;
  form: ZonaForm;
  saving: boolean;
  error: string;
  onClose: () => void;
  onChange: (patch: Partial<ZonaForm>) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
}

export function ZonaModal({ open, isEdit, editId, form, saving, error, onClose, onChange, onSubmit }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[28px] w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.2)] animate-[fadeUp_0.18s_ease-out] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#f0f5ee]">
              <MapPin size={16} className="text-[#588157]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="m-0 font-black text-[15px] text-slate-800">
                {isEdit ? "Edit Zona" : "Tambah Zona Baru"}
              </p>
              <p className="m-0 text-[11px] text-slate-400 mt-0.5">
                {isEdit ? `ID: ${editId}` : "Zona baru akan ditambahkan ke daftar"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-7 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase">
              Nama Zona <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => onChange({ nama: e.target.value })}
              placeholder="cth. Area Utama, Pasar Lama..."
              className="border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#588157] transition-colors placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase">
              Deskripsi
            </label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => onChange({ deskripsi: e.target.value })}
              placeholder="Keterangan singkat zona ini..."
              rows={3}
              className="border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#588157] transition-colors resize-none placeholder:text-slate-300"
            />
          </div>

          {error && (
            <p className="m-0 text-xs text-red-500 font-bold bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full text-sm font-black border-2 border-slate-200 text-slate-500 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-full text-sm font-black bg-[#588157] text-white border-none hover:bg-[#4a6d48] transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Zona"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
