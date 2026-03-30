"use client";
import { useState } from "react";
import { CCTVNode } from "../_types";

type CctvForm = {
  nama: string; zona_id: string; jenis_kamera: string;
  stream_url: string; ip_address: string; latitude: string; longitude: string;
};

const emptyForm: CctvForm = {
  nama: "", zona_id: "", jenis_kamera: "cctv",
  stream_url: "", ip_address: "", latitude: "", longitude: "",
};

const DUMMY_ZONAS = [
  { id: "z1", nama: "Simpang Antasari" },
  { id: "z2", nama: "Pasar Sudimampur" },
  { id: "z3", nama: "Taman Kamboja" },
  { id: "z4", nama: "Jalan Veteran" },
  { id: "z5", nama: "Lorong Pahlawan" },
  { id: "z6", nama: "Terminal Lama" },
];

const INITIAL_CCTVS: CCTVNode[] = [
  { id: "c1", nama: "CCTV Antasari 01",  ip_address: "192.168.1.10", stream_url: "rtsp://simpang-antasari.local/stream1", status: true,  active_detections: 4, confidence_score: 0.85, jenis_kamera: "cctv", created_at: new Date().toISOString(), zona: DUMMY_ZONAS[0] },
  { id: "c2", nama: "CCTV Antasari 02",  ip_address: "192.168.1.11", stream_url: "rtsp://simpang-antasari.local/stream2", status: true,  active_detections: 1, confidence_score: 0.90, jenis_kamera: "cctv", created_at: new Date().toISOString(), zona: DUMMY_ZONAS[0] },
  { id: "c3", nama: "Node Sudimampur T", ip_address: "192.168.1.12", stream_url: "rtsp://sudimampur.local/stream1",        status: false, active_detections: 0, confidence_score: 0,    jenis_kamera: "cctv", created_at: new Date().toISOString(), zona: DUMMY_ZONAS[1] },
  { id: "c4", nama: "CCTV Pasar Malam",  ip_address: "192.168.1.16", stream_url: "rtsp://sudimampur.local/stream2",        status: true,  active_detections: 7, confidence_score: 0.78, jenis_kamera: "cctv", created_at: new Date().toISOString(), zona: DUMMY_ZONAS[1] },
  { id: "c5", nama: "Node Kamboja 01",   ip_address: "192.168.1.13", stream_url: "rtsp://taman-kamboja.local/cam",         status: true,  active_detections: 0, confidence_score: 0,    jenis_kamera: "cctv", created_at: new Date().toISOString(), zona: DUMMY_ZONAS[2] },
  { id: "c6", nama: "Node Kamboja 02",   ip_address: "192.168.1.15", stream_url: "rtsp://taman-kamboja.local/cam2",        status: true,  active_detections: 0, confidence_score: 0,    jenis_kamera: "cctv", created_at: new Date().toISOString(), zona: DUMMY_ZONAS[2] },
  { id: "c7", nama: "CCTV Veteran 01",   ip_address: "192.168.1.14", stream_url: "rtsp://veteran.local/stream",            status: true,  active_detections: 5, confidence_score: 0.92, jenis_kamera: "cctv", created_at: new Date().toISOString(), zona: DUMMY_ZONAS[3] },
];

interface Options {
  showToast: (msg: string) => void;
  showConfirm: (msg: string, onConfirm: () => void) => void;
  closeDialog: () => void;
}

export function useCctv({ showToast, showConfirm, closeDialog }: Options) {
  const [cctvList, setCctvList]         = useState<CCTVNode[]>(INITIAL_CCTVS);
  const cctvLoading                     = false; // Disable loading spinner for presentation
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState<CCTVNode | null>(null);
  const [form, setForm]               = useState<CctvForm>(emptyForm);
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState("");

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

    // Simulate network delay
    setTimeout(() => {
      const zonaObj = DUMMY_ZONAS.find(z => z.id === form.zona_id) || { id: form.zona_id, nama: "Ext Zona" };
      
      if (editTarget) {
        setCctvList(prev => prev.map(c => c.id === editTarget.id ? {
          ...c,
          nama: form.nama,
          zona: zonaObj,
          jenis_kamera: form.jenis_kamera,
          stream_url: form.stream_url,
          ip_address: form.ip_address,
          latitude: form.latitude ? parseFloat(form.latitude) : undefined,
          longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        } : c));
        showToast("Kamera berhasil diperbarui.");
      } else {
        const newNode: CCTVNode = {
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
          latitude: form.latitude ? parseFloat(form.latitude) : undefined,
          longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        };
        setCctvList(prev => [...prev, newNode]);
        showToast("Kamera berhasil ditambahkan.");
      }
      setSaving(false);
      closeModal();
    }, 600);
  }

  function handleDelete(node: CCTVNode) {
    showConfirm(`Hapus kamera "${node.nama}"?`, () => {
      closeDialog();
      setCctvList(prev => prev.filter(c => c.id !== node.id));
      showToast("Kamera berhasil dihapus.");
    });
  }

  return {
    cctvList, cctvLoading,
    modalOpen, editTarget, form, setForm, saving, formError,
    openAdd, openEdit, closeModal, handleSubmit, handleDelete,
  };
}
