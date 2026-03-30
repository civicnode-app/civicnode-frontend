"use client";

import { useMemo, useRef, useState } from "react";
import { DUMMY_CAMERAS, TriageZone } from "../_types";
import { useDashboardStore } from "../_store/useDashboardStore";

// Score ≥ GREEN_THRESHOLD → zona dianggap sudah bersih, petugas boleh pulang
const GREEN_THRESHOLD = 90;

export function useZoneTriage() {
  const zones          = useDashboardStore((s) => s.zones);
  const zoneDispatches = useDashboardStore((s) => s.zoneDispatches);

  const [dispatchTarget, setDispatchTarget] = useState<TriageZone | null>(null);

  // Timeout IDs per zona (recursive setTimeout, bukan setInterval,
  // supaya perubahan recoveryTickMs langsung berlaku di tick berikutnya)
  const recoveryTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const travelTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const returnTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

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

  const activeCameraCount = DUMMY_CAMERAS.filter((c) => c.status).length;

  function getCamerasForZone(zoneId: string) {
    return DUMMY_CAMERAS.filter((c) => c.zone_id === zoneId);
  }

  function openDispatch(zone: TriageZone)  { setDispatchTarget(zone); }
  function closeDispatch()                  { setDispatchTarget(null); }

  // Naikkan score zona satu tick sekaligus jadwalkan tick berikutnya.
  // Membaca config terbaru dari store setiap tick — perubahan dari panel
  // config (pointsPerOfficer, recoveryTickMs, travelReturnMs) langsung berlaku.
  function startRecovery(zoneId: string) {
    if (recoveryTimers.current[zoneId]) {
      clearTimeout(recoveryTimers.current[zoneId]);
    }

    function tick() {
      const store = useDashboardStore.getState();
      const zone  = store.zones.find((z) => z.id === zoneId);
      if (!zone) return;

      // Zona tidak terpantau — tidak ada score yang bisa diperbaiki,
      // langsung jadwalkan kepulangan petugas
      if (zone.score === null) {
        delete recoveryTimers.current[zoneId];
        const dispatched = store.zoneDispatches[zoneId] ?? 0;
        store.clearZoneDispatch(zoneId);
        returnTimeouts.current[zoneId] = setTimeout(() => {
          useDashboardStore.getState().returnPersonel(dispatched);
          delete returnTimeouts.current[zoneId];
        }, store.config.travelReturnMs);
        return;
      }

      const increment = (store.zoneDispatches[zoneId] ?? 1) * store.config.pointsPerOfficer;
      const newScore  = Math.min(100, zone.score + increment);
      store.updateZoneScore(zoneId, newScore);
      store.removeDetections(increment);

      if (newScore >= GREEN_THRESHOLD) {
        delete recoveryTimers.current[zoneId];

        const dispatched = store.zoneDispatches[zoneId] ?? 0;
        store.clearZoneDispatch(zoneId);

        returnTimeouts.current[zoneId] = setTimeout(() => {
          useDashboardStore.getState().returnPersonel(dispatched);
          delete returnTimeouts.current[zoneId];
        }, store.config.travelReturnMs);
      } else {
        // Jadwalkan tick berikutnya — membaca recoveryTickMs terbaru
        recoveryTimers.current[zoneId] = setTimeout(tick, store.config.recoveryTickMs);
      }
    }

    const { config } = useDashboardStore.getState();
    recoveryTimers.current[zoneId] = setTimeout(tick, config.recoveryTickMs);
  }

  function handleDispatchConfirm(zone: TriageZone, jumlah: number) {
    useDashboardStore.getState().dispatchPersonel(zone.id, jumlah);

    if (travelTimeouts.current[zone.id]) {
      clearTimeout(travelTimeouts.current[zone.id]);
    }

    const { config } = useDashboardStore.getState();
    travelTimeouts.current[zone.id] = setTimeout(() => {
      delete travelTimeouts.current[zone.id];
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
