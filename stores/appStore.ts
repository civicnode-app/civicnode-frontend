import { create } from "zustand";

export interface User {
  name: string;
  role: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AppState {
  user: User;
  notifications: Notification[];
  hasUnread: boolean;
  sidebarOpen: boolean;
  // Actions
  setUser: (user: User) => void;
  markAllRead: () => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    name: "ATUN",
    role: "OWNER",
  },
  notifications: [
    {
      id: "1",
      message: "Deteksi sampah baru di Siring",
      read: false,
      createdAt: "2026-03-01T21:24:00",
    },
    {
      id: "2",
      message: "CCTV_1 online",
      read: false,
      createdAt: "2026-03-01T20:00:00",
    },
  ],
  hasUnread: true,
  sidebarOpen: true,

  setUser: (user) => set({ user }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      hasUnread: false,
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, id: Date.now().toString() },
        ...state.notifications,
      ],
      hasUnread: true,
    })),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
