'use client';
import React, { useState } from 'react';
import { useDashboardStore, PendingReview } from '../stores/dashboardStore';

// ─── Circular Progress Ring ────────────────────────────────────────────────
function ScoreRing({
  score,
  size = 72,
  strokeWidth = 7,
  showLabel = true,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (pct / 100) * circumference;

  // Color thresholds
  const color =
    pct >= 75 ? '#3a7d44'   // green  – high confidence
    : pct >= 50 ? '#f59e0b' // amber  – moderate
    : '#ef4444';             // red    – low / uncertain

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
        />
      </svg>
      {showLabel && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: size * 0.22, fontWeight: 900, color, lineHeight: 1 }}>
            {pct.toFixed(0)}
          </span>
          <span style={{ fontSize: size * 0.14, color: '#999', lineHeight: 1.2 }}>/100</span>
        </div>
      )}
    </div>
  );
}

// ─── Badge indicating score tier ──────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const tier =
    score >= 75 ? { label: 'HIGH', bg: '#dcfce7', color: '#15803d' }
    : score >= 50 ? { label: 'MEDIUM', bg: '#fef3c7', color: '#b45309' }
    : { label: 'LOW', bg: '#fee2e2', color: '#b91c1c' };

  return (
    <span style={{
      fontSize: '9px', fontWeight: 800, letterSpacing: '0.06em',
      padding: '2px 7px', borderRadius: '99px',
      backgroundColor: tier.bg, color: tier.color,
    }}>
      {tier.label}
    </span>
  );
}

// ─── Format waktu_kejadian ─────────────────────────────────────────────────
function formatWaktu(iso: string) {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      weekday: 'short', day: '2-digit', month: 'short',
      year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

// ─── Single review card ────────────────────────────────────────────────────
function ReviewCard({
  review,
  isActive,
  onSelect,
  onApprove,
  onReject,
}: {
  review: PendingReview;
  isActive: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isPending = review.review_status === 'pending';

  return (
    <div
      onClick={onSelect}
      style={{
        backgroundColor: isActive ? '#f0fdf4' : 'white',
        border: `2px solid ${isActive ? '#3a7d44' : '#f0f0f0'}`,
        borderRadius: '18px',
        padding: '14px 16px',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        opacity: review.review_status !== 'pending' ? 0.55 : 1,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 56, height: 56, borderRadius: '12px',
        backgroundColor: '#f5f5f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, overflow: 'hidden', border: '1px solid #e5e7eb',
      }}>
        {review.foto_url ? (
          <img src={review.foto_url} alt="capture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '20px', opacity: 0.25 }}>📷</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: '13px', color: '#222' }}>{review.location || review.cctv_id}</span>
          <ScoreBadge score={review.confidence_score} />
          {review.review_status === 'approved' && (
            <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '99px', backgroundColor: '#dcfce7', color: '#15803d' }}>✓ APPROVED</span>
          )}
          {review.review_status === 'rejected' && (
            <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '99px', backgroundColor: '#fee2e2', color: '#b91c1c' }}>✗ REJECTED</span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: '10px', color: '#888' }}>
          {formatWaktu(review.waktu_kejadian)} &nbsp;·&nbsp; {review.cctv_id.toUpperCase()}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '9px', color: '#bbb', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {review.ipfs_hash}
        </p>
      </div>

      {/* Score ring (compact) */}
      <ScoreRing score={review.confidence_score} size={54} strokeWidth={5} />

      {/* Action buttons – only for pending */}
      {isPending && (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onApprove}
            title="Konfirmasi sebagai pelanggaran"
            style={{
              padding: '5px 10px', borderRadius: '8px', border: 'none',
              backgroundColor: '#3a7d44', color: 'white',
              fontWeight: 800, fontSize: '10px', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            ✓ YA
          </button>
          <button
            onClick={onReject}
            title="Bukan pelanggaran"
            style={{
              padding: '5px 10px', borderRadius: '8px',
              border: '1.5px solid #ef4444', backgroundColor: 'white',
              color: '#ef4444',
              fontWeight: 800, fontSize: '10px', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            ✗ TIDAK
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Monitor ──────────────────────────────────────────────────────────
export default function ConfidenceScoreMonitor() {
  const { pendingReviews, activeReviewId, approveReview, rejectReview, setActiveReview } =
    useDashboardStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const active = pendingReviews.find((r) => r.id === activeReviewId) ?? pendingReviews[0];

  const filtered = pendingReviews.filter((r) => {
    if (filter === 'pending') return r.review_status === 'pending';
    if (filter === 'done') return r.review_status !== 'pending';
    return true;
  });

  const pendingCount = pendingReviews.filter((r) => r.review_status === 'pending').length;

  return (
    <section style={{
      backgroundColor: 'white',
      borderRadius: '30px',
      padding: '24px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🎯</span>
          <span style={{ fontWeight: 800, fontSize: '14px', color: '#333' }}>Confidence Score Monitor</span>
          {pendingCount > 0 && (
            <span style={{
              backgroundColor: '#f59e0b', color: 'white',
              borderRadius: '99px', fontSize: '10px',
              fontWeight: 900, padding: '1px 8px',
            }}>
              {pendingCount} pending
            </span>
          )}
        </div>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'pending', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 12px', borderRadius: '99px', border: 'none',
                fontSize: '10px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.05em',
                backgroundColor: filter === f ? '#588157' : '#f3f4f6',
                color: filter === f ? 'white' : '#555',
                transition: 'all 0.2s',
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Detail Panel ── */}
      {active && (
        <div style={{
          backgroundColor: '#f8faf8',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          border: '1.5px solid #e8f0e8',
          flexWrap: 'wrap',
        }}>
          {/* Big ring */}
          <ScoreRing score={active.confidence_score} size={110} strokeWidth={10} />

          {/* Detail text */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontWeight: 900, fontSize: '18px', color: '#222' }}>
                {active.location || active.cctv_id}
              </span>
              <ScoreBadge score={active.confidence_score} />
            </div>
            <p style={{ margin: '0 0 3px', fontSize: '12px', color: '#555' }}>
              📹 {active.cctv_id.toUpperCase()} &nbsp;·&nbsp; {formatWaktu(active.waktu_kejadian)}
            </p>
            <p style={{ margin: '0 0 10px', fontSize: '10px', color: '#bbb', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              IPFS: {active.ipfs_hash}
            </p>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#666' }}>
              AI mendeteksi kemungkinan pelanggaran dengan kepercayaan&nbsp;
              <strong style={{ color: active.confidence_score >= 75 ? '#3a7d44' : active.confidence_score >= 50 ? '#f59e0b' : '#ef4444' }}>
                {active.confidence_score.toFixed(1)}%
              </strong>.&nbsp;
              {active.confidence_score < 75
                ? 'Harap lakukan verifikasi manual.'
                : 'Tingkat kepercayaan tinggi — siap dikonfirmasi.'}
            </p>
            {active.review_status === 'pending' ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => approveReview(active.id)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                    backgroundColor: '#3a7d44', color: 'white',
                    fontWeight: 800, fontSize: '12px', cursor: 'pointer',
                  }}
                >
                  ✓ Konfirmasi Pelanggaran
                </button>
                <button
                  onClick={() => rejectReview(active.id)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px',
                    border: '2px solid #ef4444', backgroundColor: 'white',
                    color: '#ef4444',
                    fontWeight: 800, fontSize: '12px', cursor: 'pointer',
                  }}
                >
                  ✗ Bukan Pelanggaran
                </button>
              </div>
            ) : (
              <div style={{
                padding: '8px 16px', borderRadius: '12px', display: 'inline-block',
                backgroundColor: active.review_status === 'approved' ? '#dcfce7' : '#fee2e2',
                color: active.review_status === 'approved' ? '#15803d' : '#b91c1c',
                fontWeight: 800, fontSize: '13px',
              }}>
                {active.review_status === 'approved' ? '✓ Telah dikonfirmasi sebagai pelanggaran' : '✗ Ditolak — bukan pelanggaran'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Legend ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { color: '#3a7d44', label: '≥ 75 — Tinggi (Aman dikonfirmasi)' },
          { color: '#f59e0b', label: '50–74 — Sedang (Perlu review)' },
          { color: '#ef4444', label: '< 50 — Rendah (Wajib review manual)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
            <span style={{ fontSize: '10px', color: '#666' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Review List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px', scrollbarWidth: 'none' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#bbb', fontSize: '13px', padding: '20px' }}>
            Tidak ada item untuk ditampilkan.
          </div>
        ) : (
          filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isActive={activeReviewId === review.id || (!activeReviewId && review === pendingReviews[0])}
              onSelect={() => setActiveReview(review.id)}
              onApprove={() => approveReview(review.id)}
              onReject={() => rejectReview(review.id)}
            />
          ))
        )}
      </div>

    </section>
  );
}
