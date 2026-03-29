import { DialogState } from "../_types";

interface Props {
  dialog: DialogState | null;
  toast: string | null;
  onClose: () => void;
}

export function ConfirmDialog({ dialog, toast, onClose }: Props) {
  return (
    <>
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.2)] font-bold text-sm flex items-center gap-2">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {dialog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col gap-5">
            <p className="m-0 text-[15px] font-bold text-[#333] leading-relaxed">{dialog.message}</p>
            <div className="flex gap-3">
              {dialog.type === "confirm" && (
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-full text-sm font-black border-2 border-[#ddd] text-[#888] bg-white hover:bg-[#f5f5f5] transition-colors cursor-pointer">
                  Batal
                </button>
              )}
              <button
                onClick={() => {
                  if (dialog.type === "confirm") dialog.onConfirm();
                  else onClose();
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
    </>
  );
}
