// Tipe zone untuk halaman Dashboard Triage
export interface TriageZone {
  id: string;
  name: string;
  location: string;
  score: number;
  evidence_url: string;
  last_updated: string;
}

// Tipe node kamera yang diasosiasikan ke suatu zona
export interface CameraNode {
  id: string;
  zone_id: string;
  name: string;
  ip_address: string;
  status: boolean;
  active_detections: number;
}

// Tipe statistik realtime di StatsGrid
export interface RealtimeStats {
  active_detections: number;
  armada_siaga: number;
  zone_reputation: number;
}

// ── Dummy Data ──────────────────────────────────────────────────────────────

export const DUMMY_ZONES: TriageZone[] = [
  { id: "z1", name: "Simpang Antasari", location: "Kecamatan Selatan", score: 42, evidence_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop", last_updated: "2 Menit Yg Lalu" },
  { id: "z2", name: "Pasar Sudimampur", location: "Kecamatan Barat",   score: 28, evidence_url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&h=300&fit=crop", last_updated: "1 Menit Yg Lalu" },
  { id: "z3", name: "Taman Kamboja",    location: "Kecamatan Tengah",  score: 85, evidence_url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop", last_updated: "10 Menit Yg Lalu" },
  { id: "z4", name: "Jalan Veteran",    location: "Kecamatan Timur",   score: 62, evidence_url: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400&h=300&fit=crop", last_updated: "5 Menit Yg Lalu" },
];

export const DUMMY_CAMERAS: CameraNode[] = [
  { id: "c1", zone_id: "z1", name: "CCTV Antasari 01",   ip_address: "192.168.1.10", status: true,  active_detections: 4 },
  { id: "c2", zone_id: "z1", name: "CCTV Antasari 02",   ip_address: "192.168.1.11", status: true,  active_detections: 1 },
  { id: "c3", zone_id: "z2", name: "Node Sudimampur T",  ip_address: "192.168.1.12", status: false, active_detections: 0 },
  { id: "c4", zone_id: "z2", name: "CCTV Pasar Malam",   ip_address: "192.168.1.16", status: true,  active_detections: 7 },
  { id: "c5", zone_id: "z3", name: "Node Kamboja 01",    ip_address: "192.168.1.13", status: true,  active_detections: 0 },
  { id: "c6", zone_id: "z3", name: "Node Kamboja 02",    ip_address: "192.168.1.15", status: true,  active_detections: 0 },
  { id: "c7", zone_id: "z4", name: "CCTV Veteran 01",    ip_address: "192.168.1.14", status: true,  active_detections: 5 },
];

// ── Utility helpers ──────────────────────────────────────────────────────────

export function getAccentColor(score: number): string {
  if (score < 50) return "#ef4444";
  if (score < 80) return "#f59e0b";
  return "#22c55e";
}

export function scoreGrade(val: number): { label: string; color: string } {
  if (val >= 90) return { label: "A", color: "#22c55e" };
  if (val >= 75) return { label: "B", color: "#84cc16" };
  if (val >= 60) return { label: "C", color: "#eab308" };
  if (val >= 40) return { label: "D", color: "#f97316" };
  return { label: "F", color: "#ef4444" };
}

export function detectionLevel(val: number): { label: string; color: string } {
  if (val === 0) return { label: "CLEAR",  color: "#22c55e" };
  if (val <= 3)  return { label: "LOW",    color: "#84cc16" };
  if (val <= 7)  return { label: "MEDIUM", color: "#eab308" };
  return           { label: "HIGH",   color: "#ef4444" };
}
