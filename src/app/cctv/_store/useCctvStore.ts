import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CCTVNode } from "../_types";

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

interface CctvStore {
  cctvList: CCTVNode[];
  addCctv:       (node: CCTVNode) => void;
  updateCctv:    (id: string, patch: Partial<CCTVNode>) => void;
  deleteCctv:    (id: string) => void;
  mergeFromSeed: () => Promise<void>;
}

export const useCctvStore = create<CctvStore>()(
  persist(
    (set, get) => ({
      cctvList: INITIAL_CCTVS,
      addCctv:    (node)      => set((s) => ({ cctvList: [...s.cctvList, node] })),
      updateCctv: (id, patch) => set((s) => ({ cctvList: s.cctvList.map((c) => c.id === id ? { ...c, ...patch } : c) })),
      deleteCctv: (id)        => set((s) => ({ cctvList: s.cctvList.filter((c) => c.id !== id) })),
      mergeFromSeed: async () => {
        try {
          const res  = await fetch("/api/seed");
          const { cctvList: seed } = await res.json() as { cctvList: CCTVNode[] };
          if (!seed?.length) return;
          const existing = new Set(get().cctvList.map((c) => c.id));
          const newItems = seed.filter((c) => !existing.has(c.id));
          if (newItems.length) set((s) => ({ cctvList: [...s.cctvList, ...newItems] }));
        } catch { /* server mungkin belum jalan */ }
      },
    }),
    { name: "civicnode-cctv" },
  ),
);
