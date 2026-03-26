"use client";
import { useEffect, useRef } from "react";

interface Props {
  src: string;
  onLoad: () => void;
}

export function StreamImg({ src, onLoad }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    return () => {
      // Set src="" on unmount agar koneksi MJPEG ke DroidCam ditutup bersih.
      // Mencegah "Error creating image encoder" saat halaman di-reload atau
      // saat user navigasi dan kembali ke halaman ini.
      if (ref.current) ref.current.src = "";
    };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      onLoad={onLoad}
    />
  );
}
