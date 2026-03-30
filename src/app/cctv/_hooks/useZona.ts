"use client";
import { useState } from "react";
import { Zona } from "../_types";

type ZonaForm = { nama: string; deskripsi: string };

const INITIAL_ZONAS: Zona[] = [
  { id: "z1", nama: "Simpang Antasari", deskripsi: "Area persimpangan lalu-lintas utama yang berpotensi rawan tumpukan sampah.", zone_reputation: 42 },
  { id: "z2", nama: "Pasar Sudimampur", deskripsi: "Pusat perbelanjaan grosir tradisional dengan volume limbah domestik tinggi.", zone_reputation: 28 },
  { id: "z3", nama: "Taman Kamboja",    deskripsi: "Taman terbuka rekreasi hijau yang dilengkapi banyak tempat sampah terpisah.", zone_reputation: 85 },
  { id: "z4", nama: "Jalan Veteran",    deskripsi: "Jalur utama kuliner dan pejalan kaki lintas kecamatan.", zone_reputation: 62 },
  { id: "z5", nama: "Lorong Pahlawan",  deskripsi: "Belum ada kamera CCTV yang terpasang. Tingkat kebersihan tidak dapat dipantau.", zone_reputation: 0 },
  { id: "z6", nama: "Terminal Lama",    deskripsi: "Belum ada kamera CCTV yang terpasang. Tingkat kebersihan tidak dapat dipantau.", zone_reputation: 0 },
];

interface Options {
  showToast: (msg: string) => void;
  showConfirm: (msg: string, onConfirm: () => void) => void;
  closeDialog: () => void;
}

export function useZona({ showToast, showConfirm, closeDialog }: Options) {
  const [zonaList, setZonaList]   = useState<Zona[]>(INITIAL_ZONAS);
  const zonaLoading               = false; // Disable loading for presentation
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Zona | null>(null);
  const [form, setForm]             = useState<ZonaForm>({ nama: "", deskripsi: "" });
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");

  const sortedZona = [...zonaList].sort((a, b) =>
    sortOrder === "asc"
      ? a.nama.localeCompare(b.nama, "id")
      : b.nama.localeCompare(a.nama, "id")
  );

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

    // Simulate network delay
    setTimeout(() => {
      if (editTarget) {
        setZonaList(prev => prev.map(z => z.id === editTarget.id ? {
          ...z,
          nama: form.nama,
          deskripsi: form.deskripsi,
        } : z));
        showToast("Zona berhasil diperbarui.");
      } else {
        const newZona: Zona = {
          id: `new-${Date.now()}`,
          nama: form.nama,
          deskripsi: form.deskripsi,
          zone_reputation: 50, // Default reputasi
        };
        setZonaList(prev => [...prev, newZona]);
        showToast("Zona berhasil ditambahkan.");
      }
      setSaving(false);
      closeModal();
    }, 500);
  }

  function handleDelete(zona: Zona) {
    showConfirm(`Hapus zona "${zona.nama}"?`, () => {
      closeDialog();
      setZonaList(prev => prev.filter(z => z.id !== zona.id));
      showToast("Zona berhasil dihapus.");
    });
  }

  return {
    zonaList, zonaLoading, sortOrder, setSortOrder, sortedZona,
    modalOpen, editTarget, form, setForm, saving, formError,
    openAdd, openEdit, closeModal, handleSubmit, handleDelete,
  };
}
