"use client";
import { useEffect, useRef } from "react";

interface Props {
  src: string;
  onLoad: () => void;
}

// DroidCam hanya support 1 koneksi MJPEG per kamera.
// Dua skenario yang bikin error "Error creating image encoder":
//
//   1. Page reload  — browser kirim request baru sebelum TCP lama bener-bener
//      tutup di sisi DroidCam. Fix: beforeunload listener yang set src="" agar
//      browser abort koneksi sebelum halaman di-destroy.
//
//   2. Reconnect    — kalau DroidCam masih menolak (koneksi lama belum sepenuhnya
//      dilepas), onError akan jadwalkan retry setiap 2 detik sampai berhasil.

export function StreamImg({ src, onLoad }: Props) {
  const ref       = useRef<HTMLImageElement>(null);
  const retryRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted   = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const close = () => { if (ref.current) ref.current.src = ""; };
    window.addEventListener("beforeunload", close);

    return () => {
      mounted.current = false;
      window.removeEventListener("beforeunload", close);
      close();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, []);

  function scheduleRetry() {
    if (retryRef.current) clearTimeout(retryRef.current);
    retryRef.current = setTimeout(() => {
      if (!mounted.current || !ref.current) return;
      ref.current.src = "";
      setTimeout(() => {
        if (mounted.current && ref.current) ref.current.src = src;
      }, 50);
    }, 2000);
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
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
