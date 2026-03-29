"use client";

import { AppLayout } from "@/components/AppLayout";
import { ZonaCard } from "./_components/ZonaCard";
import { ZonaModal } from "./_components/ZonaModal";
import { useDialog } from "../cctv/_hooks/useDialog";
import { useZona } from "../cctv/_hooks/useZona";
import { ConfirmDialog } from "../cctv/_components/ConfirmDialog";

export default function ZonaPage() {
  const { dialog, toast, showConfirm, showToast, closeDialog } = useDialog();
  const zona = useZona({ showToast, showConfirm, closeDialog });

  return (
    <AppLayout>
      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6 overflow-y-auto">
        <header className="flex justify-between items-center">
          <span className="text-white font-extrabold text-xl tracking-[0.05em]">
            ZONA MONITORING
          </span>
          <button
            onClick={zona.openAdd}
            className="bg-white text-[#588157] font-black text-sm px-5 py-2 rounded-full hover:bg-[#f0f5ee] transition-colors duration-200 cursor-pointer border-none"
          >
            + Tambah Zona
          </button>
        </header>

        <div className="bg-[#CADBB7] rounded-[45px] p-7 flex-1">
          {zona.zonaLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-[#588157] font-bold opacity-50">Memuat zona...</p>
            </div>
          )}
          {!zona.zonaLoading && zona.zonaList.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-[#588157] font-bold opacity-50">Belum ada zona terdaftar.</p>
            </div>
          )}
          {!zona.zonaLoading && zona.zonaList.length > 0 && (
            <div className="grid grid-cols-3 gap-5">
              {zona.zonaList.map((z) => (
                <ZonaCard
                  key={z.id}
                  zona={z}
                  onEdit={() => zona.openEdit(z)}
                  onDelete={() => zona.handleDelete(z)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog dialog={dialog} toast={toast} onClose={closeDialog} />

      <ZonaModal
        open={zona.modalOpen}
        isEdit={!!zona.editTarget}
        editId={zona.editTarget?.id}
        form={zona.form}
        saving={zona.saving}
        error={zona.formError}
        onClose={zona.closeModal}
        onChange={(patch) => zona.setForm((p) => ({ ...p, ...patch }))}
        onSubmit={zona.handleSubmit}
      />
    </AppLayout>
  );
}
