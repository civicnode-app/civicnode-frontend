"use client";
import { useState, useEffect, useCallback } from "react";
import { Zona, BACKEND_URL } from "../_types";

type ZonaForm = { nama: string; deskripsi: string };

interface Options {
  showToast: (msg: string) => void;
  showAlert: (msg: string) => void;
  showConfirm: (msg: string, onConfirm: () => void) => void;
  closeDialog: () => void;
}

export function useZona({ showToast, showAlert, showConfirm, closeDialog }: Options) {
  const [zonaList, setZonaList]   = useState<Zona[]>([]);
  const [zonaLoading, setZonaLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Zona | null>(null);
  const [form, setForm]             = useState<ZonaForm>({ nama: "", deskripsi: "" });
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");

  const token = () => localStorage.getItem("access_token") ?? "";

  const fetchZona = useCallback(async () => {
    setZonaLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/zona`, { headers: { Authorization: `Bearer ${token()}` } });
      const json = await res.json();
      if (json.success) setZonaList(json.data);
    } catch { /* pertahankan list kosong */ }
    finally { setZonaLoading(false); }
  }, []);

  useEffect(() => { fetchZona(); }, [fetchZona]);

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
    try {
      const url    = editTarget ? `${BACKEND_URL}/api/zona/${editTarget.id}` : `${BACKEND_URL}/api/zona`;
      const method = editTarget ? "PATCH" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
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
      closeDialog();
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

  return {
    zonaList, zonaLoading, sortOrder, setSortOrder, sortedZona,
    modalOpen, editTarget, form, setForm, saving, formError,
    openAdd, openEdit, closeModal, handleSubmit, handleDelete,
  };
}
