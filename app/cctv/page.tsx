"use client";
import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

const DUMMY_LABELS = ["kaleng kosong", "bungkus permen", "botol plastik", "kantong kresek"];

interface CCTVNode {
  id: string;
  nama: string;
  ip_address: string;
  stream_url: string;
  status: boolean;
  active_detections: number;
  confidence_score: number;
  jenis_kamera: string;
  created_at: string;
  zona: { id: string; nama: string };
  latitude?: number;
  longitude?: number;
}

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
}

interface Zona {
  id: string;
  nama: string;
  deskripsi: string;
  zone_reputation: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initBoxes = (): BoundingBox[] =>
  Array.from({ length: 3 }, (_, i) => ({
    id: `box-${i}`,
    x: Math.random() * 55 + 5,
    y: Math.random() * 55 + 5,
    w: Math.random() * 12 + 10,
    h: Math.random() * 12 + 10,
    label: DUMMY_LABELS[i % DUMMY_LABELS.length],
    confidence: parseFloat((Math.random() * 0.25 + 0.72).toFixed(2)),
  }));

const driftBoxes = (prev: BoundingBox[]): BoundingBox[] =>
  prev.map((b) => ({
    ...b,
    x: Math.min(82, Math.max(2, b.x + (Math.random() - 0.5) * 3)),
    y: Math.min(80, Math.max(2, b.y + (Math.random() - 0.5) * 3)),
    confidence: parseFloat(
      Math.min(0.99, Math.max(0.5, b.confidence + (Math.random() - 0.5) * 0.04)).toFixed(2)
    ),
  }));

function repColor(score: number) {
  if (score >= 80) return { bg: "bg-[#f0f5ee]", text: "text-[#588157]" };
  if (score >= 60) return { bg: "bg-yellow-50",  text: "text-yellow-600" };
  if (score >= 40) return { bg: "bg-orange-50",  text: "text-orange-500" };
  return              { bg: "bg-red-50",      text: "text-red-500"    };
}

function repLabel(score: number) {
  if (score >= 80) return "BERSIH";
  if (score >= 60) return "CUKUP";
  if (score >= 40) return "KOTOR";
  return "KRITIS";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CCTVPage() {
  // CCTV state
  const [cctvList, setCctvList]         = useState<CCTVNode[]>([]);
  const [cctvLoading, setCctvLoading]   = useState(true);
  const [aiEnabled, setAiEnabled]       = useState<Record<string, boolean>>({});
  const [streamLoaded, setStreamLoaded] = useState<Record<string, boolean>>({});
  const [boxes, setBoxes]               = useState<BoundingBox[]>(initBoxes);

  // Zona state
  const [sortOrder, setSortOrder]     = useState<"asc" | "desc">("asc");
  const [zonaList, setZonaList]       = useState<Zona[]>([]);
  const [zonaLoading, setZonaLoading] = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState<Zona | null>(null);
  const [form, setForm]               = useState({ nama: "", deskripsi: "" });
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState("");

  // Custom dialog state
  type DialogState =
    | { type: "alert"; message: string }
    | { type: "confirm"; message: string; onConfirm: () => void };
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const showAlert   = (message: string) => setDialog({ type: "alert", message });
  const showConfirm = (message: string, onConfirm: () => void) =>
    setDialog({ type: "confirm", message, onConfirm });

  // Toast state
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // CCTV CRUD modal state
  const [cctvModalOpen, setCctvModalOpen]   = useState(false);
  const [cctvEditTarget, setCctvEditTarget] = useState<CCTVNode | null>(null);
  const [cctvForm, setCctvForm]             = useState({
    nama: "", zona_id: "", jenis_kamera: "cctv",
    stream_url: "", ip_address: "", latitude: "", longitude: "",
  });
  const [cctvSaving, setCctvSaving]       = useState(false);
  const [cctvFormError, setCctvFormError] = useState("");

  const token   = () => localStorage.getItem("access_token") ?? "";

  // fetch CCTV
  const fetchCctv = useCallback(async () => {
    setCctvLoading(true);
    const t = token();
    if (!t) { setCctvLoading(false); return; }
    try {
      const res  = await fetch(`${BACKEND_URL}/api/cctv`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const json = await res.json();
      if (json.success) setCctvList(json.data);
    } catch { /* pertahankan list kosong */ }
    finally { setCctvLoading(false); }
  }, []);

  useEffect(() => { fetchCctv(); }, [fetchCctv]);

  // fetch Zona
  const fetchZona = useCallback(async () => {
    setZonaLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/zona`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const json = await res.json();
      if (json.success) setZonaList(json.data);
    } catch { /* pertahankan list kosong */ }
    finally { setZonaLoading(false); }
  }, []);

  useEffect(() => { fetchZona(); }, [fetchZona]);

  // bounding box animasi
  useEffect(() => {
    const id = setInterval(() => setBoxes(driftBoxes), 800);
    return () => clearInterval(id);
  }, []);

  const toggleAI = useCallback((cctv_id: string) => {
    setAiEnabled((prev) => ({ ...prev, [cctv_id]: !prev[cctv_id] }));
  }, []);

  // ── CCTV CRUD ──────────────────────────────────────────────────────────────

  function openAddCctv() {
    setCctvEditTarget(null);
    setCctvForm({ nama: "", zona_id: "", jenis_kamera: "cctv", stream_url: "", ip_address: "", latitude: "", longitude: "" });
    setCctvFormError("");
    setCctvModalOpen(true);
  }

  function openEditCctv(node: CCTVNode) {
    setCctvEditTarget(node);
    setCctvForm({
      nama:         node.nama,
      zona_id:      node.zona.id,
      jenis_kamera: node.jenis_kamera,
      stream_url:   node.stream_url,
      ip_address:   node.ip_address,
      latitude:     node.latitude  != null ? String(node.latitude)  : "",
      longitude:    node.longitude != null ? String(node.longitude) : "",
    });
    setCctvFormError("");
    setCctvModalOpen(true);
  }

  function closeModalCctv() {
    setCctvModalOpen(false);
    setCctvEditTarget(null);
    setCctvFormError("");
  }

  async function handleSubmitCctv(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!cctvForm.nama.trim())       { setCctvFormError("Nama kamera wajib diisi."); return; }
    if (!cctvForm.zona_id)           { setCctvFormError("Zona wajib dipilih.");       return; }
    if (!cctvForm.stream_url.trim()) { setCctvFormError("Stream URL wajib diisi.");   return; }
    if (!cctvForm.ip_address.trim()) { setCctvFormError("IP Address wajib diisi.");   return; }
    setCctvSaving(true);
    setCctvFormError("");
    try {
      const body: Record<string, unknown> = {
        nama:         cctvForm.nama,
        zona_id:      cctvForm.zona_id,
        jenis_kamera: cctvForm.jenis_kamera,
        stream_url:   cctvForm.stream_url,
        ip_address:   cctvForm.ip_address,
      };
      if (cctvForm.latitude)  body.latitude  = parseFloat(cctvForm.latitude);
      if (cctvForm.longitude) body.longitude = parseFloat(cctvForm.longitude);

      const url    = cctvEditTarget
        ? `${BACKEND_URL}/api/cctv/${cctvEditTarget.id}`
        : `${BACKEND_URL}/api/cctv`;
      const method = cctvEditTarget ? "PATCH" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) { setCctvFormError(json.message ?? "Gagal menyimpan."); return; }
      closeModalCctv();
      fetchCctv();
      showToast(cctvEditTarget ? "Kamera berhasil diperbarui." : "Kamera berhasil ditambahkan.");
    } catch {
      setCctvFormError("Tidak bisa terhubung ke server.");
    } finally {
      setCctvSaving(false);
    }
  }

  function handleDeleteCctv(node: CCTVNode) {
    showConfirm(`Hapus kamera "${node.nama}"?`, async () => {
      setDialog(null);
      try {
        const res  = await fetch(`${BACKEND_URL}/api/cctv/${node.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token()}` },
        });
        const json = await res.json();
        if (json.success) { fetchCctv(); showToast("Kamera berhasil dihapus."); }
        else showAlert(json.message ?? "Gagal menghapus.");
      } catch {
        showAlert("Tidak bisa terhubung ke server.");
      }
    });
  }

  // ── Zona CRUD ──────────────────────────────────────────────────────────────

  function openAdd() {
    setEditTarget(null);
    setForm({ nama: "", deskripsi: "" });
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(zona: Zona) {
    setEditTarget(zona);
    setForm({ nama: zona.nama, deskripsi: zona.deskripsi });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setFormError("");
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!form.nama.trim()) { setFormError("Nama zona wajib diisi."); return; }
    setSaving(true);
    setFormError("");
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
      if (!json.success) { setFormError(json.message ?? "Gagal menyimpan."); return; }
      closeModal();
      fetchZona();
      showToast(editTarget ? "Zona berhasil diperbarui." : "Zona berhasil ditambahkan.");
    } catch {
      setFormError("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(zona: Zona) {
    showConfirm(`Hapus zona "${zona.nama}"?`, async () => {
      setDialog(null);
      try {
        const res  = await fetch(`${BACKEND_URL}/api/zona/${zona.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token()}` },
        });
        const json = await res.json();
        if (json.success) { fetchZona(); showToast("Zona berhasil dihapus."); }
        else showAlert(json.message ?? "Gagal menghapus.");
      } catch {
        showAlert("Tidak bisa terhubung ke server.");
      }
    });
  }

  // ── Tab ────────────────────────────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState<"cctv" | "zona">("cctv");

  // ── Derived ────────────────────────────────────────────────────────────────

  const sortedZona   = [...zonaList].sort((a, b) =>
    sortOrder === "asc"
      ? a.nama.localeCompare(b.nama, "id")
      : b.nama.localeCompare(a.nama, "id")
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#588157]">

        {/* ── Sticky top bar ── */}
        <div className="px-8 pt-8 flex flex-col gap-5">

          {/* Header */}
          <header className="flex justify-between items-center">
            <span className="text-white font-extrabold text-xl tracking-[0.05em]">
              CCTV MONITOR
            </span>

            <div className="flex items-center gap-4">
              {activeTab === "cctv" && (
                <button
                  onClick={openAddCctv}
                  className="bg-white text-[#588157] font-black text-sm px-5 py-2 rounded-full hover:bg-[#f0f5ee] transition-colors duration-200 cursor-pointer border-none"
                >
                  + Tambah Kamera
                </button>
              )}

              {activeTab === "zona" && (
                <div className="flex items-center gap-3">
                  <div className="flex bg-[#4a6d48] rounded-full p-1 gap-1">
                    {(["asc", "desc"] as const).map((order) => (
                      <button
                        key={order}
                        onClick={() => setSortOrder(order)}
                        className={`px-3.5 py-1 rounded-full text-[11px] font-black border-none cursor-pointer transition-all duration-200 ${
                          sortOrder === order
                            ? "bg-white text-[#588157]"
                            : "bg-transparent text-white/70 hover:text-white"
                        }`}
                      >
                        {order === "asc" ? "A → Z" : "Z → A"}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={openAdd}
                    className="bg-white text-[#588157] font-black text-sm px-5 py-2 rounded-full hover:bg-[#f0f5ee] transition-colors duration-200 cursor-pointer border-none"
                  >
                    + Tambah Zona
                  </button>
                </div>
              )}

              <div className="bg-[#a3b18a] py-1.5 px-5 rounded-full flex items-center gap-3 text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                <div className="w-10 h-10 bg-[#eee] rounded-full border-2 border-[#333] shrink-0" />
                <div className="leading-[1.2]">
                  <p className="font-extrabold m-0 text-[15px]">ATUN</p>
                  <p className="text-[10px] m-0 opacity-80">OWNER</p>
                </div>
              </div>
            </div>
          </header>

          {/* Badge-style tabs */}
          <div className="flex gap-2 pb-3">
            {(["cctv", "zona"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold border-none cursor-pointer transition-all duration-150 ${
                  activeTab === tab
                    ? "bg-white text-[#588157]"
                    : "bg-white/15 text-white/70 hover:bg-white/25 hover:text-white"
                }`}
              >
                {tab === "cctv" ? "CCTV" : "Zona"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* ── CCTV Grid ── */}
        {activeTab === "cctv" && <div className="bg-[#CADBB7] rounded-[45px] p-7 grid grid-cols-3 gap-5">
          {cctvLoading && cctvList.length === 0 && (
            <div className="col-span-3 flex items-center justify-center py-10">
              <p className="text-[#588157] font-bold opacity-50">Memuat kamera...</p>
            </div>
          )}

          {!cctvLoading && cctvList.length === 0 && (
            <div className="col-span-3 flex items-center justify-center py-10">
              <p className="text-[#588157] font-bold opacity-50">Belum ada kamera terdaftar.</p>
            </div>
          )}

          {cctvList.map((node) => {
            const isAI = !!aiEnabled[node.id];
            return (
              <div
                key={node.id}
                className="bg-white rounded-[36px] p-7 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              >
                {/* Card top */}
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

                {/* Preview + bounding box overlay */}
                <div className="relative aspect-square bg-[#f0f0f0] rounded-3xl overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={node.stream_url.replace(/\/video$/, "/mjpegfeed")}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoad={() => setStreamLoaded((prev) => ({ ...prev, [node.id]: true }))}
                  />
                  {!streamLoaded[node.id] && (
                    <span className="text-[40px] opacity-20">📷</span>
                  )}

                  {isAI && boxes.map((box) => (
                    <div
                      key={box.id}
                      className="absolute border-2 border-green-400 transition-all duration-700 ease-in-out"
                      style={{
                        left:   `${box.x}%`,
                        top:    `${box.y}%`,
                        width:  `${box.w}%`,
                        height: `${box.h}%`,
                      }}
                    >
                      <span className="absolute -top-5 left-0 bg-green-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                        {box.label} {box.confidence}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card bottom */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-sm m-0 text-black">{node.jenis_kamera.toUpperCase()}</p>
                      <p className="font-bold text-[11px] m-0 text-[#666] font-mono tracking-[0.03em]">
                        {node.ip_address}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleAI(node.id)}
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
                    <button
                      onClick={() => openEditCctv(node)}
                      className="flex-1 py-1.5 rounded-full text-[11px] font-black border-2 border-[#a3b18a] text-[#588157] bg-white hover:bg-[#f0f5ee] transition-colors duration-150 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCctv(node)}
                      className="flex-1 py-1.5 rounded-full text-[11px] font-black border-2 border-red-200 text-red-400 bg-white hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>}

        {/* ── Zona Grid ── */}
        {activeTab === "zona" && <div className="bg-[#CADBB7] rounded-[45px] p-7">
          {zonaLoading && (
            <div className="flex items-center justify-center py-10">
              <p className="text-[#588157] font-bold opacity-50">Memuat zona...</p>
            </div>
          )}

          {!zonaLoading && zonaList.length === 0 && (
            <div className="flex items-center justify-center py-10">
              <p className="text-[#588157] font-bold opacity-50">Belum ada zona terdaftar.</p>
            </div>
          )}

          {!zonaLoading && zonaList.length > 0 && (
            <div className="grid grid-cols-3 gap-5">
              {sortedZona.map((zona) => {
                const rep   = Math.round(zona.zone_reputation);
                const color    = repColor(rep);
                const cameras  = cctvList.filter((c) => c.zona.id === zona.id);
                return (
                  <div
                    key={zona.id}
                    className="bg-white rounded-[28px] p-6 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-black text-[17px] text-black m-0 leading-tight">
                        {zona.nama}
                      </p>
                      <span className={`shrink-0 ${color.bg} ${color.text} text-[10px] font-black px-2.5 py-1 rounded-full`}>
                        {repLabel(rep)} · {rep}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#666] m-0 leading-relaxed">
                      {zona.deskripsi || <span className="italic opacity-40">Tidak ada deskripsi</span>}
                    </p>

                    {/* Daftar CCTV terhubung */}
                    <div className="flex flex-col gap-1.5">
                      <p className="m-0 text-[10px] font-extrabold text-[#aaa] tracking-widest uppercase">
                        📷 Kamera Terhubung
                      </p>
                      {cameras.length === 0 ? (
                        <p className="m-0 text-[12px] text-[#bbb] italic">Belum ada kamera</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {cameras.map((c) => (
                            <span
                              key={c.id}
                              className="bg-[#f0f5ee] text-[#588157] text-[11px] font-bold px-2.5 py-1 rounded-full"
                            >
                              {c.nama}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

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
        </div>}

        </div>{/* end scrollable content */}
      </main>

      {/* ── Toast notifikasi sukses ── */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.2)] font-bold text-sm flex items-center gap-2">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* ── Custom Dialog (alert / confirm) ── */}
      {dialog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col gap-5">
            <p className="m-0 text-[15px] font-bold text-[#333] leading-relaxed">
              {dialog.message}
            </p>
            <div className="flex gap-3">
              {dialog.type === "confirm" && (
                <button
                  onClick={() => setDialog(null)}
                  className="flex-1 py-2.5 rounded-full text-sm font-black border-2 border-[#ddd] text-[#888] bg-white hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button
                onClick={() => {
                  if (dialog.type === "confirm") dialog.onConfirm();
                  else setDialog(null);
                }}
                className={`flex-1 py-2.5 rounded-full text-sm font-black border-none transition-colors cursor-pointer ${
                  dialog.type === "confirm"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-[#588157] text-white hover:bg-[#4a6d48]"
                }`}
              >
                {dialog.type === "confirm" ? "Hapus" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal CCTV ── */}
      {cctvModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) closeModalCctv(); }}
        >
          <div className="bg-white rounded-[28px] p-8 w-full max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <p className="m-0 font-black text-lg text-black">
              {cctvEditTarget ? "Edit Kamera" : "Tambah Kamera"}
            </p>
            <p className="m-0 mt-1 text-xs text-[#888]">
              {cctvEditTarget ? `ID: ${cctvEditTarget.id}` : "Data kamera baru"}
            </p>

            <form onSubmit={handleSubmitCctv} className="mt-6 flex flex-col gap-4">
              {/* Nama */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-[#555] tracking-wide">
                  NAMA KAMERA <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={cctvForm.nama}
                  onChange={(e) => setCctvForm((p) => ({ ...p, nama: e.target.value }))}
                  placeholder="cth. Kamera Pintu Utara..."
                  className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors"
                />
              </div>

              {/* Zona + Jenis — satu baris */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-extrabold text-[#555] tracking-wide">
                    ZONA <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={cctvForm.zona_id}
                    onChange={(e) => setCctvForm((p) => ({ ...p, zona_id: e.target.value }))}
                    className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors bg-white"
                  >
                    <option value="">— Pilih Zona —</option>
                    {zonaList.map((z) => (
                      <option key={z.id} value={z.id}>{z.nama}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-extrabold text-[#555] tracking-wide">
                    JENIS KAMERA <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={cctvForm.jenis_kamera}
                    onChange={(e) => setCctvForm((p) => ({ ...p, jenis_kamera: e.target.value }))}
                    className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors bg-white"
                  >
                    <option value="cctv">CCTV</option>
                    <option value="ponsel">Ponsel</option>
                  </select>
                </div>
              </div>

              {/* Stream URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-[#555] tracking-wide">
                  STREAM URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={cctvForm.stream_url}
                  onChange={(e) => setCctvForm((p) => ({ ...p, stream_url: e.target.value }))}
                  placeholder="cth. http://192.168.1.x:4747/video"
                  className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors font-mono"
                />
              </div>

              {/* IP Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-[#555] tracking-wide">
                  IP ADDRESS <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={cctvForm.ip_address}
                  onChange={(e) => setCctvForm((p) => ({ ...p, ip_address: e.target.value }))}
                  placeholder="cth. 192.168.1.100"
                  className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors font-mono"
                />
              </div>

              {/* Latitude + Longitude — opsional */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-extrabold text-[#555] tracking-wide">
                    LATITUDE <span className="text-[#bbb] font-semibold normal-case tracking-normal">(opsional)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={cctvForm.latitude}
                    onChange={(e) => setCctvForm((p) => ({ ...p, latitude: e.target.value }))}
                    placeholder="-6.200000"
                    className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-extrabold text-[#555] tracking-wide">
                    LONGITUDE <span className="text-[#bbb] font-semibold normal-case tracking-normal">(opsional)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={cctvForm.longitude}
                    onChange={(e) => setCctvForm((p) => ({ ...p, longitude: e.target.value }))}
                    placeholder="106.816666"
                    className="border-2 border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#588157] transition-colors"
                  />
                </div>
              </div>

              {cctvFormError && (
                <p className="m-0 text-xs text-red-500 font-bold">{cctvFormError}</p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModalCctv}
                  className="flex-1 py-2.5 rounded-full text-sm font-black border-2 border-[#ddd] text-[#888] bg-white hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={cctvSaving}
                  className="flex-1 py-2.5 rounded-full text-sm font-black bg-[#588157] text-white border-none hover:bg-[#4a6d48] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {cctvSaving ? "Menyimpan..." : cctvEditTarget ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Zona ── */}
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

              {formError && (
                <p className="m-0 text-xs text-red-500 font-bold">{formError}</p>
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
