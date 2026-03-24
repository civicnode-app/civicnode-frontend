'use client';
import React from 'react';
import Link from 'next/link';

export default function SystemConfigPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      
      {/* --- SIDEBAR KIRI --- */}
      <aside className="sidebar" style={{ width: '280px', backgroundColor: '#DAD7CD', padding: '40px 20px', borderRight: '2px solid #588157', display: 'flex', flexDirection: 'column' }}>
        <div className="logo-section" style={{ marginBottom: '50px' }}>
          <div className="logo-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo cv.png" alt="Logo" style={{ height: '40px' }} />
            <div style={{ fontSize: '24px', fontWeight: '800', display: 'flex', gap: '4px' }}>
              <span style={{ color: '#000' }}>CIVIC</span>
              <span style={{ color: '#588157' }}>NODE</span>
            </div>
          </div>
        </div>
        
        <nav className="menu-nav" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <button className="menu-btn">DASHBOARD</button>
          </Link>
          <Link href="/system-config" style={{ textDecoration: 'none' }}>
            <button className="menu-btn active">SYSTEM CONFIG</button>
          </Link>
          <Link href="/cctv" style={{ textDecoration: 'none' }}>
            <button className="menu-btn">CCTV</button>
          </Link>
        </nav>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main style={{ flex: 1, backgroundColor: '#588157', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '22px', cursor: 'pointer', position: 'relative', lineHeight: 1 }}>
            🔔
            <div style={{ position: 'absolute', top: '0', right: '0', width: '9px', height: '9px', backgroundColor: 'red', borderRadius: '50%', border: '2px solid #588157' }}></div>
          </div>
          <div style={{ backgroundColor: '#a3b18a', padding: '6px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
            <div style={{ width: '38px', height: '38px', backgroundColor: '#eee', borderRadius: '50%', border: '2px solid #333', flexShrink: 0 }}></div>
            <div style={{ lineHeight: '1.3' }}>
              <p style={{ fontWeight: '800', margin: 0, fontSize: '14px' }}>ATUN</p>
              <p style={{ fontSize: '10px', margin: 0, opacity: 0.8 }}>OWNER</p>
            </div>
          </div>
        </header>

        {/* Config Grid — 3 kolom utama */}
        <div style={{ backgroundColor: '#CADBB7', borderRadius: '45px', padding: '36px', flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>

          {/* ── KOLOM 1: Profil & Favorit ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Profil Card */}
            <div className="cfg-card" style={{ padding: '24px' }}>
              <p className="cfg-section-label">👤 PROFILE</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '14px' }}>
                <div style={{ width: '52px', height: '52px', backgroundColor: '#DAD7CD', borderRadius: '50%', border: '3px solid #588157', flexShrink: 0 }}></div>
                <div>
                  <p style={{ margin: 0, fontWeight: '900', fontSize: '16px' }}>ATUN</p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#588157', fontWeight: '700' }}>OWNER</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#888' }}>atun@civicnode.id</p>
                </div>
              </div>
            </div>

            {/* My Favorites */}
            <div className="cfg-card" style={{ padding: '24px', flex: 1 }}>
              <p className="cfg-section-label">⭐ MY FAVORITE</p>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Siring — CCTV 1', 'Pasar Lama — CCTV 3'].map(loc => (
                  <div key={loc} style={{ backgroundColor: '#f0f5ee', borderRadius: '12px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#333' }}>{loc}</span>
                    <span style={{ fontSize: '16px', cursor: 'pointer', opacity: 0.5 }}>✕</span>
                  </div>
                ))}
                <div style={{ backgroundColor: '#e8eee5', borderRadius: '12px', padding: '10px 14px', border: '2px dashed #a3b18a', textAlign: 'center', cursor: 'pointer', color: '#a3b18a', fontWeight: '700', fontSize: '13px' }}>
                  + Add Location
                </div>
              </div>
            </div>
          </div>

          {/* ── KOLOM 2: Kamera & Deteksi ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Camera Settings */}
            <div className="cfg-card" style={{ padding: '24px' }}>
              <p className="cfg-section-label">📷 CAMERA SETTINGS</p>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Resolution',        value: '1080p HD' },
                  { label: 'Frame Rate',         value: '30 FPS' },
                  { label: 'Detection Mode',     value: 'Auto AI' },
                  { label: 'Snapshot Interval',  value: '5 sec' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e8d8', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#333' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="cfg-card" style={{ padding: '24px', flex: 1 }}>
              <p className="cfg-section-label">🔔 NOTIFICATIONS</p>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Waste Detection Alert', on: true },
                  { label: 'Node Offline Alert',    on: true },
                  { label: 'Daily Report',          on: false },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#555', fontWeight: '600' }}>{item.label}</span>
                    <div style={{ width: '36px', height: '20px', backgroundColor: item.on ? '#588157' : '#ccc', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.25s', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: '3px', left: item.on ? '18px' : '3px', width: '14px', height: '14px', backgroundColor: 'white', borderRadius: '50%', transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── KOLOM 3: Sistem & About ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Version System */}
            <div className="cfg-card" style={{ padding: '24px' }}>
              <p className="cfg-section-label">⚙️ SYSTEM INFO</p>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'App Version',     value: 'v1.0.0' },
                  { label: 'AI Model',        value: 'YOLOv8n' },
                  { label: 'Chain Network',   value: 'Polygon' },
                  { label: 'Environment',     value: 'Production' },
                  { label: 'Last Updated',    value: '09 Mar 2026' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e8d8', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>{row.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: row.value === 'v1.0.0' ? '#588157' : '#333' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain Status */}
            <div className="cfg-card" style={{ padding: '24px' }}>
              <p className="cfg-section-label">⛓️ BLOCKCHAIN</p>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', flexShrink: 0 }}></div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#333' }}>Node Connected</span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#888', fontFamily: 'monospace', wordBreak: 'break-all' }}>0x4f3a...b91c</p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#666' }}>Last TX: 1 min ago</p>
              </div>
            </div>

            {/* About */}
            <div className="cfg-card" style={{ padding: '24px', flex: 1 }}>
              <p className="cfg-section-label">ℹ️ ABOUT</p>
              <div style={{ marginTop: '14px' }}>
                <p style={{ margin: 0, fontWeight: '900', fontSize: '15px', color: '#222' }}>CivicNode AI</p>
                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#666', lineHeight: '1.6' }}>Smart environmental surveillance platform powered by Computer Vision &amp; Blockchain.</p>
                <p style={{ margin: '12px 0 0', fontSize: '11px', color: '#a3b18a', fontWeight: '700' }}>© 2026 CivicNode Team</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .cfg-card {
          background-color: white;
          border-radius: 28px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .cfg-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 24px rgba(0,0,0,0.12);
        }
        .cfg-section-label {
          margin: 0;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #a3b18a;
          text-transform: uppercase;
        }
        .menu-btn {
          width: 100%; padding: 15px 25px; border-radius: 50px; border: none;
          background-color: #a3b18a; color: white; font-weight: 800;
          text-align: left; cursor: pointer; transition: all 0.3s ease;
        }
        .menu-btn.active { background-color: #588157; }
        .menu-btn:hover { background-color: #588157; transform: translateX(10px); }
      `}} />
    </div>
  );
}