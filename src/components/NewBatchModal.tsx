import { useState } from "react";
import { Search, X } from "lucide-react";

interface NewBatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewBatchModal = ({ open, onOpenChange }: NewBatchModalProps) => {
  const [search, setSearch] = useState("");

  // Mock data (empty for now)
  const unbatchedSamples: string[] = [];

  const filtered = unbatchedSamples.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase()),
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal */}
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-xl font-bold">New Batch</h2>
            <p className="mt-2 text-sm text-gray-500">
              Select samples to combine into a new batch for processing.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search unbatched samples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mx-6 mt-4 mb-6 min-h-[120px] rounded-lg bg-gray-100 flex items-center justify-center">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500 text-center px-4">
              All samples are already in batches. Create new samples via New
              Accession.
            </p>
          ) : (
            <div className="w-full p-3 space-y-2">
              {filtered.map((sample) => (
                <div
                  key={sample}
                  className="rounded-md bg-white p-2 text-sm shadow-sm"
                >
                  {sample}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={() => onOpenChange(false)}
            className="text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>

          <button
            disabled={filtered.length === 0}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white 
              ${
                filtered.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            Create Batch ({filtered.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewBatchModal;
