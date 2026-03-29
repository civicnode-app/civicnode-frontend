"use client";
import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { CCTVNode, BACKEND_URL } from "../_types";

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
    cctvList, cctvLoading,
    modalOpen, editTarget, form, setForm, saving, formError,
    openAdd, openEdit, closeModal, handleSubmit, handleDelete,
  };
}
