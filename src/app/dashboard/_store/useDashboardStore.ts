import { create } from "zustand";

interface DashboardStore {
  armadaSiaga: number;
  // Dipanggil saat admin confirm "Kirim Petugas"
  dispatchPersonel: (jumlah: number) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  armadaSiaga: 24,

  dispatchPersonel: (jumlah) =>
    set((s) => ({
      armadaSiaga: Math.max(0, s.armadaSiaga - jumlah),
    })),
}));
