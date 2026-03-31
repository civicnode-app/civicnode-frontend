"use client";

import { useEffect, type ReactNode } from "react";
import { useDashboardStore } from "@/app/dashboard/_store/useDashboardStore";
import { TriageZone, CameraNode } from "@/app/dashboard/_types";
import { useCctvStore } from "@/app/cctv/_store/useCctvStore";
import { useZonaStore } from "@/app/cctv/_store/useZonaStore";
import { CCTVNode, Zona } from "@/app/cctv/_types";

const MIN_ZONE_SCORE = 0;

function cctvToCamera(c: CCTVNode): CameraNode | null {
  if (!c.zona) return null;
  return {
    id:                c.id,
    zone_id:           c.zona.id,
    name:              c.nama,
    ip_address:        c.ip_address,
    status:            c.status,
    active_detections: c.active_detections,
  };
}

function zonaToTriageZone(z: Zona): TriageZone {
  return {
    id:           z.id,
    name:         z.nama,
    location:     z.deskripsi || "",
    score:        null, // activateNullZones akan set score nyata kalau ada kamera
    evidence_url: "",
    last_updated: "",
  };
}

/** Zona yang punya score=null tapi sudah ada kamera → aktifkan dengan score nyata */
function activateNullZones() {
  const { zones, cameras } = useDashboardStore.getState();
  const { zonaList }       = useZonaStore.getState();

  zones.forEach((z) => {
    if (z.score !== null) return;
    const hasCam = cameras.some((c) => c.zone_id === z.id);
    if (!hasCam) return;
    const zona  = zonaList.find((zs) => zs.id === z.id);
    const score = (zona?.zone_reputation ?? 0) > 0 ? zona!.zone_reputation : 50;
    useDashboardStore.getState().updateZoneScore(z.id, score);
  });
}

/**
 * Menjalankan interval degradasi simulasi secara global — tetap aktif
 * berapapun halaman yang sedang dibuka. Dipasang di AppLayout.
 */
export function SimulationProvider({ children }: { children: ReactNode }) {
  const degradationMs = useDashboardStore((s) => s.config.degradationMs);

  // Sync awal dari tools/db.json ke semua store saat pertama mount
  useEffect(() => {
    Promise.all([
      useCctvStore.getState().mergeFromSeed(),
      useZonaStore.getState().mergeFromSeed(),
    ]).then(() => {
      const { cctvList } = useCctvStore.getState();
      const { zonaList } = useZonaStore.getState();

      const validZonaIds = new Set(zonaList.map((z) => z.id));

      // Hapus dari dashboard zona yang sudah dihapus dari zonaStore (tidak persisted → reset tiap refresh)
      useDashboardStore.getState().zones.forEach((z) => {
        if (!validZonaIds.has(z.id)) useDashboardStore.getState().removeZone(z.id);
      });

      // Bersihkan referensi zona orphan di CCTV (zona sudah dihapus tapi CCTV belum di-clear)
      const orphanedIds = new Set(
        cctvList.filter((c) => c.zona && !validZonaIds.has(c.zona.id)).map((c) => c.zona!.id),
      );
      orphanedIds.forEach((zoneId) => useCctvStore.getState().clearZona(zoneId));

      useDashboardStore.getState().mergeNodesFromSeed(
        zonaList.map(zonaToTriageZone),
        cctvList.flatMap((c) => { const cam = cctvToCamera(c); return cam ? [cam] : []; }),
      );
      activateNullZones();
    });
  }, []);

  // Reaktif: setiap kali cctvList bertambah (UI atau seed), sync ke dashboard
  useEffect(() => {
    return useCctvStore.subscribe((state) => {
      const dashCamIds = new Set(useDashboardStore.getState().cameras.map((c) => c.id));
      const newCameras = state.cctvList
        .flatMap((c) => { const cam = cctvToCamera(c); return cam && !dashCamIds.has(c.id) ? [cam] : []; });
      if (newCameras.length) {
        useDashboardStore.getState().mergeNodesFromSeed([], newCameras);
        activateNullZones();
      }
    });
  }, []);

  // Reaktif: setiap kali zonaList bertambah, sync zona baru ke dashboard
  useEffect(() => {
    return useZonaStore.subscribe((state) => {
      const dashZoneIds = new Set(useDashboardStore.getState().zones.map((z) => z.id));
      const newZones = state.zonaList
        .filter((z) => !dashZoneIds.has(z.id))
        .map(zonaToTriageZone);
      if (newZones.length) {
        useDashboardStore.getState().mergeNodesFromSeed(newZones, []);
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const { zones, zoneDispatches, incrementZoneDetection, updateZoneScore } =
        useDashboardStore.getState();

      const available = zones.filter(
        (z) => !zoneDispatches[z.id] && z.score !== null && z.score > MIN_ZONE_SCORE,
      );
      if (available.length === 0) return;

      const target = available[Math.floor(Math.random() * available.length)];
      incrementZoneDetection(target.id);
      updateZoneScore(target.id, (target.score as number) - 1);
    }, degradationMs);

    return () => clearInterval(interval);
  }, [degradationMs]);

  return <>{children}</>;
}
