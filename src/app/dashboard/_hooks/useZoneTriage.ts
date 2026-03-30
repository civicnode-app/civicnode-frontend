"use client";

import { useMemo, useState } from "react";
import { DUMMY_CAMERAS, DUMMY_ZONES, TriageZone } from "../_types";
import { useDashboardStore } from "../_store/useDashboardStore";

export function useZoneTriage() {
  const [zones] = useState<TriageZone[]>(DUMMY_ZONES);
  const [dispatchTarget, setDispatchTarget] = useState<TriageZone | null>(null);
  const dispatchPersonel = useDashboardStore((s) => s.dispatchPersonel);

  // Zona paling kritis (skor terendah) tampil di atas
  const sortedZones = useMemo(
    () => [...zones].sort((a, b) => a.score - b.score),
    [zones],
  );

  const activeCameraCount = DUMMY_CAMERAS.filter((c) => c.status).length;

  function getCamerasForZone(zoneId: string) {
    return DUMMY_CAMERAS.filter((c) => c.zone_id === zoneId);
  }

  function openDispatch(zone: TriageZone) {
    setDispatchTarget(zone);
  }

  function closeDispatch() {
    setDispatchTarget(null);
  }

  function handleDispatchConfirm(zone: TriageZone, jumlah: number) {
    dispatchPersonel(jumlah); // kurangi armada siaga dari store
    console.log(`Mengirim ${jumlah} petugas ke ${zone.name}`);
  }

  return {
    sortedZones,
    dispatchTarget,
    activeCameraCount,
    getCamerasForZone,
    openDispatch,
    closeDispatch,
    handleDispatchConfirm,
  };
}
