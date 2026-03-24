import { create } from "zustand";

export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
}

export interface TimelineLog {
  id: number;
  location: string;
  timestamp: string;
}

export interface FeedInfo {
  cameraId: string;
  location: string;
  date: string;
  isLive: boolean;
}

/** Satu baris dari tabel data_pelanggaran */
export interface ViolationRecord {
  id: string;
  cctv_id: string;
  foto_url: string | null;
  ipfs_hash: string | null;
  waktu_kejadian: string;
  confidence_score: number;
  created_at: string;
  /** Status review manual oleh staff – disimpan lokal */
  reviewStatus?: "pending" | "confirmed" | "ignored";
}

interface DashboardState {
  stats: StatCard[];
  timelineLogs: TimelineLog[];
  feed: FeedInfo;
  searchQuery: string;
  violations: ViolationRecord[];
  violationsLoading: boolean;
  // Actions
  setSearchQuery: (query: string) => void;
  addLog: (log: Omit<TimelineLog, "id">) => void;
  updateStat: (id: string, value: string | number) => void;
  setViolations: (records: ViolationRecord[]) => void;
  setViolationsLoading: (loading: boolean) => void;
  reviewViolation: (id: string, status: "confirmed" | "ignored") => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: [
    { id: "active-detections", label: "ACTIVE DETECTIONS", value: 0 },
    { id: "waste-reduction", label: "WASTE REDUCTION", value: "0%" },
    { id: "node-reputation", label: "NODE REPUTATION", value: "—" },
  ],
  timelineLogs: [
    { id: 1, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.21" },
    { id: 2, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.22" },
    { id: 3, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.23" },
    { id: 4, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.24" },
    { id: 5, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.25" },
  ],
  feed: {
    cameraId: "CCTV_1",
    location: "Siring",
    date: "Minggu, 01 Maret 2026 21.24",
    isLive: true,
  },
  searchQuery: "",
  violations: [],
  violationsLoading: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  addLog: (log) =>
    set((state) => ({
      timelineLogs: [
        { ...log, id: state.timelineLogs.length + 1 },
        ...state.timelineLogs,
      ],
    })),

  updateStat: (id, value) =>
    set((state) => ({
      stats: state.stats.map((s) => (s.id === id ? { ...s, value } : s)),
    })),

  setViolations: (records) => set({ violations: records }),
  setViolationsLoading: (loading) => set({ violationsLoading: loading }),

  reviewViolation: (id, status) =>
    set((state) => ({
      violations: state.violations.map((v) =>
        v.id === id ? { ...v, reviewStatus: status } : v
      ),
    })),
}));
