import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Zona } from "../_types";

const INITIAL_ZONAS: Zona[] = [
  { id: "z1", nama: "Simpang Antasari", deskripsi: "Area persimpangan lalu-lintas utama yang berpotensi rawan tumpukan sampah.", zone_reputation: 42 },
  { id: "z2", nama: "Pasar Sudimampur", deskripsi: "Pusat perbelanjaan grosir tradisional dengan volume limbah domestik tinggi.", zone_reputation: 28 },
  { id: "z3", nama: "Taman Kamboja",    deskripsi: "Taman terbuka rekreasi hijau yang dilengkapi banyak tempat sampah terpisah.", zone_reputation: 85 },
  { id: "z4", nama: "Jalan Veteran",    deskripsi: "Jalur utama kuliner dan pejalan kaki lintas kecamatan.", zone_reputation: 62 },
  { id: "z5", nama: "Lorong Pahlawan",  deskripsi: "Belum ada kamera CCTV yang terpasang. Tingkat kebersihan tidak dapat dipantau.", zone_reputation: 0 },
  { id: "z6", nama: "Terminal Lama",    deskripsi: "Belum ada kamera CCTV yang terpasang. Tingkat kebersihan tidak dapat dipantau.", zone_reputation: 0 },
];

interface ZonaStore {
  zonaList: Zona[];
  addZona:       (zona: Zona) => void;
  updateZona:    (id: string, patch: Partial<Zona>) => void;
  deleteZona:    (id: string) => void;
  mergeFromSeed: () => Promise<void>;
}

export const useZonaStore = create<ZonaStore>()(
  persist(
    (set, get) => ({
      zonaList: INITIAL_ZONAS,
      addZona:    (zona)      => set((s) => ({ zonaList: [...s.zonaList, zona] })),
      updateZona: (id, patch) => set((s) => ({ zonaList: s.zonaList.map((z) => z.id === id ? { ...z, ...patch } : z) })),
      deleteZona: (id)        => set((s) => ({ zonaList: s.zonaList.filter((z) => z.id !== id) })),
      mergeFromSeed: async () => {
        try {
          const res = await fetch("/api/seed");
          const { zonaList: seed } = await res.json() as { zonaList: Zona[] };
          if (!seed?.length) return;
          const existing = new Set(get().zonaList.map((z) => z.id));
          const newItems = seed.filter((z) => !existing.has(z.id));
          if (newItems.length) set((s) => ({ zonaList: [...s.zonaList, ...newItems] }));
        } catch { /* server mungkin belum jalan */ }
      },
    }),
    { name: "civicnode-zona" },
  ),
);
