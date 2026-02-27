import { useState, useEffect as _useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSlides as _getSlides } from "../types/api";
import type { Slide as _ApiSlide } from '../types';

/*
================================================================================
IMPORTANT: API Integration Instructions
================================================================================
Currently using HARDCODED data for development/testing.
When API with authentication token is ready, follow these 4 STEPS:

STEP 1: Fix imports (Lines 1-4)
  Change from:
    import { useState, useEffect as _useEffect } from 'react';
    import { getSlides as _getSlides } from '../services/api';
    import type { Slide as _ApiSlide } from '../types';
  
  To:
    import { useState, useEffect } from 'react';
    import { getSlides } from '../services/api';
    import type { Slide as ApiSlide } from '../types';

STEP 2: Delete ALL_SLIDES constant (Around line 58-100)
  - Remove or comment out the entire ALL_SLIDES array

STEP 3: Update slides state initialization (Around line 168)
  Change from:
    const [slides, _setSlides] = useState<Slide[]>(ALL_SLIDES);
  To:
    const [slides, setSlides] = useState<Slide[]>([]);

STEP 4: Uncomment useEffect block (Around line 170-195)
  - Remove the forward slash and asterisk comments around the useEffect hook
  - Change _useEffect to useEffect
  - Change _getSlides to getSlides
  - Change _ApiSlide to ApiSlide
  - Change _setSlides to setSlides (in the hook body)

AFTER completing all steps:
  * The app will fetch slides from http://localhost:3000/slides
  * No more hardcoded data
  * Slides will update based on API response
================================================================================
*/

type SlideStatus =
  | 'Waiting for 40x'
  | 'Ready for Fiducials'
  | '5x Alignment Scan'
  | 'Completed'
  | 'Excluded'
  | 'In Process'
  | 'DigitalAssetsReady'
  | 'Batched';

interface Slide {
  id: string;
  sampleId: string;
  status: SlideStatus;
  hasWarning?: boolean;
}

const PAGE_SIZE = 25;

// STEP 4 (API Integration): DELETE or COMMENT OUT this entire ALL_SLIDES array
// Hardcoded response from API: http://localhost:3000/slides
// This is temporary data for testing - will be replaced by API call
const ALL_SLIDES: Slide[] = [
  { id: 'SLD-001', sampleId: 'SAMPLE-001', status: 'DigitalAssetsReady' },
  { id: 'SLD-002', sampleId: 'SAMPLE-001', status: 'DigitalAssetsReady' },
  { id: 'SLD-005', sampleId: 'SAMPLE-010', status: 'Batched' },
  { id: 'SLD-006', sampleId: 'SAMPLE-010', status: 'DigitalAssetsReady' },
  { id: 'SLD-007', sampleId: 'SAMPLE-011', status: 'Batched' },
  { id: 'SLD-008', sampleId: 'SAMPLE-011', status: 'DigitalAssetsReady' },
  { id: 'SLD-009', sampleId: 'SAMPLE-012', status: 'Ready for Fiducials' },
  { id: 'SLD-010', sampleId: 'SAMPLE-012', status: 'Waiting for 40x' },
  { id: 'SLD-011', sampleId: 'SAMPLE-013', status: 'Completed' },
  { id: 'SLD-012', sampleId: 'SAMPLE-013', status: 'Excluded' },
  { id: 'SLD-013', sampleId: 'SAMPLE-014', status: '5x Alignment Scan' },
  { id: 'SLD-014', sampleId: 'SAMPLE-014', status: 'In Process' },
  { id: 'SLD-015', sampleId: 'SAMPLE-015', status: 'DigitalAssetsReady' },
  { id: 'SLD-016', sampleId: 'SAMPLE-015', status: 'Batched' },
  { id: 'SLD-017', sampleId: 'SAMPLE-016', status: 'Ready for Fiducials' },
  { id: 'SLD-018', sampleId: 'SAMPLE-016', status: 'Waiting for 40x' },
  { id: 'SLD-019', sampleId: 'SAMPLE-017', status: 'Completed' },
  { id: 'SLD-020', sampleId: 'SAMPLE-017', status: 'Excluded' },
  { id: 'SLD-021', sampleId: 'SAMPLE-018', status: '5x Alignment Scan' },
  { id: 'SLD-022', sampleId: 'SAMPLE-018', status: 'In Process' },
  { id: 'SLD-023', sampleId: 'SAMPLE-019', status: 'DigitalAssetsReady' },
  { id: 'SLD-024', sampleId: 'SAMPLE-019', status: 'Batched' },
  { id: 'SLD-025', sampleId: 'SAMPLE-020', status: 'Ready for Fiducials' },
  { id: 'SLD-026', sampleId: 'SAMPLE-020', status: 'Waiting for 40x' },
  { id: 'SLD-027', sampleId: 'SAMPLE-021', status: 'Completed' },
  { id: 'SLD-028', sampleId: 'SAMPLE-021', status: 'Excluded' },
  { id: 'SLD-029', sampleId: 'SAMPLE-022', status: '5x Alignment Scan' },
  { id: 'SLD-030', sampleId: 'SAMPLE-022', status: 'In Process' },
  { id: 'SLD-031', sampleId: 'SAMPLE-023', status: 'DigitalAssetsReady' },
  { id: 'SLD-032', sampleId: 'SAMPLE-023', status: 'Batched' },
  { id: 'SLD-033', sampleId: 'SAMPLE-024', status: 'Ready for Fiducials' },
  { id: 'SLD-034', sampleId: 'SAMPLE-024', status: 'Waiting for 40x' },
  { id: 'SLD-035', sampleId: 'SAMPLE-025', status: 'Completed' },
  { id: 'SLD-036', sampleId: 'SAMPLE-025', status: 'Excluded' },
  { id: 'SLD-037', sampleId: 'SAMPLE-026', status: '5x Alignment Scan' },
  { id: 'SLD-038', sampleId: 'SAMPLE-026', status: 'In Process' },
  { id: 'SLD-039', sampleId: 'SAMPLE-027', status: 'DigitalAssetsReady' },
  { id: 'SLD-040', sampleId: 'SAMPLE-027', status: 'Batched' },
  { id: 'SLD-041', sampleId: 'SAMPLE-028', status: 'Ready for Fiducials' },
  { id: 'SLD-042', sampleId: 'SAMPLE-028', status: 'Waiting for 40x' },
  { id: 'SLD-043', sampleId: 'SAMPLE-029', status: 'Completed' },
  { id: 'SLD-044', sampleId: 'SAMPLE-029', status: 'Excluded' },
  { id: 'SLD-045', sampleId: 'SAMPLE-030', status: '5x Alignment Scan' },
  { id: 'SLD-046', sampleId: 'SAMPLE-030', status: 'In Process' },
  { id: 'SLD-047', sampleId: 'SAMPLE-031', status: 'DigitalAssetsReady' },
  { id: 'SLD-048', sampleId: 'SAMPLE-031', status: 'Batched' },
  { id: 'SLD-049', sampleId: 'SAMPLE-032', status: 'Ready for Fiducials' },
  { id: 'SLD-050', sampleId: 'SAMPLE-032', status: 'Waiting for 40x' },
  { id: 'SLD-051', sampleId: 'SAMPLE-033', status: 'Completed' },
  { id: 'SLD-052', sampleId: 'SAMPLE-034', status: 'Completed' },
  { id: 'SLD-053', sampleId: 'SAMPLE-035', status: 'Completed' },
  { id: 'SLD-054', sampleId: 'SAMPLE-036', status: 'Completed' },
];

const STATUS_OPTIONS: ('All Statuses' | SlideStatus)[] = [
  'All Statuses',
  'Waiting for 40x',
  'Ready for Fiducials',
  '5x Alignment Scan',
  'Completed',
  'Excluded',
  'In Process',
  'DigitalAssetsReady',
  'Batched',
];

const statusColors: Record<SlideStatus, { color: string; bg: string; border?: string }> = {
  'Waiting for 40x':     { color: '#7c3aed', bg: 'transparent', border: 'none' },
  'Ready for Fiducials': { color: '#374151', bg: '#f3f4f6',     border: 'none' },
  '5x Alignment Scan':   { color: '#0891b2', bg: 'transparent', border: 'none' },
  'Completed':           { color: '#059669', bg: '#ecfdf5',     border: 'none' },
  'Excluded':            { color: '#dc2626', bg: '#fef2f2',     border: 'none' },
  'In Process':          { color: '#d97706', bg: '#fffbeb',     border: 'none' },
  'DigitalAssetsReady':  { color: '#0891b2', bg: '#ecf0ff',     border: 'none' },
  'Batched':             { color: '#059669', bg: '#ecfdf5',     border: 'none' },
};

// ── Icons ──────────────────────────────────────────────────
const ArrowIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const WarningIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const SortIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);

const SlidesPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'All Statuses' | SlideStatus>('All Statuses');
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  
  // STEP 2 (API Integration): Change from ALL_SLIDES to empty array []
  // Currently: useState<Slide[]>(ALL_SLIDES)
  // When API ready: useState<Slide[]>([])
  const [slides, _setSlides] = useState<Slide[]>(ALL_SLIDES);

  // STEP 3 (API Integration): UNCOMMENT this entire block when API is ready
  // Also replace all _useEffect with useEffect, _getSlides with getSlides, _ApiSlide with ApiSlide
  // AND change _setSlides back to setSlides (remove the underscore)
  /*
  _useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await _getSlides() as _ApiSlide[];
        const transformedSlides: Slide[] = data.map(slide => ({
          id: slide.slide_id,
          sampleId: slide.sample_id,
          status: slide.current_state as SlideStatus,
        }));
        setSlides(transformedSlides);
      } catch (error) {
        console.error('Failed to fetch slides:', error);
        setSlides(ALL_SLIDES);
      }
    };

    fetchSlides();
  }, []);
  */
  // END STEP 3: Close the commented useEffect block here

  const filtered = slides
    .filter(s => statusFilter === 'All Statuses' || s.status === statusFilter)
    .sort((a, b) => sortAsc
      ? a.status.localeCompare(b.status)
      : b.status.localeCompare(a.status)
    );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const remaining = Math.min(PAGE_SIZE, filtered.length - visibleCount);

  return (
    <>
      <style>{`
        .slide-row:hover { background: #fafafa !important; }
        .arrow-btn:hover { border-color: #6d28d9 !important; color: #6d28d9 !important; }
        .status-opt:hover { background: #f5f3ff !important; }
        .ctrl-btn:hover { border-color: #d1d5db !important; background: #f9fafb !important; }
        .load-btn:hover { background: #5b21b6 !important; }
        @media (max-width: 640px) {
          .slides-page  { padding: 20px 14px !important; }
          .slides-title { font-size: 26px !important; }
          .slides-hdr   { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .slides-ctrls { width: 100% !important; }
          .slide-row    { padding: 12px 14px !important; }
          .slide-id     { font-size: 14px !important; }
          .slide-sid    { font-size: 12px !important; }
          .slide-status { font-size: 11px !important; }
        }
      `}</style>

      <div
        className="slides-page"
        style={{
          padding: '36px 40px',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div
          className="slides-hdr"
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16, flexWrap: 'wrap', gap: 12,
          }}
        >
          <h1
            className="slides-title"
            style={{ fontSize: 34, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}
          >
            Slides
          </h1>

          <div className="slides-ctrls" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>

            {/* Status dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                className="ctrl-btn"
                onClick={() => setShowDropdown(d => !d)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 10,
                  border: '1.5px solid #e5e7eb', background: '#fff',
                  fontSize: 13, fontWeight: 500, color: '#374151',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'border-color 0.15s', whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: '#9ca3af', fontSize: 12 }}>Status:</span>
                <span>{statusFilter}</span>
                <ChevronDown />
              </button>

              {showDropdown && (
                <>
                  <div onClick={() => setShowDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 20,
                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 190, overflow: 'hidden',
                  }}>
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        className="status-opt"
                        onClick={() => {
                          setStatusFilter(opt);
                          setShowDropdown(false);
                          setVisibleCount(PAGE_SIZE);
                        }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '9px 16px',
                          background: statusFilter === opt ? '#f5f3ff' : 'none',
                          border: 'none', cursor: 'pointer', fontSize: 13,
                          color: statusFilter === opt ? '#6d28d9' : '#374151',
                          fontFamily: 'inherit',
                          fontWeight: statusFilter === opt ? 600 : 400,
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sort by Status — solid purple like screenshot */}
            <button
              onClick={() => setSortAsc(s => !s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                background: '#fff', fontSize: 13, fontWeight: 500, color: '#374151',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s',
                whiteSpace: 'nowrap'
              }}>
              <SortIcon />
              Sort by Status
            </button>
          </div>
        </div>

        {/* Count */}
        <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 16, fontWeight: 500 }}>
          {filtered.length} slides
        </p>

        {/* ── List card ── */}
        <div style={{
          background: '#fff', borderRadius: 14,
          border: '1px solid #e5e7eb', overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          marginBottom: 28,
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
              No slides found.
            </div>
          ) : (
            visible.map((slide, idx) => (
              <div
                key={slide.id}
                className="slide-row"
                onClick={() => navigate(`/slides/${slide.id}`)}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '15px 20px',
                  borderBottom: idx < visible.length - 1 ? '1px solid #f3f4f6' : 'none',
                  cursor: 'pointer', gap: 12,
                  transition: 'background 0.12s', background: '#fff',
                }}
              >
                {/* Slide ID + warning */}
                <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span className="slide-id" style={{
                    fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.2px',
                  }}>
                    {slide.id}
                  </span>
                  {slide.hasWarning && <WarningIcon />}
                </div>

                {/* Sample ID */}
                <div style={{ flex: '0 0 auto', textAlign: 'right', minWidth: 100 }}>
                  <div className="slide-sid" style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                    {slide.sampleId}
                  </div>
                  <div style={{ fontSize: 12, color: '#0891b2', fontWeight: 500 }}>Sample</div>
                </div>

                {/* Status */}
                <div style={{ flex: '0 0 auto', minWidth: 130, display: 'flex', justifyContent: 'flex-end' }}>
                  <span
                    className="slide-status"
                    style={{
                      fontSize: 13, fontWeight: 500,
                      color: statusColors[slide.status].color,
                      background: statusColors[slide.status].bg,
                      padding: statusColors[slide.status].bg !== 'transparent' ? '3px 10px' : '0',
                      borderRadius: 6,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {slide.status}
                  </span>
                </div>

                {/* Arrow */}
                <button
                  className="arrow-btn"
                  onClick={e => { e.stopPropagation(); navigate(`/slides/${slide.id}`); }}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: '1.5px solid #e5e7eb', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#6b7280', flexShrink: 0,
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                >
                  <ArrowIcon />
                </button>
              </div>
            ))
          )}
        </div>

        {/* ── Load more + count ── */}
        {filtered.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {hasMore && (
              <div style={{
                display: 'flex', borderRadius: 10, overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(109,40,217,0.25)',
              }}>
                <button
                  className="load-btn"
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  style={{
                    padding: '10px 22px',
                    background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                    border: 'none', color: '#fff',
                    fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background 0.15s',
                    borderRight: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  Load {remaining} more slides
                </button>
                <button
                  style={{
                    padding: '10px 12px',
                    background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                    border: 'none', color: '#fff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                  }}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              </div>
            )}
            <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>
              Showing {visible.length} of {filtered.length}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default SlidesPage;