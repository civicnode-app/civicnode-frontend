"use client";
import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getAuthToken } from "@/lib/auth";
import { ZonaCard } from "./_components/ZonaCard";
import { ZonaModal } from "./_components/ZonaModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

interface Zona {
  id: string;
  nama: string;
  deskripsi: string;
  zone_reputation: number;
}

interface ZonaForm {
  nama: string;
  deskripsi: string;
}

export default function ZonaPage() {
  const [zonaList, setZonaList]     = useState<Zona[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Zona | null>(null);
  const [form, setForm]             = useState<ZonaForm>({ nama: "", deskripsi: "" });
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");

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
    <AppLayout>
      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6 overflow-y-auto">
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
              {zonaList.map((zona) => (
                <ZonaCard
                  key={zona.id}
                  zona={zona}
                  onEdit={() => openEdit(zona)}
                  onDelete={() => handleDelete(zona)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ZonaModal
        open={modalOpen}
        isEdit={!!editTarget}
        editId={editTarget?.id}
        form={form}
        saving={saving}
        error={error}
        onClose={closeModal}
        onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
        onSubmit={handleSubmit}
      />
    </AppLayout>
  );
}
