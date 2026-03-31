import { create } from "zustand";
import { DUMMY_ZONES, DUMMY_CAMERAS, TriageZone, CameraNode } from "../_types";
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

interface DashboardStore {
  armadaSiaga: number;
  // activeDetections = sum of active_detections semua kamera (diupdate bersama cameras)
  activeDetections: number;
  zones: TriageZone[];
  cameras: CameraNode[];
  zoneDispatches: Record<string, number>;
  config: SimConfig;

  dispatchPersonel: (zoneId: string, jumlah: number) => void;
  updateZoneScore: (zoneId: string, score: number) => void;
  clearZoneDispatch: (zoneId: string) => void;
  returnPersonel: (jumlah: number) => void;
  // Degradasi: +1 ke kamera random di zona itu + +1 ke total
  incrementZoneDetection: (zoneId: string) => void;
  // Recovery: -floor(amount) dari kamera di zona itu + update total
  decrementZoneDetections: (zoneId: string, amount: number) => void;
  updateConfig: (patch: Partial<SimConfig>) => void;
  setArmada: (jumlah: number) => void;
  mergeNodesFromSeed: (newZones: TriageZone[], newCameras: CameraNode[]) => void;
  removeZone: (zoneId: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  armadaSiaga:      INITIAL_ARMADA_SIAGA,
  activeDetections: DUMMY_CAMERAS.reduce((sum, c) => sum + c.active_detections, 0),
  zones:            DUMMY_ZONES,
  cameras:          DUMMY_CAMERAS,
  zoneDispatches:   {},
  config: {
    travelToFieldMs:  TRAVEL_TO_FIELD_MS,
    travelReturnMs:   TRAVEL_RETURN_MS,
    degradationMs:    DEGRADATION_MS,
    recoveryTickMs:   RECOVERY_TICK_MS,
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

  returnPersonel: (jumlah) => set((s) => ({ armadaSiaga: s.armadaSiaga + jumlah })),

  incrementZoneDetection: (zoneId) =>
    set((s) => {
      const zoneCams = s.cameras.filter((c) => c.zone_id === zoneId && c.status);
      if (zoneCams.length === 0) return { activeDetections: s.activeDetections + 1 };
      const target = zoneCams[Math.floor(Math.random() * zoneCams.length)];
      return {
        cameras: s.cameras.map((c) =>
          c.id === target.id ? { ...c, active_detections: c.active_detections + 1 } : c,
        ),
        activeDetections: s.activeDetections + 1,
      };
    }),

  decrementZoneDetections: (zoneId, amount) =>
    set((s) => {
      const units = Math.floor(amount);
      if (units <= 0) return {};

      // Salin array supaya bisa dimutasi dalam loop
      const cameras = s.cameras.map((c) => ({ ...c }));
      let reduced = 0;

      for (let i = 0; i < units; i++) {
        const available = cameras
          .map((c, idx) => ({ c, idx }))
          .filter(({ c }) => c.zone_id === zoneId && c.active_detections > 0);
        if (available.length === 0) break;

        const { idx } =
          available[Math.floor(Math.random() * available.length)];
        cameras[idx].active_detections -= 1;
        reduced++;
      }

      return {
        cameras,
        activeDetections: Math.max(0, s.activeDetections - reduced),
      };
    }),

  removeZone: (zoneId) =>
    set((s) => {
      const removedCams       = s.cameras.filter((c) => c.zone_id === zoneId);
      const removedDetections = removedCams.reduce((sum, c) => sum + c.active_detections, 0);
      return {
        zones:            s.zones.filter((z) => z.id !== zoneId),
        cameras:          s.cameras.filter((c) => c.zone_id !== zoneId),
        activeDetections: Math.max(0, s.activeDetections - removedDetections),
      };
    }),

  updateConfig: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),
  setArmada:    (jumlah) => set({ armadaSiaga: jumlah }),

  mergeNodesFromSeed: (newZones, newCameras) =>
    set((s) => {
      const existingZoneIds = new Set(s.zones.map((z) => z.id));
      const existingCamIds  = new Set(s.cameras.map((c) => c.id));
      const zonesToAdd  = newZones.filter((z) => !existingZoneIds.has(z.id));
      const camsToAdd   = newCameras.filter((c) => !existingCamIds.has(c.id));
      if (!zonesToAdd.length && !camsToAdd.length) return {};
      return {
        zones:            [...s.zones, ...zonesToAdd],
        cameras:          [...s.cameras, ...camsToAdd],
        activeDetections: s.activeDetections + camsToAdd.reduce((sum, c) => sum + c.active_detections, 0),
      };
    }),
}));
