import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type BatchStatus = 'In Process' | 'Completed' | 'Preparing' | 'Archived';
interface Batch { id: string; slides: number; samples: number; status: BatchStatus; }

const MOCK_BATCHES: Batch[] = [
  { id: '003818853', slides: 25, samples: 3, status: 'In Process' },
  { id: '003818854', slides: 30, samples: 3, status: 'In Process' },
  { id: '003818855', slides: 32, samples: 3, status: 'In Process' },
  { id: '003818856', slides: 30, samples: 3, status: 'In Process' },
  { id: '003818857', slides: 26, samples: 3, status: 'In Process' },
  { id: '003818858', slides: 26, samples: 3, status: 'Completed' },
];

const STATUS_OPTIONS: (BatchStatus | 'All Statuses')[] = [
  'All Statuses', 'In Process', 'Completed', 'Preparing', 'Archived',
];

const statusColors: Record<BatchStatus, { color: string; bg: string }> = {
  'In Process': { color: '#0891b2', bg: '#ecfeff' },
  'Completed':  { color: '#059669', bg: '#ecfdf5' },
  'Preparing':  { color: '#d97706', bg: '#fffbeb' },
  'Archived':   { color: '#6b7280', bg: '#f3f4f6' },
};

const ArrowIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const SortIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);

const BatchesPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<BatchStatus | 'All Statuses'>('All Statuses');
  const [sortAsc, setSortAsc] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = MOCK_BATCHES
    .filter(b => statusFilter === 'All Statuses' || b.status === statusFilter)
    .sort((a, b) => sortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));

  return (
    <>
      <style>{`
        .batch-row:hover { background: #fafafa !important; }
        .arrow-btn:hover { border-color: #6d28d9 !important; color: #6d28d9 !important; }
        .status-opt:hover { background: #f5f3ff !important; }
        .ctrl-btn:hover { border-color: #d1d5db !important; background: #f9fafb !important; }
        @media (max-width: 600px) {
          .page-wrap { padding: 20px 14px !important; }
          .page-title { font-size: 26px !important; }
          .batch-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .batch-row { padding: 14px 14px !important; }
          .batch-id { font-size: 15px !important; }
        }
      `}</style>

      <div className="page-wrap" style={{ padding: '36px 40px', maxWidth: 1080, width: '100%', boxSizing: 'border-box' }}>
        <div className="batch-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h1 className="page-title" style={{ fontSize: 34, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
            Batches
          </h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <button className="ctrl-btn" onClick={() => setShowDropdown(d => !d)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#9ca3af', fontSize: 12 }}>Status:</span>
                <span>{statusFilter}</span>
                <ChevronDown />
              </button>
              {showDropdown && (
                <>
                  <div onClick={() => setShowDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                  <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 20, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 170, overflow: 'hidden' }}>
                    {STATUS_OPTIONS.map(opt => (
                      <button key={opt} className="status-opt"
                        onClick={() => { setStatusFilter(opt as BatchStatus | 'All Statuses'); setShowDropdown(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', background: statusFilter === opt ? '#f5f3ff' : 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: statusFilter === opt ? '#6d28d9' : '#374151', fontFamily: 'inherit', fontWeight: statusFilter === opt ? 600 : 400 }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button className="ctrl-btn" onClick={() => setSortAsc(s => !s)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s', whiteSpace: 'nowrap' }}>
              <SortIcon />Sort by Status
            </button>
          </div>
        </div>

        <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 18, fontWeight: 500 }}>
          {filtered.length} {filtered.length === 1 ? 'batch' : 'batches'}
        </p>

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No batches found.</div>
          ) : filtered.map((batch, idx) => (
            <div key={batch.id} className="batch-row"
              onClick={() => navigate(`/batches/${batch.id}`)}
              style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', borderBottom: idx < filtered.length - 1 ? '1px solid #f3f4f6' : 'none', cursor: 'pointer', gap: 12, transition: 'background 0.12s', background: '#fff' }}>
              <div style={{ flex: '0 0 auto', minWidth: 110 }}>
                <span className="batch-id" style={{ fontSize: 19, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>{batch.id}</span>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ textAlign: 'center', minWidth: 52 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{batch.slides}</div>
                <div style={{ fontSize: 12, color: '#0891b2', fontWeight: 500 }}>Slides</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: 58 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{batch.samples}</div>
                <div style={{ fontSize: 12, color: '#0891b2', fontWeight: 500 }}>Samples</div>
              </div>
              <div style={{ minWidth: 88, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', color: statusColors[batch.status].color, background: statusColors[batch.status].bg }}>
                  {batch.status}
                </span>
              </div>
              <button className="arrow-btn"
                onClick={e => { e.stopPropagation(); navigate(`/batches/${batch.id}`); }}
                style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', flexShrink: 0, transition: 'border-color 0.15s, color 0.15s' }}>
                <ArrowIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BatchesPage;