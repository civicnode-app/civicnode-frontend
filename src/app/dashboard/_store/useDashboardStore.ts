import { create } from "zustand";
import { DUMMY_ZONES, TriageZone } from "../_types";
import {
  INITIAL_ARMADA_SIAGA,
  TRAVEL_TO_FIELD_MS,
  TRAVEL_RETURN_MS,
  DEGRADATION_MS,
  RECOVERY_TICK_MS,
  POINTS_PER_OFFICER,
} from "../simulation.config";

export interface SimConfig {
  travelToFieldMs: number;
  travelReturnMs: number;
  degradationMs: number;
  recoveryTickMs: number;
  pointsPerOfficer: number;
}

const initialActiveDetections = DUMMY_ZONES.reduce(
  (sum, z) => sum + (z.score !== null ? Math.max(0, Math.floor((80 - z.score) / 15)) : 0),
  0,
);

interface DashboardStore {
  armadaSiaga: number;
  activeDetections: number;
  zones: TriageZone[];
  zoneDispatches: Record<string, number>;
  config: SimConfig;

  dispatchPersonel: (zoneId: string, jumlah: number) => void;
  updateZoneScore: (zoneId: string, score: number) => void;
  clearZoneDispatch: (zoneId: string) => void;
  returnPersonel: (jumlah: number) => void;
  addDetection: () => void;
  removeDetections: (amount: number) => void;
  updateConfig: (patch: Partial<SimConfig>) => void;
  setArmada: (jumlah: number) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  armadaSiaga: INITIAL_ARMADA_SIAGA,
  activeDetections: initialActiveDetections,
  zones: DUMMY_ZONES,
  zoneDispatches: {},
  config: {
    travelToFieldMs: TRAVEL_TO_FIELD_MS,
    travelReturnMs:  TRAVEL_RETURN_MS,
    degradationMs:   DEGRADATION_MS,
    recoveryTickMs:  RECOVERY_TICK_MS,
    pointsPerOfficer: POINTS_PER_OFFICER,
  },

  dispatchPersonel: (zoneId, jumlah) =>
    set((s) => ({
      armadaSiaga: Math.max(0, s.armadaSiaga - jumlah),
      zoneDispatches: {
        ...s.zoneDispatches,
        [zoneId]: (s.zoneDispatches[zoneId] ?? 0) + jumlah,
      },
    })),

  updateZoneScore: (zoneId, score) =>
    set((s) => ({
      zones: s.zones.map((z) =>
        z.id === zoneId ? { ...z, score: Math.round(score * 100) / 100 } : z,
      ),
    })),

  clearZoneDispatch: (zoneId) =>
    set((s) => {
      const next = { ...s.zoneDispatches };
      delete next[zoneId];
      return { zoneDispatches: next };
    }),

  returnPersonel:   (jumlah) => set((s) => ({ armadaSiaga: s.armadaSiaga + jumlah })),
  addDetection:     ()       => set((s) => ({ activeDetections: s.activeDetections + 1 })),
  removeDetections: (amount) => set((s) => ({ activeDetections: Math.max(0, s.activeDetections - amount) })),
  updateConfig:     (patch)  => set((s) => ({ config: { ...s.config, ...patch } })),
  setArmada:        (jumlah) => set({ armadaSiaga: jumlah }),
}));
