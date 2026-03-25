import { create } from "zustand";

export interface TimelineLogEntry {
  id: string;
  periode_mulai: string;
  periode_selesai: string;
  ringkasan: Record<string, number>;
  total_deteksi: number;
  cctv: { id: string; nama: string; ip_address: string };
  zona: { id: string; nama: string };
}

export interface FeedInfo {
  cameraId: string;
  location: string;
  date: string;
  isLive: boolean;
}

interface DashboardState {
  timelineLogs: TimelineLogEntry[];
  timelineLoading: boolean;
  feed: FeedInfo;
  searchQuery: string;
  // Actions
  setTimelineLogs: (logs: TimelineLogEntry[]) => void;
  setTimelineLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  timelineLogs: [],
  timelineLoading: false,
  feed: {
    cameraId: "",
    location: "",
    date: "",
    isLive: true,
  },
  searchQuery: "",

  setTimelineLogs: (logs) => set({ timelineLogs: logs }),
  setTimelineLoading: (loading) => set({ timelineLoading: loading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
