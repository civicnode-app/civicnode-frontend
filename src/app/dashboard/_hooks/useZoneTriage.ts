"use client";

import { useMemo, useState } from "react";
import { TriageZone } from "../_types";
import { useDashboardStore } from "../_store/useDashboardStore";

// Score ≥ GREEN_THRESHOLD → zona dianggap sudah bersih, petugas boleh pulang
const GREEN_THRESHOLD = 90;

// Module-level timer maps — tetap aktif walau komponen unmount/navigasi
const recoveryTimers: Record<string, ReturnType<typeof setTimeout>> = {};
const travelTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};
const returnTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};

export function useZoneTriage() {
  const zones          = useDashboardStore((s) => s.zones);
  const cameras        = useDashboardStore((s) => s.cameras);
  const zoneDispatches = useDashboardStore((s) => s.zoneDispatches);

  const [dispatchTarget, setDispatchTarget] = useState<TriageZone | null>(null);

  const sortedZones = useMemo(
    () => [...zones].sort((a, b) => {
      // Zona tidak terpantau selalu di akhir
      if (a.score === null && b.score === null) return 0;
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return a.score - b.score;
    }),
    [zones],
  );

  const activeCameraCount = cameras.filter((c) => c.status).length;

  function getCamerasForZone(zoneId: string) {
    return cameras.filter((c) => c.zone_id === zoneId);
  }

  function openDispatch(zone: TriageZone)  { setDispatchTarget(zone); }
  function closeDispatch()                  { setDispatchTarget(null); }

  // Naikkan score zona satu tick sekaligus jadwalkan tick berikutnya.
  // Membaca config terbaru dari store setiap tick — perubahan dari panel
  // config (pointsPerOfficer, recoveryTickMs, travelReturnMs) langsung berlaku.
  // Timer di module-level → tetap berjalan walau user navigasi ke halaman lain.
  function startRecovery(zoneId: string) {
    if (recoveryTimers[zoneId]) {
      clearTimeout(recoveryTimers[zoneId]);
    }

    function tick() {
      const store = useDashboardStore.getState();
      const zone  = store.zones.find((z) => z.id === zoneId);
      if (!zone) return;

      // Zona tidak terpantau — tidak ada score yang bisa diperbaiki,
      // langsung jadwalkan kepulangan petugas
      if (zone.score === null) {
        delete recoveryTimers[zoneId];
        const dispatched = store.zoneDispatches[zoneId] ?? 0;
        store.clearZoneDispatch(zoneId);
        returnTimeouts[zoneId] = setTimeout(() => {
          useDashboardStore.getState().returnPersonel(dispatched);
          delete returnTimeouts[zoneId];
        }, store.config.travelReturnMs);
        return;
      }

      const increment = (store.zoneDispatches[zoneId] ?? 1) * store.config.pointsPerOfficer;
      const newScore  = Math.min(100, zone.score + increment);
      store.updateZoneScore(zoneId, newScore);
      store.decrementZoneDetections(zoneId, increment);

      if (newScore >= GREEN_THRESHOLD) {
        delete recoveryTimers[zoneId];

        const dispatched = store.zoneDispatches[zoneId] ?? 0;
        store.clearZoneDispatch(zoneId);

        returnTimeouts[zoneId] = setTimeout(() => {
          useDashboardStore.getState().returnPersonel(dispatched);
          delete returnTimeouts[zoneId];
        }, store.config.travelReturnMs);
      } else {
        // Jadwalkan tick berikutnya — membaca recoveryTickMs terbaru
        recoveryTimers[zoneId] = setTimeout(tick, store.config.recoveryTickMs);
      }
    }

    const { config } = useDashboardStore.getState();
    recoveryTimers[zoneId] = setTimeout(tick, config.recoveryTickMs);
  }

  function handleDispatchConfirm(zone: TriageZone, jumlah: number) {
    useDashboardStore.getState().dispatchPersonel(zone.id, jumlah);

    if (travelTimeouts[zone.id]) {
      clearTimeout(travelTimeouts[zone.id]);
    }

    const { config } = useDashboardStore.getState();
    travelTimeouts[zone.id] = setTimeout(() => {
      delete travelTimeouts[zone.id];
      startRecovery(zone.id);
    }, config.travelToFieldMs);
  }

  return {
    sortedZones,
    zoneDispatches,
    dispatchTarget,
    activeCameraCount,
    getCamerasForZone,
    openDispatch,
    closeDispatch,
    handleDispatchConfirm,
  };
}
