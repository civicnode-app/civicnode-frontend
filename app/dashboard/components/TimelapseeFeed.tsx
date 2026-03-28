"use client";

import { useEffect, useRef, useState } from "react";

export default function TimelapseeFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setError("Akses kamera ditolak atau tidak tersedia.");
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const now = new Date().toLocaleString("id-ID", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="w-120 shrink-0 bg-white rounded-[30px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col min-h-105">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-red-500 text-lg">📡</span>
          <span className="text-red-500 font-bold text-sm">Time-lapse Feed</span>
        </div>
        <span className="font-extrabold text-[#333] text-sm">CCTV_1</span>
      </div>

      {/* Video / error */}
      <div className="flex-1 bg-[#f5f5f5] rounded-[20px] overflow-hidden mt-3 min-h-70">
        {error ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-[12px] text-[#aaa] text-center px-4">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#eee] mt-3">
        <p className="m-0 font-extrabold text-base text-[#333]">Laptop Camera (Dev)</p>
        <p className="m-0 mt-1 text-[13px] opacity-60 text-[#333]">{now}</p>
      </div>
    </div>
  );
}
