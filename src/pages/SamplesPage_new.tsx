import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockSamples } from "../data/mockData";

type Sample = {
    id: string;
    customer: string;
    batchId: string;
    slides: number;
    status: string;
    actionStatus: string;
    receivedDate: string;
};

const statusColorMap: Record<string, { color: string; bg: string }> = {
    "In Process": { color: '#0891b2', bg: '#ecfeff' },
    "Completed": { color: '#059669', bg: '#ecfdf5' },
    "On Hold": { color: '#d97706', bg: '#fffbeb' },
    "Ready for Fiducials": { color: '#7c3aed', bg: '#f3f4f6' },
    "Scanned": { color: '#0891b2', bg: '#ecfeff' },
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

const STATUS_OPTIONS = [
    "All Statuses",
    "In Process",
    "Completed",
    "On Hold",
    "Ready for Fiducials",
    "Scanned"
] as const;

export default function SamplesPage() {
    const [samplesData] = useState<Sample[]>(mockSamples);
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
    const [sortAsc, setSortAsc] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleRowClick = (sample: Sample) => {
        navigate(`/sample-details/${sample.id}`, { state: { sample } });
    };

    const filteredSamples = samplesData
        .filter(b => statusFilter === 'All Statuses' || b.status === statusFilter)
        .sort((a, b) => sortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));

    return (
        <>
            <style>{`
                .sample-row:hover { background: #fafafa !important; }
                .arrow-btn:hover { border-color: #6d28d9 !important; color: #6d28d9 !important; }
                .status-opt:hover { background: #f5f3ff !important; }
                .ctrl-btn:hover { border-color: #d1d5db !important; background: #f9fafb !important; }
                @media (max-width: 600px) {
                    .page-wrap { padding: 20px 14px !important; }
                    .page-title { font-size: 24px !important; }
                    .sample-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
                    .sample-row { padding: 16px 14px !important; }
                    .sample-id { font-size: 16px !important; }
                }
            `}</style>

            <div className="page-wrap" style={{ padding: '32px 40px', maxWidth: 1080, width: '100%', boxSizing: 'border-box' }}>
                <div className="sample-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <h1 className="page-title" style={{ fontSize: 32, fontWeight: 600, color: '#000', margin: 0, letterSpacing: 0 }}>
                        Samples
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
                                                onClick={() => { setStatusFilter(opt as string); setShowDropdown(false); }}
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

                <p style={{ color: '#666', fontSize: 14, marginBottom: 20, fontWeight: 400 }}>
                    {filteredSamples.length} {filteredSamples.length === 1 ? 'sample' : 'samples'}
                </p>

                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d0d0d0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    {filteredSamples.length === 0 ? (
                        <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No samples found.</div>
                    ) : filteredSamples.map((sample, idx) => (
                        <div key={sample.id} className="sample-row"
                            onClick={() => handleRowClick(sample)}
                            style={{ display: 'flex', alignItems: 'center', padding: '20px 28px', borderBottom: idx < filteredSamples.length - 1 ? '1px solid #d0d0d0' : 'none', cursor: 'pointer', gap: 16, transition: 'background 0.12s', background: '#fff' }}>
                            <div style={{ flex: '0 0 auto', minWidth: 140 }}>
                                <span className="sample-id" style={{ fontSize: 18, fontWeight: 600, color: '#000', letterSpacing: 0, display: 'block' }}>{sample.id}</span>
                                <span style={{ fontSize: 12, color: '#666', fontWeight: 400 }}>{sample.customer}</span>
                            </div>
                            <div style={{ flex: 1 }} />
                            <div style={{ textAlign: 'center', minWidth: 60 }}>
                                <div style={{ fontSize: 16, fontWeight: 600, color: '#000', lineHeight: 1.2 }}>{sample.batchId}</div>
                                <div style={{ fontSize: 12, color: '#00bcd4', fontWeight: 500 }}>Batch</div>
                            </div>
                            <div style={{ textAlign: 'center', minWidth: 60 }}>
                                <div style={{ fontSize: 16, fontWeight: 600, color: '#000', lineHeight: 1.2 }}>{sample.slides}</div>
                                <div style={{ fontSize: 12, color: '#00bcd4', fontWeight: 500 }}>Slides</div>
                            </div>
                            <div style={{ minWidth: 100, display: 'flex', justifyContent: 'flex-end' }}>
                                <span style={{ padding: '6px 16px', borderRadius: 16, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', color: statusColorMap[sample.status]?.color || '#666', background: statusColorMap[sample.status]?.bg || '#f0f0f0' }}>
                                    {sample.status}
                                </span>
                            </div>
                            <button className="arrow-btn"
                                onClick={e => { e.stopPropagation(); handleRowClick(sample); }}
                                style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e8e8e8', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#999', flexShrink: 0, transition: 'border-color 0.15s, color 0.15s' }}>
                                <ArrowIcon />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
