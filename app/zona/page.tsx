"use client";
import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { getAuthToken } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

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

export default function ZonaPage() {
  const [zonaList, setZonaList]   = useState<Zona[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Zona | null>(null);
  const [form, setForm]           = useState({ nama: "", deskripsi: "" });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  const token = () => getAuthToken();

  const fetchZona = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/zona`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const json = await res.json();
      if (json.success) setZonaList(json.data);
    } catch { /* biarkan list kosong */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchZona(); }, [fetchZona]);

  function openAdd() {
    setEditTarget(null);
    setForm({ nama: "", deskripsi: "" });
    setError("");
    setModalOpen(true);
  }

  function openEdit(zona: Zona) {
    setEditTarget(zona);
    setForm({ nama: zona.nama, deskripsi: zona.deskripsi });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim()) { setError("Nama zona wajib diisi."); return; }
    setSaving(true);
    setError("");
    try {
      const url    = editTarget
        ? `${BACKEND_URL}/api/zona/${editTarget.id}`
        : `${BACKEND_URL}/api/zona`;
      const method = editTarget ? "PATCH" : "POST";
      const res    = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) { setError(json.message ?? "Gagal menyimpan."); return; }
      closeModal();
      fetchZona();
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(zona: Zona) {
    if (!confirm(`Hapus zona "${zona.nama}"?`)) return;
    try {
      const res  = await fetch(`${BACKEND_URL}/api/zona/${zona.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      const json = await res.json();
      if (json.success) fetchZona();
      else alert(json.message ?? "Gagal menghapus.");
    } catch {
      alert("Tidak bisa terhubung ke server.");
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <span className="text-white font-extrabold text-xl tracking-[0.05em]">
            ZONA MONITORING
          </span>
          <button
            onClick={openAdd}
            className="bg-white text-[#588157] font-black text-sm px-5 py-2 rounded-full hover:bg-[#f0f5ee] transition-colors duration-200 cursor-pointer border-none"
          >
            + Tambah Zona
          </button>
        </header>

        {/* Content area */}
        <div className="bg-[#CADBB7] rounded-[45px] p-7 flex-1">
          {loading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-[#588157] font-bold opacity-50">Memuat zona...</p>
            </div>
          )}

          {!loading && zonaList.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-[#588157] font-bold opacity-50">Belum ada zona terdaftar.</p>
            </div>
          )}

          {!loading && zonaList.length > 0 && (
            <div className="grid grid-cols-3 gap-5">
              {zonaList.map((zona) => {
                const rep   = Math.round(zona.zone_reputation);
                const color = reputationColor(rep);
                return (
                  <div
                    key={zona.id}
                    className="bg-white rounded-[28px] p-6 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                  >
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
                        onClick={() => openEdit(zona)}
                        className="flex-1 py-1.5 rounded-full text-[11px] font-black border-2 border-[#a3b18a] text-[#588157] bg-white hover:bg-[#f0f5ee] transition-colors duration-150 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(zona)}
                        className="flex-1 py-1.5 rounded-full text-[11px] font-black border-2 border-red-200 text-red-400 bg-white hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal tambah / edit */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-[28px] p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <p className="m-0 font-black text-lg text-black">
              {editTarget ? "Edit Zona" : "Tambah Zona"}
            </p>
            <p className="m-0 mt-1 text-xs text-[#888]">
              {editTarget ? `ID: ${editTarget.id}` : "Data zona baru"}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-[#555] tracking-wide">
                  NAMA ZONA <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
                  placeholder="cth. Area Utama, Pasar Lama..."
                  className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-[#555] tracking-wide">
                  DESKRIPSI
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm((p) => ({ ...p, deskripsi: e.target.value }))}
                  placeholder="Keterangan singkat zona ini..."
                  rows={3}
                  className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="m-0 text-xs text-red-500 font-bold">{error}</p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-full text-sm font-black border-2 border-[#ddd] text-[#888] bg-white hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-full text-sm font-black bg-[#588157] text-white border-none hover:bg-[#4a6d48] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : editTarget ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
