"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  onLoad: () => void;
}

// DroidCam hanya support 1 koneksi MJPEG per kamera.
//
// Problem utama: waktu tab/halaman ganti, React langsung mount instance baru
// hampir bersamaan dengan unmount instance lama. Browser belum sempat proses
// abort koneksi lama sebelum request baru masuk → DroidCam reject.
//
// Solusi:
//   1. activeSrc mulai dari "" (tidak langsung connect saat mount)
//   2. Delay 300ms sebelum set activeSrc → beri waktu browser abort koneksi lama
//   3. beforeunload listener → abort eksplisit saat page reload/close
//   4. onError + retry 2s → kalau DroidCam masih reject, coba lagi otomatis

export function StreamImg({ src, onLoad }: Props) {
  const [activeSrc, setActiveSrc] = useState("");
  const ref      = useRef<HTMLImageElement>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted  = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const initTimer = setTimeout(() => {
      if (mounted.current) setActiveSrc(src);
    }, 300);

    const close = () => {
      if (ref.current) ref.current.src = "";
    };
    window.addEventListener("beforeunload", close);

    return () => {
      mounted.current = false;
      clearTimeout(initTimer);
      if (retryRef.current) clearTimeout(retryRef.current);
      window.removeEventListener("beforeunload", close);
      setActiveSrc("");
      close();
    };
  }, [src]);

  function scheduleRetry() {
    if (retryRef.current) clearTimeout(retryRef.current);
    retryRef.current = setTimeout(() => {
      if (!mounted.current) return;
      setActiveSrc("");
      setTimeout(() => {
        if (mounted.current) setActiveSrc(src);
      }, 50);
    }, 2000);
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={activeSrc || undefined}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      onLoad={() => {
        if (retryRef.current) clearTimeout(retryRef.current);
        onLoad();
      }}
      onError={scheduleRetry}
    />
  );
}
