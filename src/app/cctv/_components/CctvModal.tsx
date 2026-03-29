import { Zona } from "../_types";

type CctvForm = {
  nama: string; zona_id: string; jenis_kamera: string;
  stream_url: string; ip_address: string; latitude: string; longitude: string;
};

interface Props {
  open: boolean;
  isEdit: boolean;
  editId?: string;
  form: CctvForm;
  zonaList: Zona[];
  saving: boolean;
  error: string;
  onClose: () => void;
  onChange: (patch: Partial<CctvForm>) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
}

export function CctvModal({ open, isEdit, editId, form, zonaList, saving, error, onClose, onChange, onSubmit }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[28px] p-8 w-full max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <p className="m-0 font-black text-lg text-black">{isEdit ? "Edit Kamera" : "Tambah Kamera"}</p>
        <p className="m-0 mt-1 text-xs text-[#888]">{isEdit ? `ID: ${editId}` : "Data kamera baru"}</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#555] tracking-wide">
              NAMA KAMERA <span className="text-red-400">*</span>
            </label>
            <input type="text" value={form.nama} onChange={(e) => onChange({ nama: e.target.value })}
              placeholder="cth. Kamera Pintu Utara..."
              className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors" />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-extrabold text-[#555] tracking-wide">
                ZONA <span className="text-red-400">*</span>
              </label>
              <select value={form.zona_id} onChange={(e) => onChange({ zona_id: e.target.value })}
                className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors bg-white">
                <option value="">— Pilih Zona —</option>
                {zonaList.map((z) => <option key={z.id} value={z.id}>{z.nama}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-extrabold text-[#555] tracking-wide">
                JENIS KAMERA <span className="text-red-400">*</span>
              </label>
              <select value={form.jenis_kamera} onChange={(e) => onChange({ jenis_kamera: e.target.value })}
                className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors bg-white">
                <option value="cctv">CCTV</option>
                <option value="ponsel">Ponsel</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#555] tracking-wide">
              STREAM URL <span className="text-red-400">*</span>
            </label>
            <input type="text" value={form.stream_url} onChange={(e) => onChange({ stream_url: e.target.value })}
              placeholder="cth. http://192.168.1.x:4747/video"
              className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors font-mono" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-[#555] tracking-wide">
              IP ADDRESS <span className="text-red-400">*</span>
            </label>
            <input type="text" value={form.ip_address} onChange={(e) => onChange({ ip_address: e.target.value })}
              placeholder="cth. 192.168.1.100"
              className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors font-mono" />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-extrabold text-[#555] tracking-wide">
                LATITUDE <span className="text-[#bbb] font-semibold normal-case tracking-normal">(opsional)</span>
              </label>
              <input type="number" step="any" value={form.latitude} onChange={(e) => onChange({ latitude: e.target.value })}
                placeholder="-6.200000"
                className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-extrabold text-[#555] tracking-wide">
                LONGITUDE <span className="text-[#bbb] font-semibold normal-case tracking-normal">(opsional)</span>
              </label>
              <input type="number" step="any" value={form.longitude} onChange={(e) => onChange({ longitude: e.target.value })}
                placeholder="106.816666"
                className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors" />
            </div>
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
