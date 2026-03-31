"use client";
import { useState } from "react";
import { CCTVNode } from "../_types";
import { useDashboardStore } from "@/app/dashboard/_store/useDashboardStore";
import { useCctvStore } from "../_store/useCctvStore";
import { useZonaStore } from "../_store/useZonaStore";

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
  showConfirm: (msg: string, onConfirm: () => void) => void;
  closeDialog: () => void;
}

export function useCctv({ showToast, showConfirm, closeDialog }: Options) {
  const { cctvList, addCctv, updateCctv, deleteCctv } = useCctvStore();
  const zonaList   = useZonaStore((s) => s.zonaList);
  const storeCameras = useDashboardStore((s) => s.cameras);

  const cctvLoading = false;
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<CCTVNode | null>(null);
  const [form, setForm]             = useState<CctvForm>(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");

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

    setTimeout(() => {
      const zonaObj = zonaList.find((z) => z.id === form.zona_id) ?? { id: form.zona_id, nama: "Ext Zona" };

      if (editTarget) {
        updateCctv(editTarget.id, {
          nama: form.nama,
          zona: zonaObj,
          jenis_kamera: form.jenis_kamera,
          stream_url: form.stream_url,
          ip_address: form.ip_address,
          latitude:  form.latitude  ? parseFloat(form.latitude)  : undefined,
          longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        });
        showToast("Kamera berhasil diperbarui.");
      } else {
        addCctv({
          id: `new-${Date.now()}`,
          nama: form.nama,
          ip_address: form.ip_address,
          stream_url: form.stream_url,
          status: true,
          active_detections: 0,
          confidence_score: 0,
          jenis_kamera: form.jenis_kamera,
          created_at: new Date().toISOString(),
          zona: zonaObj,
          latitude:  form.latitude  ? parseFloat(form.latitude)  : undefined,
          longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        });
        showToast("Kamera berhasil ditambahkan.");
      }
      setSaving(false);
      closeModal();
    }, 600);
  }

  function handleDelete(node: CCTVNode) {
    showConfirm(`Hapus kamera "${node.nama}"?`, () => {
      closeDialog();
      deleteCctv(node.id);
      showToast("Kamera berhasil dihapus.");
    });
  }

  // Merge active_detections real-time dari dashboard store
  const liveList = cctvList.map((node) => {
    const live = storeCameras.find((c) => c.id === node.id);
    return live ? { ...node, active_detections: live.active_detections } : node;
  });

  return {
    cctvList: liveList, cctvLoading,
    modalOpen, editTarget, form, setForm, saving, formError,
    openAdd, openEdit, closeModal, handleSubmit, handleDelete,
  };
}
