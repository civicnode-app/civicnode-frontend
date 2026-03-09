import { create } from "zustand";

export type CCTVStatus = "online" | "offline" | "detecting";

export interface CCTVNode {
  id: string;
  label: string;
  cameraName: string;
  blockchainHash: string;
  timestamp: string;
  status: CCTVStatus;
}

interface CCTVState {
  nodes: CCTVNode[];
  selectedNode: string | null;
  // Actions
  selectNode: (id: string | null) => void;
  updateNode: (id: string, data: Partial<CCTVNode>) => void;
  addNode: (node: CCTVNode) => void;
}

export const useCCTVStore = create<CCTVState>((set) => ({
  nodes: [
    {
      id: "cctv-1",
      label: "CCTV 1",
      cameraName: "CAMERA",
      blockchainHash: "HASH",
      timestamp: "TIMESTAMP",
      status: "online",
    },
    {
      id: "cctv-2",
      label: "CCTV 2",
      cameraName: "CAMERA",
      blockchainHash: "HASH",
      timestamp: "TIMESTAMP",
      status: "online",
    },
  ],
  selectedNode: null,

  selectNode: (id) => set({ selectedNode: id }),

  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    })),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
}));
