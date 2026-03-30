import { create } from "zustand";

interface DashboardStore {
  armadaSiaga: number;
  // Dipanggil saat admin confirm "Kirim Petugas"
  dispatchPersonel: (jumlah: number) => void;
  // Dipanggil oleh interval di useStats untuk simulasi fluktuasi alami
  fluctuateArmada: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  armadaSiaga: 24,

  dispatchPersonel: (jumlah) =>
    set((s) => ({
      armadaSiaga: Math.max(0, s.armadaSiaga - jumlah),
    })),

  fluctuateArmada: () =>
    set((s) => ({
      // Fluktuasi ±1 untuk simulasi personel yang keluar/masuk tugas,
      // tapi tidak melampaui 30 dan tidak negatif
      armadaSiaga: Math.round(
        Math.min(30, Math.max(0, s.armadaSiaga + (Math.random() - 0.5) * 2)),
      ),
    })),
}));
