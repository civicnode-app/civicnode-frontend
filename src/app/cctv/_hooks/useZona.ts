"use client";
import { useState } from "react";
import { Zona } from "../_types";
import { useZonaStore } from "../_store/useZonaStore";
import { useCctvStore } from "../_store/useCctvStore";
import { useDashboardStore } from "@/app/dashboard/_store/useDashboardStore";

type ZonaForm = { nama: string; deskripsi: string };

interface Options {
  showToast: (msg: string) => void;
  showConfirm: (msg: string, onConfirm: () => void) => void;
  closeDialog: () => void;
}

export function useZona({ showToast, showConfirm, closeDialog }: Options) {
  const { zonaList, addZona, updateZona, deleteZona } = useZonaStore();
  const dashZones = useDashboardStore((s) => s.zones);

  // Merge live score dari dashboard simulation ke zone_reputation
  const liveZonaList = zonaList.map((zona) => {
    const live = dashZones.find((z) => z.id === zona.id);
    return live && live.score !== null ? { ...zona, zone_reputation: live.score } : zona;
  });

  const zonaLoading               = false;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Zona | null>(null);
  const [form, setForm]             = useState<ZonaForm>({ nama: "", deskripsi: "" });
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");

  const sortedZona = [...liveZonaList].sort((a, b) =>
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

    setTimeout(() => {
      if (editTarget) {
        updateZona(editTarget.id, { nama: form.nama, deskripsi: form.deskripsi });
        showToast("Zona berhasil diperbarui.");
      } else {
        addZona({
          id: `new-${Date.now()}`,
          nama: form.nama,
          deskripsi: form.deskripsi,
          zone_reputation: 50,
        });
        showToast("Zona berhasil ditambahkan.");
      }
      setSaving(false);
      closeModal();
    }, 500);
  }

  function handleDelete(zona: Zona) {
    showConfirm(`Hapus zona "${zona.nama}"?`, () => {
      closeDialog();
      deleteZona(zona.id);
      useCctvStore.getState().clearZona(zona.id);
      useDashboardStore.getState().removeZone(zona.id);
      showToast("Zona berhasil dihapus.");
    });
  }

  return {
    zonaList: liveZonaList, zonaLoading, sortOrder, setSortOrder, sortedZona,
    modalOpen, editTarget, form, setForm, saving, formError,
    openAdd, openEdit, closeModal, handleSubmit, handleDelete,
  };
}
