'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/stores/appStore';

type ViewMode = 'single' | 'dual' | 'triple';

type CCTVNode = {
  label: string;
  id: string;
  timestamp: string;
  camera: string;
  ip_address: string;
};

type CCTVSingleViewGroup = {
  single_view: CCTVNode[];
};

type CCTVEntry = CCTVSingleViewGroup | CCTVNode;

const VIEW_OPTIONS: { label: string; value: ViewMode; desc: string }[] = [
  { label: 'Single View', value: 'single', desc: '1x1' },
  { label: 'Dual View', value: 'dual', desc: '1x2' },
  { label: 'Triple View', value: 'triple', desc: '1x3' },
];

const CCTV_DATA: CCTVEntry[] = [
  {
    single_view: [
      {
        label: 'CCTV 1',
        id: 'cctv-001',
        timestamp: '01 Mar 2026 21.24',
        camera: 'CAM-A',
        ip_address: '192.168.x.x',
      },
      {
        label: 'CCTV 2',
        id: 'cctv-002',
        timestamp: '01 Mar 2026 21.25',
        camera: 'CAM-B',
        ip_address: '192.168.x.x',
      },
      {
        label: 'CCTV 3',
        id: 'cctv-003',
        timestamp: '01 Mar 2026 21.26',
        camera: 'CAM-C',
        ip_address: '192.168.x.x',
      },
    ],
  },
  {
    label: 'CCTV 2',
    id: 'cctv-002',
    timestamp: '01 Mar 2026 21.25',
    camera: 'CAM-B',
    ip_address: '192.168.x.x',
  },
  {
    label: 'CCTV 3',
    id: 'cctv-003',
    timestamp: '01 Mar 2026 21.26',
    camera: 'CAM-C',
    ip_address: '192.168.x.x',
  },
];

const isSingleViewGroup = (entry: CCTVEntry): entry is CCTVSingleViewGroup =>
  'single_view' in entry;

export default function CCTVPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSingleId, setSelectedSingleId] = useState('cctv-001');
  const dropRef = useRef<HTMLDivElement>(null);

  const user = useAppStore((state) => state.user);
  const initials = useMemo(
    () =>
      user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || 'U',
    [user.name],
  );

  const singleViewNodes: CCTVNode[] = useMemo(() => {
    const firstEntry = CCTV_DATA[0];
    if (!firstEntry || !isSingleViewGroup(firstEntry)) {
      return [];
    }
    return firstEntry.single_view;
  }, []);

  const selectedSingleNode =
    singleViewNodes.find((node) => node.id === selectedSingleId) ?? singleViewNodes[0];

  const visibleCount = viewMode === 'single' ? 1 : viewMode === 'dual' ? 2 : 3;
  const visibleNodes = singleViewNodes.slice(0, visibleCount);
  const currentView = VIEW_OPTIONS.find((opt) => opt.value === viewMode) ?? VIEW_OPTIONS[0];

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <aside
        style={{
          width: '280px',
          flexShrink: 0,
          backgroundColor: '#DAD7CD',
          padding: '40px 20px',
          borderRight: '2px solid #588157',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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

      <main
        style={{
          flex: 1,
          backgroundColor: '#588157',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '20px', letterSpacing: '0.05em' }}>
              CCTV MONITOR
            </span>
            <span
              style={{
                backgroundColor: '#a3b18a',
                color: 'white',
                padding: '5px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {currentView.label} - {currentView.desc}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                backgroundColor: '#a3b18a',
                padding: '6px 20px',
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '2px solid #333',
                  overflow: 'hidden',
                  backgroundColor: '#eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#333',
                  fontSize: '13px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.name} avatar`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  initials
                )}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <p style={{ fontWeight: '800', margin: 0, fontSize: '15px' }}>{user.name}</p>
                <p style={{ fontSize: '10px', margin: 0, opacity: 0.8 }}>{user.role.toUpperCase()}</p>
              </div>
            </div>

            <div ref={dropRef} style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen((prev) => !prev)} className="dots-btn">
                ⋮
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <p className="dropdown-label">LAYOUT VIEW</p>
                  {VIEW_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setViewMode(option.value);
                        setDropdownOpen(false);
                      }}
                      className={`dropdown-item${viewMode === option.value ? ' dropdown-item-active' : ''}`}
                    >
                      <span>{option.label}</span>
                      <span className="dropdown-item-desc">{option.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="monitor-shell">
          <div className={`monitor-grid monitor-grid-${viewMode}`}>
            {(viewMode === 'single' && selectedSingleNode ? [selectedSingleNode] : visibleNodes).map((node) => (
              <article key={node.id} className="monitor-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <p className="txt-bold">{node.label}</p>
                    <p className="txt-small" style={{ marginTop: '4px' }}>
                      {node.id}
                    </p>
                  </div>
                  <p className="txt-small" style={{ marginTop: '2px' }}>
                    {node.timestamp}
                  </p>
                </div>

                <div className="cctv-preview" aria-label={`${node.label} preview`}>
                  <img src="/window.svg" alt="preview" className="cctv-placeholder" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p className="txt-bold">{node.camera}</p>
                  <p className="txt-mono">{node.ip_address}</p>
                </div>
              </article>
            ))}
          </div>

          {viewMode === 'single' && (
            <div className="single-scroll-wrap">
              <p className="single-scroll-title">CCTV LIST</p>
              <div className="single-scroll-list">
                {singleViewNodes.map((node) => {
                  const active = node.id === selectedSingleId;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedSingleId(node.id)}
                      className={`single-scroll-card${active ? ' single-scroll-card-active' : ''}`}
                    >
                      <div>
                        <p className="txt-bold" style={{ fontSize: '15px' }}>
                          {node.label}
                        </p>
                        <p className="txt-small" style={{ marginTop: '2px' }}>
                          {node.id}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className="txt-small">{node.timestamp}</p>
                        <p className="txt-mono" style={{ marginTop: '2px' }}>
                          {node.ip_address}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .monitor-shell {
              background-color: #cadbb7;
              border-radius: 36px;
              padding: 20px;
              display: flex;
              flex-direction: column;
              gap: 16px;
              flex: 1;
              min-height: 0;
            }
            .monitor-grid {
              width: 100%;
              display: grid;
              gap: 16px;
              align-items: center;
              justify-items: center;
            }
            .monitor-grid-single {
              grid-template-columns: minmax(0, min(980px, 100%));
            }
            .monitor-grid-dual {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .monitor-grid-triple {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .monitor-panel {
              width: 100%;
              background-color: white;
              border-radius: 28px;
              padding: 18px;
              display: flex;
              flex-direction: column;
              gap: 14px;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            }
            .cctv-preview {
              width: 100%;
              aspect-ratio: 16 / 9;
              border-radius: 18px;
              background: linear-gradient(135deg, #e5e5e5 0%, #f1f1f1 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            .cctv-placeholder {
              width: 20%;
              min-width: 56px;
              max-width: 110px;
              height: auto;
              object-fit: contain;
              opacity: 0.35;
            }
            .single-scroll-wrap {
              background: rgba(255, 255, 255, 0.52);
              border-radius: 20px;
              padding: 14px;
              min-height: 0;
            }
            .single-scroll-title {
              margin: 0 0 10px;
              font-size: 12px;
              font-weight: 800;
              color: #2e4630;
              letter-spacing: 0.08em;
            }
            .single-scroll-list {
              max-height: 220px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              gap: 10px;
              padding-right: 4px;
            }
            .single-scroll-card {
              width: 100%;
              border: 0;
              border-radius: 14px;
              background: #ffffff;
              padding: 12px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
              cursor: pointer;
              text-align: left;
            }
            .single-scroll-card-active {
              outline: 2px solid #588157;
              box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
            }
            .dots-btn {
              font-size: 26px;
              font-weight: bold;
              cursor: pointer;
              color: white;
              background: none;
              border: none;
              line-height: 1;
              padding: 6px 10px;
              border-radius: 10px;
              transition: background 0.2s;
            }
            .dots-btn:hover {
              background: rgba(255, 255, 255, 0.18);
            }
            .dropdown-menu {
              position: absolute;
              top: calc(100% + 8px);
              right: 0;
              background: white;
              border-radius: 14px;
              box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
              overflow: hidden;
              min-width: 190px;
              z-index: 40;
            }
            .dropdown-label {
              margin: 0;
              padding: 12px 16px 8px;
              font-size: 10px;
              font-weight: 800;
              color: #999;
              letter-spacing: 0.1em;
            }
            .dropdown-item {
              width: 100%;
              padding: 11px 16px;
              border: 0;
              cursor: pointer;
              text-align: left;
              background: white;
              color: #333;
              font-weight: 600;
              font-size: 14px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .dropdown-item:hover {
              background: #f4f4f4;
            }
            .dropdown-item-active {
              background: #edf4e9;
              color: #355735;
              font-weight: 800;
            }
            .dropdown-item-desc {
              font-size: 11px;
              color: #9f9f9f;
              font-weight: 600;
            }
            .txt-bold {
              font-weight: 900;
              font-size: 17px;
              margin: 0;
              color: #000;
            }
            .txt-small {
              font-weight: 700;
              font-size: 12px;
              margin: 0;
              color: #59615a;
            }
            .txt-mono {
              font-family: monospace;
              font-size: 11px;
              font-weight: 700;
              margin: 0;
              color: #666;
              letter-spacing: 0.02em;
            }
            .menu-btn {
              width: 100%;
              padding: 15px 25px;
              border-radius: 50px;
              border: none;
              background-color: #a3b18a;
              color: white;
              font-weight: 800;
              text-align: left;
              cursor: pointer;
              transition: all 0.25s ease;
            }
            .menu-btn.active,
            .menu-btn:hover {
              background-color: #588157;
              transform: translateX(8px);
            }
            @media (max-width: 1320px) {
              .monitor-grid-triple {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }
            @media (max-width: 1080px) {
              .monitor-grid-dual,
              .monitor-grid-triple {
                grid-template-columns: 1fr;
              }
            }
          `,
        }}
      />
    </div>
  );
}
