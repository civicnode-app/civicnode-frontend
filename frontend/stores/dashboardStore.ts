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
  mulct: string;
}

export interface FeedInfo {
  cameraId: string;
  location: string;
  date: string;
  isLive: boolean;
}

interface DashboardState {
  stats: StatCard[];
  timelineLogs: TimelineLog[];
  feed: FeedInfo;
  searchQuery: string;
  // Actions
  setSearchQuery: (query: string) => void;
  addLog: (log: Omit<TimelineLog, "id">) => void;
  updateStat: (id: string, value: string | number) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: [
    { id: "active-detections", label: "ACTIVE DETECTIONS", value: 0 },
    { id: "waste-reduction", label: "WASTE REDUCTION", value: "0%" },
    { id: "node-reputation", label: "NODE REPUTATION", value: "—" },
    { id: "mulct", label: "MULCT", value: "Rp 0" },
  ],
  timelineLogs: [
    { id: 1, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.21", mulct: "Rp 15.000" },
    { id: 2, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.22", mulct: "Rp 15.000" },
    { id: 3, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.23", mulct: "Rp 15.000" },
    { id: 4, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.24", mulct: "Rp 15.000" },
    { id: 5, location: "Siring", timestamp: "Minggu, 01 Maret 2026 21.25", mulct: "Rp 15.000" },
  ],
  feed: {
    cameraId: "CCTV_1",
    location: "Siring",
    date: "Minggu, 01 Maret 2026 21.24",
    isLive: true,
  },
  searchQuery: "",

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
}));
