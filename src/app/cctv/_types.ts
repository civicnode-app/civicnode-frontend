export const BACKEND_URL    = process.env.NEXT_PUBLIC_BACKEND_URL    ?? "http://localhost:3001";
export const AI_SERVER_URL  = process.env.NEXT_PUBLIC_AI_SERVER_URL  ?? "";

export interface CCTVNode {
  id: string;
  nama: string;
  ip_address: string;
  stream_url: string;
  status: boolean;
  active_detections: number;
  confidence_score: number;
  jenis_kamera: string;
  created_at: string;
  zona: { id: string; nama: string } | null;
  latitude?: number;
  longitude?: number;
}

export interface BoundingBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
}

export interface Zona {
  id: string;
  nama: string;
  deskripsi: string;
  zone_reputation: number;
}

export type DialogState =
  | { type: "alert"; message: string }
  | { type: "confirm"; message: string; onConfirm: () => void };

export function repColor(score: number) {
  if (score >= 80) return { bg: "bg-[#f0f5ee]", text: "text-[#588157]" };
  if (score >= 60) return { bg: "bg-yellow-50",  text: "text-yellow-600" };
  if (score >= 40) return { bg: "bg-orange-50",  text: "text-orange-500" };
  return              { bg: "bg-red-50",      text: "text-red-500"    };
}

export function repLabel(score: number) {
  if (score >= 80) return "BERSIH";
  if (score >= 60) return "CUKUP";
  if (score >= 40) return "KOTOR";
  return "KRITIS";
}
