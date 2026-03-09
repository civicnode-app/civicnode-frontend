'use client';
import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      {/* --- SIDEBAR KIRI --- */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-group">
            <img src="/logo cv.png" alt="Logo" className="logo-icon" style={{ height: '40px' }} />
            <div className="logo-text">
              <span className="text-black">CIVIC</span>
              <span className="text-green">NODE</span>
            </div>
          </div>
        </div>
        <nav className="menu-nav">
          <Link href="/dashboard">
            <button className="menu-btn active">DASHBOARD</button>
          </Link>
          <Link href="/system-config">
            <button className="menu-btn">SYSTEM CONFIG</button>
          </Link>
          <Link href="/cctv">
            <button className="menu-btn">CCTV</button>
          </Link>
        </nav>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main style={{ flex: 1, backgroundColor: '#588157', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header — search kiri, profil+notif kanan, sejajar vertikal */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div className="dash-search">
            <span style={{ fontSize: '16px', opacity: 0.85 }}>🔍</span>
            <input type="text" placeholder="SEARCH" style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontWeight: '700', fontSize: '14px' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Bell */}
            <div style={{ fontSize: '22px', cursor: 'pointer', position: 'relative', lineHeight: 1 }}>
              🔔
              <div style={{ position: 'absolute', top: '0', right: '0', width: '9px', height: '9px', backgroundColor: 'red', borderRadius: '50%', border: '2px solid #588157' }}></div>
            </div>
            {/* Profile */}
            <div style={{ backgroundColor: '#a3b18a', padding: '6px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
              <div style={{ width: '38px', height: '38px', backgroundColor: '#eee', borderRadius: '50%', border: '2px solid #333', flexShrink: 0 }}></div>
              <div style={{ lineHeight: '1.3' }}>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '14px' }}>ATUN</p>
                <p style={{ margin: 0, fontSize: '10px', opacity: 0.8 }}>OWNER</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid — 4 kolom seragam */}
        <section className="dash-stats">
          {[
            { label: 'ACTIVE DETECTIONS', value: '—' },
            { label: 'WASTE REDUCTION',   value: '—' },
            { label: 'NODE REPUTATION',   value: '—' },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px 24px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '116px', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#888', letterSpacing: '0.06em' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: '#222' }}>{s.value}</p>
            </div>
          ))}
        </section>

        {/* Content Row — feed + log, tinggi sejajar */}
        <section className="dash-content">

          {/* Time-lapse Feed */}
          <div className="dash-feed" style={{ backgroundColor: 'white', borderRadius: '30px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'red', fontSize: '18px' }}>📡</span>
                <span style={{ color: 'red', fontWeight: '700', fontSize: '14px' }}>Time-lapse Feed</span>
              </div>
              <span style={{ fontWeight: '800', color: '#333', fontSize: '14px' }}>CCTV_1</span>
            </div>

            {/* Preview placeholder */}
            <div style={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}>
              <span style={{ fontSize: '48px', opacity: 0.2 }}>📷</span>
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid #eee' }}>
              <p style={{ margin: 0, fontWeight: '800', fontSize: '16px', color: '#333' }}>Siring</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.6, color: '#333' }}>Minggu, 01 Maret 2026 21.24</p>
            </div>
          </div>

          {/* Timeline Log */}
          <div style={{ flex: 1, backgroundColor: '#CADBB7', borderRadius: '30px', padding: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '11px', height: '11px', backgroundColor: '#333', borderRadius: '50%', flexShrink: 0 }}></div>
              <span style={{ fontWeight: '800', fontSize: '13px', letterSpacing: '0.05em' }}>TIMELINE LOG</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px', scrollbarWidth: 'none' }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="log-item" style={{ backgroundColor: '#a3b18a', padding: '14px 16px', borderRadius: '18px', color: 'white', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>Siring</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', opacity: 0.8 }}>Minggu, 01 Maret 2026 21.2{item}</p>
                  <p style={{ margin: '6px 0 0', color: '#fca5a5', fontWeight: '900', fontSize: '13px' }}>Rp 15.000</p>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-wrapper { display: flex; min-height: 100vh; }
        .sidebar { width: 280px; background-color: #DAD7CD; padding: 40px 20px; border-right: 2px solid #588157; display: flex; flex-direction: column; flex-shrink: 0; }
        .logo-section { margin-bottom: 50px; }
        .logo-group { display: flex; align-items: center; gap: 12px; }
        .logo-icon { height: 40px; }
        .logo-text { font-size: 24px; font-weight: 800; display: flex; gap: 4px; }
        .text-black { color: #000; }
        .text-green { color: #588157; }
        .menu-nav { display: flex; flex-direction: column; gap: 15px; margin-top: 0; }
        .menu-btn {
          width: 100%; padding: 15px 25px; border-radius: 50px; border: none;
          background-color: #a3b18a; color: white; font-weight: 800;
          font-size: 15px; text-align: left; cursor: pointer; transition: all 0.3s ease;
        }
        .menu-btn.active, .menu-btn:hover { background-color: #588157; transform: translateX(10px); }
        .log-item {
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); cursor: pointer;
        }
        .log-item:hover {
          transform: scale(1.03);
          background-color: #588157 !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        }
      `}} />
    </div>
  );
}