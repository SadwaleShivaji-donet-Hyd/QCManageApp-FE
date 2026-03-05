import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function SampleNewAccessionModal({onClose}) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [limsId, setLimsId] = useState("");

  const isDisabled = !customer || !limsId;

  return(
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-[440px] max-w-[90vw]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E1]">
              <h3 className="text-lg font-semibold">New Accession</h3>
              <button
                onClick={() => onClose(false)}
                className="text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-[#64748B] mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Health"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4338E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-[#64748B] mb-1">
                  LIMS ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. LIMS-1234"
                  value={limsId}
                  onChange={(e) => setLimsId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4338E0] focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-sm cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Cancel
                </button>

                <button
                  disabled={isDisabled}
                  className="px-4 py-2 rounded-lg bg-[#4338E0] text-white text-sm cursor-pointer hover:bg-[#3730B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Accession
                </button>
              </div>
            </div>
          </div>
        </div>
      );
}