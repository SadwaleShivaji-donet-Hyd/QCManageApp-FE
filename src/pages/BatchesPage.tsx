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
  'Completed': { color: '#059669', bg: '#ecfdf5' },
  'Preparing': { color: '#d97706', bg: '#fffbeb' },
  'Archived': { color: '#6b7280', bg: '#f3f4f6' },
};

const ArrowIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const ChevronDown = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const SortIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
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
          .page-title { font-size: 24px !important; }
          .batch-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .batch-row { padding: 14px 14px !important; }
          .batch-id { font-size: 15px !important; }
        }
      `}</style>

      <div className="min-h-screen w-full bg-white p-8">
        <div className="batch-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h1 className="text-5xl font-bold text-gray-900">
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

        {/* <div style={{ background: '#fff', borderRadius: 14, border: '2px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No batches found.</div>
          ) : filtered.map((batch, idx) => (
            <div key={batch.id} className="batch-row"
              onClick={() => navigate(`/batches/${batch.id}`)}
              style={{ display: 'flex', alignItems: 'center', padding: '20px 28px', borderBottom: idx < filtered.length - 1 ? '2px solid #f0f0f0' : 'none', cursor: 'pointer', gap: 16, transition: 'background 0.12s', background: '#fff' }}>
              <div style={{ flex: '0 0 auto', minWidth: 120 }}>
                <span className="batch-id" style={{ fontSize: 18, fontWeight: 600, color: '#000', letterSpacing: 0 }}>{batch.id}</span>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#000', lineHeight: 1.2 }}>{batch.slides}</div>
                <div style={{ fontSize: 12, color: '#00bcd4', fontWeight: 500 }}>Slides</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#000', lineHeight: 1.2 }}>{batch.samples}</div>
                <div style={{ fontSize: 12, color: '#00bcd4', fontWeight: 500 }}>Samples</div>
              </div>
              <div style={{ minWidth: 100, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ padding: '6px 16px', borderRadius: 16, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', color: statusColors[batch.status].color, background: statusColors[batch.status].bg }}>
                  {batch.status}
                </span>
              </div>
              <button className="arrow-btn"
                onClick={e => { e.stopPropagation(); navigate(`/batches/${batch.id}`); }}
                style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e8e8e8', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#999', flexShrink: 0, transition: 'border-color 0.15s, color 0.15s' }}>
                <ArrowIcon />
              </button>
            </div>
          ))}
        </div> */}

        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-gray-400 text-sm">
                    No batches found.
                  </td>
                </tr>
              ) : (
                filtered.map((batch, index) => (
                  <tr
                    key={batch.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition bg-white cursor-pointer"
                    onClick={() => navigate(`/batches/${batch.id}`)}
                  >
                    {/* Batch ID */}
                    <td className="px-6 py-4">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {batch.id}
                      </h3>
                    </td>

                    {/* Slides */}
                    <td className="px-6 py-4 text-center">
                      <p className="text-lg text-black font-semibold">
                        {batch.slides}
                      </p>
                      <p className="text-xs text-cyan-500 font-semibold">
                        Slides
                      </p>
                    </td>

                    {/* Samples */}
                    <td className="px-6 py-4 text-center">
                      <p className="text-lg text-black font-semibold">
                        {batch.samples}
                      </p>
                      <p className="text-xs text-cyan-500 font-semibold">
                        Samples
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap ${statusColors[batch.status]
                            ? `${statusColors[batch.status].bg} ${statusColors[batch.status].color}`
                            : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {batch.status}
                      </span>
                    </td>

                    {/* Arrow */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/batches/${batch.id}`);
                        }}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-600 hover:text-gray-800"
                      >
                        <ArrowIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BatchesPage;