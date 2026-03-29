"use client";

import { useEffect } from "react";
import { useDashboardStore, type TimelineLogEntry } from "@/stores/dashboardStore";
import { getAuthToken } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

const formatPeriode = (mulai: string, selesai: string) => {
  const m = new Date(mulai);
  const s = new Date(selesai);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(m.getHours())}:${pad(m.getMinutes())} – ${pad(s.getHours())}:${pad(s.getMinutes())}`;
};

const formatRingkasan = (ringkasan: Record<string, number>) => {
  return Object.entries(ringkasan)
    .map(([jenis, count]) => `${jenis} (${count})`)
    .join(", ");
};

export default function TimelineLog() {
  const { timelineLogs, timelineLoading, setTimelineLogs, setTimelineLoading } =
    useDashboardStore();

  useEffect(() => {
    const fetchLogs = async () => {
      const token = getAuthToken();
      if (!token) return;

      setTimelineLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/timeline-log`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setTimelineLogs(json.data);
      } catch {
        // gagal fetch — tampilkan list kosong
      } finally {
        setTimelineLoading(false);
      }
    };

    fetchLogs();
  }, [setTimelineLogs, setTimelineLoading]);

  return (
    <div className="relative flex-1 bg-[rgb(202,219,183)] rounded-[30px] p-0 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-0 py-4 px-6">
        <div className="w-2.5 h-2.5 bg-[#333] rounded-full shrink-0" />
        <span className="font-extrabold text-[13px] tracking-[0.05em]">
          TIMELINE LOG
        </span>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 px-6 py-4 [scrollbar-width:none]">
        {timelineLoading && (
          <p className="text-[12px] text-center opacity-50 mt-4">Memuat...</p>
        )}

        {!timelineLoading && timelineLogs.length === 0 && (
          <p className="text-[12px] text-center opacity-50 mt-4">Belum ada log.</p>
        )}

        {timelineLogs.map((log: TimelineLogEntry) => (
          <div
            key={log.id}
            className="bg-[#a3b18a] px-4 py-3.5 rounded-[18px] text-white shrink-0 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:bg-[#588157] hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center justify-between">
              <p className="m-0 text-[13px] font-bold">{log.zona.nama}</p>
              <span className="text-[11px] opacity-70 font-semibold">
                {log.total_deteksi} deteksi
              </span>
            </div>
            <p className="m-0 mt-0.5 text-[11px] opacity-80">
              {log.cctv.nama} · {formatPeriode(log.periode_mulai, log.periode_selesai)}
            </p>
            <p className="m-0 mt-1 text-[10px] opacity-60 truncate">
              {formatRingkasan(log.ringkasan)}
            </p>
          </div>
        ))}
      </div>

      {/* fade bottom */}
      <div className="absolute w-full pointer-events-none bottom-0 left-0 bg-linear-360 from-[rgba(202,219,183,1)] to-[rgba(202,219,183,0)] h-10" />
    </div>
  );
}
