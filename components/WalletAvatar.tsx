"use client";
import { useRef, useEffect } from "react";

// Deterministik seed dari wallet address
function addressToSeed(address: string): number {
  let seed = 0;
  for (let i = 2; i < address.length; i++) {
    seed = (seed * 31 + parseInt(address[i], 16)) & 0x7fffffff;
  }
  return seed;
}

// LCG pseudo-random dari seed
function makeRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

interface WalletAvatarProps {
  address: string;
  size?: number;
  className?: string;
}

export function WalletAvatar({ address, size = 40, className = "" }: WalletAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !address) return;

    const rand  = makeRand(addressToSeed(address));
    const ctx   = canvas.getContext("2d")!;
    const scale = size / 5;
    const hue   = Math.floor(rand() * 360);

    // Background — warna muda
    ctx.fillStyle = `hsl(${hue}, 55%, 88%)`;
    ctx.fillRect(0, 0, size, size);

    // Foreground — warna gelap, pola 5×5 simetris horizontal
    ctx.fillStyle = `hsl(${hue}, 55%, 38%)`;
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 3; x++) {
        if (rand() > 0.5) {
          ctx.fillRect(x * scale, y * scale, scale, scale);
          if (x < 2) ctx.fillRect((4 - x) * scale, y * scale, scale, scale);
        }
      }
    }
  }, [address, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`rounded-full shrink-0 ${className}`}
    />
  );
}
