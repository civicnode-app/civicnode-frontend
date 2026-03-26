"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useDialog } from "./_hooks/useDialog";
import { useCctv }   from "./_hooks/useCctv";
import { useZona }   from "./_hooks/useZona";
import { CctvCard }      from "./_components/CctvCard";
import { CctvModal }     from "./_components/CctvModal";
import { ZonaCard }      from "./_components/ZonaCard";
import { ZonaModal }     from "./_components/ZonaModal";
import { ConfirmDialog } from "./_components/ConfirmDialog";

export default function CCTVPage() {
  const [activeTab, setActiveTab] = useState<"cctv" | "zona">("cctv");

  const { dialog, toast, showAlert, showConfirm, showToast, closeDialog } = useDialog();
  const cctv = useCctv({ showToast, showAlert, showConfirm, closeDialog });
  const zona = useZona({ showToast, showAlert, showConfirm, closeDialog });

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#588157]">

        {/* ── Sticky top bar ── */}
        <div className="px-8 pt-8 flex flex-col gap-5">

          <header className="flex justify-between items-center">
            <span className="text-white font-extrabold text-xl tracking-[0.05em]">CCTV MONITOR</span>

            <div className="flex items-center gap-4">
              {activeTab === "cctv" && (
                <button onClick={cctv.openAdd}
                  className="bg-white text-[#588157] font-black text-sm px-5 py-2 rounded-full hover:bg-[#f0f5ee] transition-colors duration-200 cursor-pointer border-none">
                  + Tambah Kamera
                </button>
              )}

              {activeTab === "zona" && (
                <div className="flex items-center gap-3">
                  <div className="flex bg-[#4a6d48] rounded-full p-1 gap-1">
                    {(["asc", "desc"] as const).map((order) => (
                      <button key={order} onClick={() => zona.setSortOrder(order)}
                        className={`px-3.5 py-1 rounded-full text-[11px] font-black border-none cursor-pointer transition-all duration-200 ${
                          zona.sortOrder === order
                            ? "bg-white text-[#588157]"
                            : "bg-transparent text-white/70 hover:text-white"
                        }`}>
                        {order === "asc" ? "A → Z" : "Z → A"}
                      </button>
                    ))}
                  </div>
                  <button onClick={zona.openAdd}
                    className="bg-white text-[#588157] font-black text-sm px-5 py-2 rounded-full hover:bg-[#f0f5ee] transition-colors duration-200 cursor-pointer border-none">
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
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold border-none cursor-pointer transition-all duration-150 ${
                  activeTab === tab
                    ? "bg-white text-[#588157]"
                    : "bg-white/15 text-white/70 hover:bg-white/25 hover:text-white"
                }`}>
                {tab === "cctv" ? "CCTV" : "Zona"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {activeTab === "cctv" && (
            <div className="bg-[#CADBB7] rounded-[45px] p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cctv.cctvLoading && cctv.cctvList.length === 0 && (
                <div className="col-span-3 flex items-center justify-center py-10">
                  <p className="text-[#588157] font-bold opacity-50">Memuat kamera...</p>
                </div>
              )}
              {!cctv.cctvLoading && cctv.cctvList.length === 0 && (
                <div className="col-span-3 flex items-center justify-center py-10">
                  <p className="text-[#588157] font-bold opacity-50">Belum ada kamera terdaftar.</p>
                </div>
              )}
              {cctv.cctvList.map((node) => (
                <CctvCard
                  key={node.id}
                  node={node}
                  isAI={!!cctv.aiEnabled[node.id]}
                  streamLoaded={!!cctv.streamLoaded[node.id]}
                  boxes={cctv.boxes}
                  onToggleAI={() => cctv.toggleAI(node.id)}
                  onStreamLoad={() => cctv.markStreamLoaded(node.id)}
                  onEdit={() => cctv.openEdit(node)}
                  onDelete={() => cctv.handleDelete(node)}
                />
              ))}
            </div>
          )}

          {activeTab === "zona" && (
            <div className="bg-[#CADBB7] rounded-[45px] p-7">
              {zona.zonaLoading && (
                <div className="flex items-center justify-center py-10">
                  <p className="text-[#588157] font-bold opacity-50">Memuat zona...</p>
                </div>
              )}
              {!zona.zonaLoading && zona.zonaList.length === 0 && (
                <div className="flex items-center justify-center py-10">
                  <p className="text-[#588157] font-bold opacity-50">Belum ada zona terdaftar.</p>
                </div>
              )}
              {!zona.zonaLoading && zona.zonaList.length > 0 && (
                <div className="grid grid-cols-3 gap-5">
                  {zona.sortedZona.map((z) => (
                    <ZonaCard
                      key={z.id}
                      zona={z}
                      cameras={cctv.cctvList.filter((c) => c.zona.id === z.id)}
                      onEdit={() => zona.openEdit(z)}
                      onDelete={() => zona.handleDelete(z)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <ConfirmDialog dialog={dialog} toast={toast} onClose={closeDialog} />

      <CctvModal
        open={cctv.modalOpen}
        isEdit={!!cctv.editTarget}
        editId={cctv.editTarget?.id}
        form={cctv.form}
        zonaList={zona.zonaList}
        saving={cctv.saving}
        error={cctv.formError}
        onClose={cctv.closeModal}
        onChange={(patch) => cctv.setForm((p) => ({ ...p, ...patch }))}
        onSubmit={cctv.handleSubmit}
      />

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
    </div>
  );
}
