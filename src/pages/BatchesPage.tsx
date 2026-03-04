import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

type BatchStatus = "In Process" | "Completed" | "Preparing" | "Archived";

interface Batch {
  id: string;
  slides: number;
  samples: number;
  status: BatchStatus;
}

/* ---------- 50 MOCK BATCHES ---------- */
const generateMockBatches = (): Batch[] => {
  const statuses: BatchStatus[] = [
    "In Process",
    "Completed",
    "Preparing",
    "Archived",
  ];

  return Array.from({ length: 160 }, (_, i) => ({
    id: (3818850 + i).toString().padStart(9, "0"),
    slides: Math.floor(Math.random() * 40) + 10,
    samples: Math.floor(Math.random() * 5) + 1,
    status: statuses[i % statuses.length],
  }));
};

const MOCK_BATCHES = generateMockBatches();

/* ---------- STATUS OPTIONS ---------- */
const STATUS_OPTIONS: (BatchStatus | "All Statuses")[] = [
  "All Statuses",
  "In Process",
  "Completed",
  "Preparing",
  "Archived",
];

/* ---------- STATUS COLORS ---------- */
const statusColors: Record<BatchStatus, { color: string; bg: string }> = {
  "In Process": { color: "#0891b2", bg: "#ecfeff" },
  Completed: { color: "#059669", bg: "#ecfdf5" },
  Preparing: { color: "#d97706", bg: "#fffbeb" },
  Archived: { color: "#6b7280", bg: "#f3f4f6" },
};

const BatchesPage = () => {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<
    BatchStatus | "All Statuses"
  >("All Statuses");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  /* ---------- FILTER + SORT ---------- */
  const filtered = useMemo(() => {
    return MOCK_BATCHES.filter(
      (b) => statusFilter === "All Statuses" || b.status === statusFilter
    ).sort((a, b) =>
      sortAsc
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    );
  }, [statusFilter, sortAsc]);

  /* ---------- PAGINATION ---------- */
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / perPage);

  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  return (
    <div style={{ padding: "32px 64px", maxWidth: 1400, margin: "0 auto" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Batches</h1>

        <div style={{ display: "flex", gap: 10 }}>
          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(
                e.target.value as BatchStatus | "All Statuses"
              );
              setCurrentPage(1);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>

          {/* SORT */}
          <button
            onClick={() => setSortAsc((s) => !s)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            Sort by Status
          </button>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
        {totalItems} {totalItems === 1 ? "batch" : "batches"}
      </p>

      {/* BATCH LIST */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {paginated.map((batch, idx) => (
          <div
            key={batch.id}
            onClick={() => navigate(`/batches/${batch.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 18px",
              borderBottom:
                idx < paginated.length - 1
                  ? "1px solid #f3f4f6"
                  : "none",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 800, minWidth: 120 }}>
              {batch.id}
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ textAlign: "center", minWidth: 80 }}>
              <div style={{ fontWeight: 700 }}>{batch.slides}</div>
              <div style={{ fontSize: 11, color: "#0891b2" }}>
                Slides
              </div>
            </div>

            <div style={{ textAlign: "center", minWidth: 80 }}>
              <div style={{ fontWeight: 700 }}>{batch.samples}</div>
              <div style={{ fontSize: 11, color: "#0891b2" }}>
                Samples
              </div>
            </div>

            <div style={{ minWidth: 120, textAlign: "right" }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: statusColors[batch.status].bg,
                  color: statusColors[batch.status].color,
                }}
              >
                {batch.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
          fontSize: 13,
        }}
      >
        {/* PER PAGE */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span>Show</span>
          {[25, 50, 100].map((num) => (
            <button
              key={num}
              onClick={() => {
                setPerPage(num);
                setCurrentPage(1);
              }}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                background: perPage === num ? "#111827" : "#fff",
                color: perPage === num ? "#fff" : "#000",
              }}
            >
              {num}
            </button>
          ))}
          <span>per page</span>
        </div>

        {/* RANGE */}
        <div>
          {startItem}–{endItem} of {totalItems} batches
        </div>

        {/* PAGE CONTROLS */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((p) => Math.max(p - 1, 1))
            }
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  fontWeight: currentPage === page ? 700 : 400,
                }}
              >
                {page}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchesPage; 