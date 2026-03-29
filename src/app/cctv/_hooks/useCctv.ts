"use client";
import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { CCTVNode, BoundingBox, BACKEND_URL } from "../_types";

const DUMMY_LABELS = ["kaleng kosong", "bungkus permen", "botol plastik", "kantong kresek"];

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

type CctvForm = {
  nama: string; zona_id: string; jenis_kamera: string;
  stream_url: string; ip_address: string; latitude: string; longitude: string;
};

const emptyForm: CctvForm = {
  nama: "", zona_id: "", jenis_kamera: "cctv",
  stream_url: "", ip_address: "", latitude: "", longitude: "",
};

interface Options {
  showToast: (msg: string) => void;
  showAlert: (msg: string) => void;
  showConfirm: (msg: string, onConfirm: () => void) => void;
  closeDialog: () => void;
}

export function useCctv({ showToast, showAlert, showConfirm, closeDialog }: Options) {
  const [cctvList, setCctvList]         = useState<CCTVNode[]>([]);
  const [cctvLoading, setCctvLoading]   = useState(true);
  const [aiEnabled, setAiEnabled]       = useState<Record<string, boolean>>({});
  const [streamLoaded, setStreamLoaded] = useState<Record<string, boolean>>({});
  const [boxes, setBoxes]               = useState<BoundingBox[]>(initBoxes);

  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState<CCTVNode | null>(null);
  const [form, setForm]               = useState<CctvForm>(emptyForm);
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState("");

  const token = () => getAuthToken();

  const fetchCctv = useCallback(async () => {
    setCctvLoading(true);
    const t = token();
    if (!t) { setCctvLoading(false); return; }
    try {
      const res  = await fetch(`${BACKEND_URL}/api/cctv`, { headers: { Authorization: `Bearer ${t}` } });
      const json = await res.json();
      if (json.success) setCctvList(json.data);
    } catch { /* pertahankan list kosong */ }
    finally { setCctvLoading(false); }
  }, []);

  useEffect(() => { fetchCctv(); }, [fetchCctv]);

  useEffect(() => {
    const id = setInterval(() => setBoxes(driftBoxes), 800);
    return () => clearInterval(id);
  }, []);

  const toggleAI        = useCallback((id: string) => setAiEnabled((p) => ({ ...p, [id]: !p[id] })), []);
  const markStreamLoaded = useCallback((id: string) => setStreamLoaded((p) => ({ ...p, [id]: true })), []);

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(node: CCTVNode) {
    setEditTarget(node);
    setForm({
      nama:         node.nama,
      zona_id:      node.zona.id,
      jenis_kamera: node.jenis_kamera,
      stream_url:   node.stream_url,
      ip_address:   node.ip_address,
      latitude:     node.latitude  != null ? String(node.latitude)  : "",
      longitude:    node.longitude != null ? String(node.longitude) : "",
    });
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
    if (!form.nama.trim())       { setFormError("Nama kamera wajib diisi."); return; }
    if (!form.zona_id)           { setFormError("Zona wajib dipilih.");       return; }
    if (!form.stream_url.trim()) { setFormError("Stream URL wajib diisi.");   return; }
    if (!form.ip_address.trim()) { setFormError("IP Address wajib diisi.");   return; }
    setSaving(true);
    setFormError("");
    try {
      const body: Record<string, unknown> = {
        nama: form.nama, zona_id: form.zona_id, jenis_kamera: form.jenis_kamera,
        stream_url: form.stream_url, ip_address: form.ip_address,
      };
      if (form.latitude)  body.latitude  = parseFloat(form.latitude);
      if (form.longitude) body.longitude = parseFloat(form.longitude);

      const url    = editTarget ? `${BACKEND_URL}/api/cctv/${editTarget.id}` : `${BACKEND_URL}/api/cctv`;
      const method = editTarget ? "PATCH" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) { setFormError(json.message ?? "Gagal menyimpan."); return; }
      closeModal();
      fetchCctv();
      showToast(editTarget ? "Kamera berhasil diperbarui." : "Kamera berhasil ditambahkan.");
    } catch {
      setFormError("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(node: CCTVNode) {
    showConfirm(`Hapus kamera "${node.nama}"?`, async () => {
      closeDialog();
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

  return {
    cctvList, cctvLoading, aiEnabled, streamLoaded, boxes,
    toggleAI, markStreamLoaded,
    modalOpen, editTarget, form, setForm, saving, formError,
    openAdd, openEdit, closeModal, handleSubmit, handleDelete,
  };
}
