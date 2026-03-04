import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// ═════════════════════════════════════════════════════════════════════════════
// API INTEGRATION: When backend is ready do these 3 things:
//
// 1. UNCOMMENT the two lines below
// 2. DELETE the local SlideEvent interface (marked below)
// 3. Inside useEffect: UNCOMMENT try/catch block, COMMENT OUT the 2 mock lines
// ═════════════════════════════════════════════════════════════════════════════
// import { getSlideEvents } from '../services/api';
// import type { SlideEvent } from '../services/api';
// ═════════════════════════════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────────────────────────────
interface SlideFile {
  id: string;
  name: string;
  type: 'image' | 'json' | 'svs' | 'other';
  url?: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// API INTEGRATION: DELETE this entire interface when backend is ready
// (it will be imported from '../services/api' instead)
// ═════════════════════════════════════════════════════════════════════════════
interface SlideEvent {
  event_id: string;
  event_type: string;
  slide_id: string;
  batch_id: string | null;
  sample_id: string;
  previous_state: string | null;
  new_state: string | null;
  triggered_by: string;
  timestamp: string;
  correlation_id: string;
  error_category: string | null;
  error_detail: string | null;
  metadata: Record<string, unknown> | null;
}
// ═════════════════════════════════════════════════════════════════════════════

// ── Derive state/sample/files from events ─────────────────────────────────────
const deriveStateFromEvents = (events: SlideEvent[]): string => {
  const withState = [...events]
    .filter(e => e.new_state !== null)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return withState[0]?.new_state ?? 'SlidesReceived';
};

const deriveSampleId = (events: SlideEvent[]): string =>
  events[0]?.sample_id ?? 'Unknown';


// ═════════════════════════════════════════════════════════════════════════════
// API INTEGRATION: DELETE the entire MOCK_EVENTS array when backend is ready
// ═════════════════════════════════════════════════════════════════════════════
const MOCK_EVENTS: SlideEvent[] = [
  {
    event_id: 'b36bfd56-67a1-4c2a-9be9-42e1686d5265',
    event_type: 'SlideRegistered',
    slide_id: 'SLD-001',
    batch_id: null, sample_id: 'SAMPLE-001',
    previous_state: null, new_state: 'SlidesReceived',
    triggered_by: 'anonymous',
    timestamp: '2026-02-25 13:03:49.198+00',
    correlation_id: '63cc70d2-49a9-4800-951e-9b894f16571a',
    error_category: null, error_detail: null, metadata: null,
  },
  {
    event_id: '404c77a9-6756-43a2-8c97-6ada58ed1b0c',
    event_type: 'DigitalFileAvailable',
    slide_id: 'SLD-001',
    batch_id: null, sample_id: 'SAMPLE-001',
    previous_state: null, new_state: null,
    triggered_by: 'scan-source-agent',
    timestamp: '2026-02-25 13:03:58.518+00',
    correlation_id: '11ea88f9-7ec0-4ada-8029-6724a603789d',
    error_category: null, error_detail: null,
    metadata: { file_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/H%26E_stain_of_colonic_mucosa.jpg/640px-H%26E_stain_of_colonic_mucosa.jpg', file_type: 'FORTY_X', original_filename: 'SLD-001.svs' },
  },
  {
    event_id: '12504f3b-21ca-48a3-a431-47ecd7a615ae',
    event_type: 'DigitalFileAvailable',
    slide_id: 'SLD-001',
    batch_id: null, sample_id: 'SAMPLE-001',
    previous_state: null, new_state: null,
    triggered_by: 'scan-source-agent',
    timestamp: '2026-02-25 13:03:58.533+00',
    correlation_id: '0bf78fda-99ec-4a67-8607-a21105e4fb7c',
    error_category: null, error_detail: null,
    metadata: { file_path: '/data/storage/SLD-001_annotation.xml', file_type: 'ANNOTATION_RAW', original_filename: 'SLD-001_annotation.xml' },
  },
  {
    event_id: 'fbcca8d0-519b-4cd0-b112-a01a892b1a8e',
    event_type: 'NormalizationComplete',
    slide_id: 'SLD-001',
    batch_id: null, sample_id: 'SAMPLE-001',
    previous_state: null, new_state: null,
    triggered_by: 'scan-source-agent',
    timestamp: '2026-02-25 13:03:58.573+00',
    correlation_id: 'd8bbe0d3-1209-4951-b3c0-7114cef04b0c',
    error_category: null, error_detail: null,
    metadata: { source_path: '/data/storage/SLD-001_annotation.xml', normalized_path: '/data/storage/SLD-001_annotation.qc.json' },
  },
  {
    event_id: '81d03826-b429-4009-928b-a57f558c4b60',
    event_type: 'DigitalFileAvailable',
    slide_id: 'SLD-001',
    batch_id: null, sample_id: 'SAMPLE-001',
    previous_state: null, new_state: null,
    triggered_by: 'scan-source-agent',
    timestamp: '2026-02-25 13:03:58.583+00',
    correlation_id: '797120ee-8046-44ff-85d6-152d605814a8',
    error_category: null, error_detail: null,
    metadata: { file_path: '/data/storage/SLD-001_annotation.qc.json', file_type: 'ANNOTATION_NORMALIZED' },
  },
  {
    event_id: 'c0f80656-d702-46ce-9ea8-3bb88cf2970c',
    event_type: 'DigitalAssetsReady',
    slide_id: 'SLD-001',
    batch_id: null, sample_id: 'SAMPLE-001',
    previous_state: 'SlidesReceived', new_state: 'DigitalAssetsReady',
    triggered_by: 'scan-source-agent',
    timestamp: '2026-02-25 13:03:58.596+00',
    correlation_id: '4c297abe-507c-44bb-b598-ec0faa4c2048',
    error_category: null, error_detail: null,
    metadata: { files: { FORTY_X: '/data/storage/SLD-001.svs', ANNOTATION_NORMALIZED: '/data/storage/SLD-001_annotation.qc.json' } },
  },
];
// ═════════════════════════════════════════════════════════════════════════════

// ── Progress steps ────────────────────────────────────────────────────────────
const STEPS = [
  'Requested', 'Registered', 'Fiducial', 'Aligned',
  'Scanned', 'Processed', 'QC', 'Lysis',
  'Purified', 'Stored', 'Shipped',
];

const STEP_STATE_MAP: Record<string, number> = {
  'SlidesReceived':      1,
  'Ready for Fiducials': 2,
  '5x Alignment Scan':   3,
  'Waiting for 40x':     4,
  'In Process':          5,
  'DigitalAssetsReady':  6,
  'Lysis':               7,
  'Batched':             8,
  'Completed':           9,
  'Excluded':            10,
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const WarningRedIcon = () => (
  <svg width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
  </svg>
);
const LogIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const ZoomInIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="11" y1="8" x2="11" y2="14"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);
const ZoomOutIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const PanelIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
);
const LayersIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);
const JsonIcon = () => (
  <svg width="32" height="32" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M8 3H7a2 2 0 00-2 2v5a2 2 0 01-2 2 2 2 0 012 2v5a2 2 0 002 2h1"/>
    <path d="M16 3h1a2 2 0 012 2v5a2 2 0 002 2 2 2 0 00-2 2v5a2 2 0 01-2 2h-1"/>
  </svg>
);

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightboxBtnStyle: React.CSSProperties = {
  width: 38, height: 38, borderRadius: 10,
  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
  border: 'none', cursor: 'pointer',
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const Lightbox = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const [zoom, setZoom] = useState(125);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        position: 'relative', width: '80vw', maxWidth: 1000,
        height: '80vh', borderRadius: 16, overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.1)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 10,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          borderRadius: 8, padding: '4px 10px',
          color: '#fff', fontSize: 13, fontWeight: 600,
        }}>{zoom}%</div>
        <button onClick={onClose} style={{ ...lightboxBtnStyle, position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
          <CloseIcon />
        </button>
        <img src={url} alt="Slide preview" style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${zoom / 100})`, transformOrigin: 'center',
          transition: 'transform 0.2s',
        }} />
        <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10, display: 'flex', gap: 8 }}>
          <button style={lightboxBtnStyle}><PanelIcon /></button>
          <button style={lightboxBtnStyle}><LayersIcon /></button>
        </div>
        <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 10, display: 'flex', gap: 8 }}>
          <button style={lightboxBtnStyle} onClick={() => setZoom(z => Math.min(z + 25, 300))}><ZoomInIcon /></button>
          <button style={lightboxBtnStyle} onClick={() => setZoom(z => Math.max(z - 25, 25))}><ZoomOutIcon /></button>
        </div>
      </div>
    </div>
  );
};

// ── File card ─────────────────────────────────────────────────────────────────
const FileCard = ({ file, onImageClick }: { file: SlideFile; onImageClick: (url: string) => void }) => {
  const isImage = (file.type === 'image' || file.type === 'svs') && file.url;
  const isJson  = file.type === 'json';
  return (
    <div className="file-card-wrap" onClick={() => isImage && onImageClick(file.url!)}
      style={{
        borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden',
        background: isJson ? '#f9fafb' : '#111',
        cursor: isImage ? 'pointer' : 'default',
        position: 'relative', aspectRatio: '4/3',
        display: 'flex', flexDirection: 'column',
      }}>
      {isImage ? (
        <>
          <img src={file.url} alt={file.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div className="file-overlay" style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}>
            <div className="file-eye" style={{ opacity: 0, transition: 'opacity 0.2s', color: '#fff' }}>
              <EyeIcon />
            </div>
          </div>
        </>
      ) : isJson ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16,
        }}>
          <JsonIcon />
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>JSON Data</span>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 12 }}>
          {file.type.toUpperCase()}
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        padding: '6px 10px', color: '#fff', fontSize: 12, fontWeight: 500,
      }}>{file.name}</div>
    </div>
  );
};

// ── Slide Log Inline Panel ────────────────────────────────────────────────────
const SlideLogPanel = ({ events }: { events: SlideEvent[] }) => {
  const logItems = [
    ...events
      .filter(e => e.new_state !== null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(ev => ({
        date: new Date(ev.timestamp).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
        label: ev.new_state ?? ev.event_type,
        by: ev.triggered_by === 'anonymous' ? 'System' : ev.triggered_by,
        done: true,
      })),
    { date: '-', label: 'Delivery', by: 'Pending', done: false },
  ];

  return (
    <div style={{
      border: '1px solid #e5e7eb', borderRadius: 14,
      background: '#fff', padding: '20px 24px',
      marginBottom: 28,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#111827' }}>
        Slide Log
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {logItems.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {item.done ? (
              <svg width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            ) : (
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '2px solid #d1d5db', flexShrink: 0,
              }} />
            )}
            <span style={{
              fontSize: 13, color: item.done ? '#374151' : '#9ca3af',
              fontWeight: 500, minWidth: 60, flexShrink: 0,
            }}>
              {item.date}
            </span>
            <span style={{
              fontSize: 13, color: item.done ? '#111827' : '#9ca3af',
              fontWeight: 600, minWidth: 160,
            }}>
              {item.label}
            </span>
            <span style={{ fontSize: 13, color: item.done ? '#6b7280' : '#9ca3af' }}>
              {item.by}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const SlideDetailPage = () => {
  const { id = 'SLD-001' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [events, setEvents] = useState<SlideEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<SlideFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      // ═══════════════════════════════════════════════════════════════════════
      // API INTEGRATION — when backend is ready:
      //   STEP 1: UNCOMMENT the try/catch block below
      //   STEP 2: COMMENT OUT the two mock lines beneath it
      // ═══════════════════════════════════════════════════════════════════════

      // STEP 1 → UNCOMMENT:
      // try {
      //   const res = await getSlideEvents(id);  // GET /slides/{id}/events
      //   setEvents(res.events);
      // } catch (err) {
      //   console.error('Failed to fetch slide events:', err);
      //   setEvents([]);
      // } finally {
      //   setLoading(false);
      // }

      // STEP 2 → COMMENT OUT when API is ready:
      setEvents(MOCK_EVENTS);
      setLoading(false);
      // ═══════════════════════════════════════════════════════════════════════
    };
    fetchEvents();
  }, [id]);

  const currentState = deriveStateFromEvents(events);
  const sampleId     = deriveSampleId(events);
  const files        = uploadedFiles;
  const currentStep  = STEP_STATE_MAP[currentState] ?? 0;
  const hasFiles     = files.length > 0;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files;
    if (!fileList) return;

    const newFiles: SlideFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith('image/') ? 'image' : file.name.endsWith('.json') ? 'json' : 'other';
      
      newFiles.push({
        id: `uploaded-${Date.now()}-${i}`,
        name: file.name,
        type: fileType as 'image' | 'json' | 'svs' | 'other',
        url: fileUrl,
      });
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    // Reset input
    e.currentTarget.value = '';
  };

  if (loading) return (
    <div style={{ padding: 40, color: '#6b7280', fontSize: 14, fontFamily: 'Inter, system-ui, sans-serif' }}>
      Loading slide…
    </div>
  );

  return (
    <>
      <style>{`
        .file-card-wrap:hover .file-overlay { background: rgba(0,0,0,0.35) !important; }
        .file-card-wrap:hover .file-eye     { opacity: 1 !important; }
        .ghost-btn:hover { border-color: #9ca3af !important; background: #f9fafb !important; }
        .mark-btn:hover  { background: #5b21b6 !important; }
        @media (max-width: 640px) {
          .detail-page  { padding: 20px 16px !important; }
          .detail-title { font-size: 22px !important; }
          .detail-hdr   { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .files-grid   { grid-template-columns: repeat(2, 1fr) !important; }
          .step-label   { display: none !important; }
        }
        @media (max-width: 400px) {
          .files-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="detail-page" style={{
        padding: '28px 40px', width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>

        {/* ── Breadcrumb ── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, fontSize: 13 }}>
          <Link to="/samples" style={{ color: '#6b7280', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
            Samples
          </Link>
          <svg width="12" height="12" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          <Link to={`/samples/${sampleId}`} style={{ color: '#6b7280', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
            Sample {sampleId}
          </Link>
          <svg width="12" height="12" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ color: '#374151', fontWeight: 500 }}>Slide {id}</span>
        </nav>

        {/* ── Title row ── */}
        <div className="detail-hdr" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <h1 className="detail-title" style={{
            fontSize: 30, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.5px',
          }}>
            Slide {id}
          </h1>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="ghost-btn" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              border: '1.5px solid #e5e7eb', background: '#fff',
              cursor: 'pointer', fontFamily: 'inherit',
              color: '#ef4444', fontSize: 13, fontWeight: 600,
              transition: 'border-color 0.15s, background 0.15s',
            }}>
              <WarningRedIcon />
              Problem with Slide
            </button>
            {/* Slide Log — toggles inline panel below */}
            <button className="ghost-btn" onClick={() => setShowLog(s => !s)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              border: showLog ? '1.5px solid #7c3aed' : '1.5px solid #e5e7eb',
              background: showLog ? '#f5f3ff' : '#fff',
              cursor: 'pointer', fontFamily: 'inherit',
              color: showLog ? '#7c3aed' : '#374151',
              fontSize: 13, fontWeight: 500,
              transition: 'border-color 0.15s, background 0.15s, color 0.15s',
            }}>
              <LogIcon />
              Slide Log
            </button>
          </div>
        </div>

        {/* ── Progress Steps ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          marginBottom: 28, overflowX: 'auto', paddingBottom: 4,
        }}>
          {STEPS.map((step, idx) => {
            const done   = idx < currentStep;
            const active = idx === currentStep;
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', flex: '1 1 0', minWidth: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? '#06b6d4' : active ? '#7c3aed' : '#e5e7eb',
                    color: done ? '#fff' : active ? '#fff' : '#9ca3af',
                    flexShrink: 0,
                  }}>
                    {done ? <CheckIcon /> : active ? (
                      <span style={{ fontSize: 8, fontWeight: 700, textAlign: 'center', lineHeight: 1, padding: '0 2px' }}>
                        {step}
                      </span>
                    ) : null}
                  </div>
                  {active && (
                    <span className="step-label" style={{
                      fontSize: 10, color: '#7c3aed', fontWeight: 600,
                      marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap',
                    }}>{step}</span>
                  )}
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{ height: 2, flex: 1, marginTop: 13, background: done ? '#06b6d4' : '#e5e7eb' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Slide Log inline panel (toggled) ── */}
        {showLog && <SlideLogPanel events={events} />}

        {/* ── Action banner ── */}
        {hasFiles && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderRadius: 12,
            border: '1.5px solid #06b6d4', background: 'rgba(6,182,212,0.06)',
            marginBottom: 32, flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <EyeIcon />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
                Ready for {STEPS[currentStep] ?? 'Next Step'}
              </span>
            </div>
            <button className="mark-btn" style={{
              padding: '9px 22px', borderRadius: 10,
              background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
              border: 'none', color: '#fff',
              fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}>
              Mark Complete
            </button>
          </div>
        )}

        {/* ── Files ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Files</h2>
          <button className="ghost-btn" onClick={handleUploadClick} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8,
            border: '1.5px solid #e5e7eb', background: '#fff',
            cursor: 'pointer', fontFamily: 'inherit',
            color: '#374151', fontSize: 13, fontWeight: 500,
            transition: 'border-color 0.15s, background 0.15s',
          }}>
            <UploadIcon />
            Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {files.length === 0 ? (
          <div style={{
            border: '1.5px solid #e5e7eb', borderRadius: 14,
            padding: '60px 20px', textAlign: 'center',
            color: '#9ca3af', fontSize: 14, background: '#fafafa',
          }}>
            No files uploaded yet.
          </div>
        ) : (
          <div className="files-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
          }}>
            {files.map(file => (
              <FileCard key={file.id} file={file} onImageClick={url => setLightboxUrl(url)} />
            ))}
          </div>
        )}

        {/* ── Back ── */}
        <button onClick={() => navigate(-1)} style={{
          marginTop: 32, display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#6b7280', fontSize: 13, fontFamily: 'inherit', padding: 0,
        }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Slides
        </button>
      </div>

      {lightboxUrl && <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </>
  );
};

export default SlideDetailPage;