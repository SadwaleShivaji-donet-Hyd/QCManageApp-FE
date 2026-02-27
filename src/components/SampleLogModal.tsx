import { X, ArrowRight, FileText } from "lucide-react";

export interface LogEntry {
    type: string;
    entityId: string;
    action: string;
    user: string;
    timestamp: string;
}

interface SampleLogModalProps {
    sampleId: string;
    entries: LogEntry[];
    isOpen: boolean;
    onClose: () => void;
}

const SampleLogModal = ({ sampleId, entries, isOpen, onClose }: SampleLogModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="border-b-2 border-gray-200 flex items-center justify-between px-6 pt-6 pb-4 mb-4">
                    <div className="flex items-center gap-2 font-bold">
                        <FileText size={24} className="text-foreground" />
                        <h2 className="text-2xl font-semibold text-foreground">Sample {sampleId} Log</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gray-200" />

                        {entries.map((entry, index) => (
                            <div key={index} className="flex gap-4 mb-5 relative">
                                {/* Timeline dot */}
                                <div className="flex-shrink-0 w-[30px] flex items-start justify-center pb-1">
                                    <div
                                        className="p-2 rounded-full border border-gray-400 bg-[#F1F5F9] hover:bg-gray-200 transition text-gray-600 hover:text-gray-800"
                                    >
                                        <ArrowRight size={14} className="text-black font-bold" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-sm bg-[#F0FDF4] font-medium text-[#15803D]">
                                            {entry.type}
                                        </span>
                                        <span className="text-sm text-[#64748B]">{entry.entityId}</span>
                                        <span className="ml-auto text-xs whitespace-nowrap">
                                            <span className="text-[#64748B] font-bold">{entry.user}</span><span className="text-[#999]">{entry.timestamp}</span>
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">{entry.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SampleLogModal;
