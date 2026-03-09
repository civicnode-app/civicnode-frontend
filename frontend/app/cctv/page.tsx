'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type ViewMode = 'single' | 'dual' | 'triple';

const VIEW_OPTIONS: { label: string; value: ViewMode; desc: string }[] = [
  { label: 'Single View', value: 'single', desc: '1×1' },
  { label: 'Dual View',   value: 'dual',   desc: '1×2' },
  { label: 'Triple View', value: 'triple', desc: '1×3' },
];

const CCTV_DATA = [
  { label: 'CCTV 1', id: 'cctv-001', timestamp: '01 Mar 2026  21.24', camera: 'CAM-A', hash: '0xA3F...91B' },
  { label: 'CCTV 2', id: 'cctv-002', timestamp: '01 Mar 2026  21.25', camera: 'CAM-B', hash: '0xB7E...22D' },
  { label: 'CCTV 3', id: 'cctv-003', timestamp: '01 Mar 2026  21.26', camera: 'CAM-C', hash: '0xC1D...55F' },
];

export default function CCTVPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dual');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visibleCount = viewMode === 'single' ? 1 : viewMode === 'dual' ? 2 : 3;
  const visibleNodes  = CCTV_DATA.slice(0, visibleCount);
  const currentView   = VIEW_OPTIONS.find(v => v.value === viewMode)!;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      
      {/* --- SIDEBAR --- */}
      <aside style={{ width: '280px', flexShrink: 0, backgroundColor: '#DAD7CD', padding: '40px 20px', borderRight: '2px solid #588157', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '50px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo cv.png" alt="Logo" style={{ height: '40px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', display: 'flex', gap: '4px' }}>
            <span style={{ color: '#000' }}>CIVIC</span>
            <span style={{ color: '#588157' }}>NODE</span>
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <button className="menu-btn">DASHBOARD</button>
          </Link>
          <Link href="/system-config" style={{ textDecoration: 'none' }}>
            <button className="menu-btn">SYSTEM CONFIG</button>
          </Link>
          <Link href="/cctv" style={{ textDecoration: 'none' }}>
            <button className="menu-btn active">CCTV</button>
          </Link>
        </nav>
      </aside>

      {/* --- MAIN --- */}
      <main style={{ flex: 1, backgroundColor: '#588157', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header — kiri: title+badge | kanan: profile+dropdown */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '20px', letterSpacing: '0.05em' }}>CCTV MONITOR</span>
            <span style={{ backgroundColor: '#a3b18a', color: 'white', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
              {currentView.label} · {currentView.desc}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Profile pill */}
            <div style={{ backgroundColor: '#a3b18a', padding: '6px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '50%', border: '2px solid #333', flexShrink: 0 }}></div>
              <div style={{ lineHeight: '1.2' }}>
                <p style={{ fontWeight: '800', margin: 0, fontSize: '15px' }}>ATUN</p>
                <p style={{ fontSize: '10px', margin: 0, opacity: 0.8 }}>OWNER</p>
              </div>
            </div>

            {/* ⋮ Dropdown */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen(o => !o)} className="dots-btn">⋮</button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <p className="dropdown-label">LAYOUT VIEW</p>
                  {VIEW_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setViewMode(opt.value); setDropdownOpen(false); }}
                      className={`dropdown-item${viewMode === opt.value ? ' dropdown-item-active' : ''}`}
                    >
                      <span>{opt.label}</span>
                      <span className="dropdown-item-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CCTV Grid — jumlah kartu berubah dinamis */}
        <div style={{
          backgroundColor: '#CADBB7',
          borderRadius: '45px',
          padding: '28px',
          display: 'flex',
          gap: '20px',
          flex: 1,
          alignItems: 'stretch',
          transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        }}>
          {visibleNodes.map((node) => (
            <div key={node.id} className="cctv-card" style={{ flex: 1, minWidth: 0 }}>
              {/* Card top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p className="txt-bold">{node.label}</p>
                  <p className="txt-small" style={{ marginTop: '4px' }}>{node.id}</p>
                </div>
                <p className="txt-small">{node.timestamp}</p>
              </div>

              {/* Preview area */}
              <div style={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: '24px', margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '40px', opacity: 0.25 }}>📷</span>
              </div>

              {/* Card bottom */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p className="txt-bold">{node.camera}</p>
                <p style={{ fontWeight: '700', fontSize: '11px', margin: 0, color: '#666', fontFamily: 'monospace', letterSpacing: '0.03em' }}>{node.hash}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeDropdown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .dots-btn {
          font-size: 26px; font-weight: bold; cursor: pointer; color: white;
          background: none; border: none; line-height: 1;
          padding: 6px 10px; border-radius: 10px; transition: background 0.2s;
        }
        .dots-btn:hover { background: rgba(255,255,255,0.18); }
        .dropdown-menu {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: white; border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          overflow: hidden; min-width: 190px; z-index: 100;
          animation: fadeDropdown 0.15s ease-out;
        }
        .dropdown-label {
          margin: 0; padding: 12px 16px 8px;
          font-size: 10px; font-weight: 800; color: #aaa;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .dropdown-item {
          width: 100%; padding: 11px 16px; border: none; cursor: pointer;
          text-align: left; background: white; color: #333;
          font-weight: 600; font-size: 14px;
          display: flex; justify-content: space-between; align-items: center;
          transition: background 0.15s;
        }
        .dropdown-item:hover { background: #f5f5f5; }
        .dropdown-item-active { background: #f0f5ee !important; color: #588157 !important; font-weight: 800 !important; }
        .dropdown-item-desc { font-size: 11px; color: #bbb; font-weight: 600; }
        .dropdown-item-active .dropdown-item-desc { color: #a3b18a; }
        .cctv-card {
          background-color: white; border-radius: 36px; padding: 28px;
          display: flex; flex-direction: column;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); cursor: pointer;
        }
        .cctv-card:hover { transform: scale(1.025); box-shadow: 0 12px 32px rgba(0,0,0,0.14); }
        .txt-bold { font-weight: 900; font-size: 18px; margin: 0; color: #000; }
        .txt-small { font-weight: 800; font-size: 12px; margin: 0; color: #555; }
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