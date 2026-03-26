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
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[28px] p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <p className="m-0 font-black text-lg text-black">{isEdit ? "Edit Zona" : "Tambah Zona"}</p>
        <p className="m-0 mt-1 text-xs text-[#888]">{isEdit ? `ID: ${editId}` : "Data zona baru"}</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#555] tracking-wide">
              NAMA ZONA <span className="text-red-400">*</span>
            </label>
            <input type="text" value={form.nama} onChange={(e) => onChange({ nama: e.target.value })}
              placeholder="cth. Area Utama, Pasar Lama..."
              className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#555] tracking-wide">DESKRIPSI</label>
            <textarea value={form.deskripsi} onChange={(e) => onChange({ deskripsi: e.target.value })}
              placeholder="Keterangan singkat zona ini..."
              rows={3}
              className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors resize-none" />
          </div>

          {error && <p className="m-0 text-xs text-red-500 font-bold">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-full text-sm font-black border-2 border-[#ddd] text-[#888] bg-white hover:bg-[#f5f5f5] transition-colors cursor-pointer">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-full text-sm font-black bg-[#588157] text-white border-none hover:bg-[#4a6d48] transition-colors cursor-pointer disabled:opacity-50">
              {saving ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
