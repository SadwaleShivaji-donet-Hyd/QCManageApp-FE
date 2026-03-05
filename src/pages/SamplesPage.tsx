import { useState } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { mockSamples } from "../data/mockData";
import SampleNewAccesionModal from "../components/SampleNewAccessionModal";
import { ArrowUpDown } from "lucide-react";
import type { Sample } from "../types/sample";

// const samplesData: Sample[] = [
//     { id: "0789456321", customer: "UCLA Health", batchId: "00318853", slides: 12, status: "In Process", actionStatus: "5x Alignment Scan", receivedDate: "02/25/26" },
//     { id: "0789456322", customer: "Mayo Lab", batchId: "00318853", slides: 5, status: "In Process", actionStatus: "Waiting for 40x", receivedDate: "02/25/26" },
//     { id: "0789456323", customer: "Stanford Med", batchId: "00318853", slides: 8, status: "In Process", actionStatus: "5x Alignment Scan", receivedDate: "02/25/26" },
//     { id: "0789456421", customer: "Health Plus", batchId: "00318854", slides: 9, status: "In Process", actionStatus: "waiting for Ark", receivedDate: "02/25/26" },
//     { id: "0789456422", customer: "Quest Lab", batchId: "00318853", slides: 11, status: "In Process", actionStatus: "waiting for dry", receivedDate: "02/25/26" },
//     { id: "0789456423", customer: "Boston Med", batchId: "00318852", slides: 10, status: "Completed", actionStatus: "waiting for dry", receivedDate: "02/25/26" },
//     { id: "0789456521", customer: "Johns Hopkins", batchId: "00318851", slides: 12, status: "In Process", actionStatus: "awaiting dry dry", receivedDate: "02/25/26" },
//     { id: "0789456522", customer: "Mass General", batchId: "00318850", slides: 8, status: "In Process", actionStatus: "Ready for Lysis", receivedDate: "02/25/26" },
//     { id: "0789456523", customer: "Mayo Clinic", batchId: "00318849", slides: 12, status: "On Hold", actionStatus: "Ready for Lysis", receivedDate: "02/25/26" },
//     { id: "0789456621", customer: "Cedars Sinai", batchId: "00318848", slides: 9, status: "Completed", actionStatus: "Ready for Review", receivedDate: "02/25/26" },
//     { id: "0789456622", customer: "UCSF Medic", batchId: "00318847", slides: 8, status: "On Hold", actionStatus: "Ready for Review", receivedDate: "02/25/26" },
//     { id: "0789456623", customer: "Duke Health", batchId: "00318846", slides: 12, status: "In Process", actionStatus: "Ready for Scan", receivedDate: "02/25/26" },
//     { id: "0789456721", customer: "Yale Med", batchId: "00318845", slides: 9, status: "Ready for Fiducials", actionStatus: "Ready for Fiducials", receivedDate: "02/25/26" },
//     { id: "0789456722", customer: "Michigan Med", batchId: "00318844", slides: 8, status: "Ready for Fiducials", actionStatus: "Ready for Fiducials", receivedDate: "02/25/26" },
//     { id: "0789456723", customer: "UNC Health", batchId: "00318843", slides: 8, status: "Scanned", actionStatus: "Ready for Fiducials", receivedDate: "02/25/26" },
//     { id: "0789456821", customer: "Emory Health", batchId: "00318842", slides: 11, status: "Completed", actionStatus: "waiting for Ark", receivedDate: "02/25/26" },
//     { id: "0789456822", customer: "Penn Med", batchId: "00318841", slides: 12, status: "Scanned", actionStatus: "waiting for Ark", receivedDate: "02/25/26" },
//     { id: "0789456823", customer: "Columbia", batchId: "00318840", slides: 13, status: "In Process", actionStatus: "Ready for Review", receivedDate: "02/25/26" },
// ];

const actionStatusColorMap: Record<string, string> = {
    "No Slides": "bg-gray-50 text-gray-500",
    "Waiting for files": "bg-yellow-50 text-yellow-600",
    "Ready to Process": "bg-indigo-50 text-indigo-600",
    "Preparing": "bg-blue-50 text-blue-600",
    "Ready for Fiducials": "bg-green-50 text-green-600",
    "Ready for 5x Scan": "bg-cyan-50 text-cyan-600",
    "PrintMatch Processing": "bg-purple-50 text-purple-600",
    "Ready for PrintMatch Review": "bg-pink-50 text-pink-600",
    "Ready for Print": "bg-orange-50 text-orange-600",
    "Printing": "bg-amber-50 text-amber-600",
    "Ready for Lysis": "bg-blue-50 text-blue-600",
    "In Lysis": "bg-teal-50 text-teal-600",
    "Ready to Deliver": "bg-emerald-50 text-emerald-600",
    "Complete": "bg-gray-100 text-gray-700",
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
    "No Slides",
    "Waiting for files",
    "Ready to Process",
    "Preparing",
    "Ready for Fiducials",
    "Ready for 5x Scan",
    "PrintMatch Processing",
    "Ready for PrintMatch Review",
    "Ready for Print",
    "Printing",
    "Ready for Lysis",
    "In Lysis",
    "Ready to Deliver",
    "Complete"
] as const;

export default function SamplesPage() {
    const [samplesData, setSamplesData] = useState<Sample[]>(mockSamples);
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<string>("All Statuses");
    const [sortOrder, setSortOrder] = useState<string>("Sort by Status");
    const [newSampleModalOpen, setNewSampleModalOpen] = useState(false);
    const [statusFilters, setStatusFilters] = useState<string[]>(["All Statuses"]);
    const [sortAsc, setSortAsc] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [sortField, setSortField] = useState<"status" | "batchId" | "slideCount">("status");
    const [sortOpen, setSortOpen] = useState(false);

    const handleRowClick = (sample: Sample) => {
        navigate(`/sample-details/${sample.id}`, { state: { sample } });
    };


    const toggleStatus = (status: string) => {
        if (status === "All Statuses") {
            setStatusFilters(["All Statuses"]);
            return;
        }

        setStatusFilters(prev => {
            const exists = prev.includes(status);

            let next = exists
                ? prev.filter(s => s !== status)
                : [...prev.filter(s => s !== "All Statuses"), status];

            if (next.length === 0) next = ["All Statuses"];

            return next;
        });
    };

    // const filteredSamples = samplesData
    //     .filter(b =>
    //         statusFilters.includes("All Statuses") || statusFilters.includes(b.status)
    //     )
    //     .sort((a, b) =>
    //         sortAsc
    //             ? a.status.localeCompare(b.status)
    //             : b.status.localeCompare(a.status)
    //     );


    const filteredSamples = samplesData
        .filter(b =>
            statusFilters.includes("All Statuses") || statusFilters.includes(b.status)
        )
        .sort((a, b) => {
            let valA;
            let valB;

            switch (sortField) {
                case "status":
                    valA = a.status;
                    valB = b.status;
                    return sortAsc
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);

                case "batchId":
                    valA = a.batchId;
                    valB = b.batchId;
                    return sortAsc
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);

                case "slideCount":
                    valA = a.slides;
                    valB = b.slides;
                    return sortAsc
                        ? valA - valB
                        : valB - valA;

                default:
                    return 0;
            }
        });
    return (
        <div className="min-h-screen bg-white p-8 mx-14 my-4">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl font-bold text-gray-900">
                        Samples
                    </h1>


                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setNewSampleModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4338E0] text-white text-sm cursor-pointer hover:bg-[#3730B8] transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-plus"
                            >
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                            </svg>

                            New Accession
                        </button>

                        {newSampleModalOpen &&
                            <SampleNewAccesionModal onClose={() => setNewSampleModalOpen(false)} />
                        }



                    </div>
                </div>

                {/* Sample Count */}
                <div className="flex justify-between items-center mb-4">

                    <p className="text-gray-400 text-sm">{filteredSamples.length} samples</p>

                    <div className="flex gap-4 items-center">



                        <div style={{ position: "relative" }}>
                            <button
                                className="ctrl-btn"
                                onClick={() => setShowDropdown(d => !d)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "7px 14px",
                                    borderRadius: 10,
                                    border: "1.5px solid #e5e7eb",
                                    background: "#fff",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "#374151",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    transition: "border-color 0.15s",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                <span style={{ color: "#9ca3af", fontSize: 12 }}>Status:</span>
                                <span>{statusFilters.join(", ")}</span>
                                <ChevronDown />
                            </button>

                            {showDropdown && (
                                <>
                                    <div
                                        onClick={() => setShowDropdown(false)}
                                        style={{ position: "fixed", inset: 0, zIndex: 10 }}
                                    />

                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "calc(100% + 6px)",
                                            left: 0,
                                            zIndex: 20,
                                            background: "#fff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: 10,
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                                            minWidth: 220,
                                            maxHeight: 320,
                                            overflowY: "auto"
                                        }}
                                    >
                                        {STATUS_OPTIONS.map(opt => {
                                            const selected = statusFilters.includes(opt);

                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => toggleStatus(opt)}
                                                    style={{
                                                        width: "100%",
                                                        textAlign: "left",
                                                        padding: "9px 14px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        background: selected ? "#f1f5f9" : "transparent",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: 13
                                                    }}
                                                >
                                                    {/* Checkbox */}
                                                    <div
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            borderRadius: 4,
                                                            border: selected ? "1px solid #4338E0" : "1px solid #CBD5E1",
                                                            background: selected ? "#4338E0" : "transparent",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {selected && (
                                                            <svg
                                                                width="10"
                                                                height="10"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="white"
                                                                strokeWidth="3"
                                                            >
                                                                <path d="M20 6 9 17l-5-5" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    <span style={{ fontWeight: selected ? 500 : 400 }}>{opt}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setSortOpen(o => !o)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-sm"
                            >
                                <ArrowUpDown className="h-[14px] w-[14px]" />
                                <span>
                                    {sortField === "status"
                                        ? "Status"
                                        : sortField === "batchId"
                                            ? "Batch Number"
                                            : "Number of Slides"}
                                </span>
                                <ChevronDown className="h-[14px] w-[14px]" />
                            </button>

                            {sortOpen && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-[#CBD5E1] rounded-lg shadow-lg py-1 min-w-[200px] z-50">

                                    <button
                                        onClick={() => {
                                            setSortField("status");
                                            setSortOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-[#F1F5F9] text-sm"
                                    >
                                        Status
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSortField("batchId");
                                            setSortOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-[#F1F5F9] text-sm"
                                    >
                                        Batch Number
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSortField("slideCount");
                                            setSortOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-[#F1F5F9] text-sm"
                                    >
                                        Number of Slides
                                    </button>

                                </div>
                            )}
                        </div>
                    </div>





                </div>
            </div>



            <div className="bg-white border border-gray-300 overflow-hidden">
                <table className="w-full text-sm">

                    <tbody>
                        {filteredSamples.map((sample, index) => (
                            <tr
                                key={sample.id}
                                className={`border-t border-gray-300 hover:bg-gray-50 transition bg-white`}
                                onClick={() => handleRowClick(sample)}
                            >
                                <td className="flex gap-4 items-baseline mb-2 px-6 py-4">
                                    <h3 className="text-2xl font-semibold text-gray-900">{sample.id}</h3>
                                    <span className="text-sm text-gray-500">{sample.customer}</span>
                                </td>
                                <td >
                                    <p className="text-lg text-black font-semibold">{sample.batchId}</p>
                                    <p className="text-xs text-cyan-500 font-semibold">Batch</p>
                                </td>
                                <td>
                                    <p className="text-lg text-black font-semibold">{sample.slideCount}</p>
                                    <p className="text-xs text-cyan-500 font-semibold">Slides</p>
                                </td>

                                <td className="flex justify-end px-6 py-4">
                                    <span className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap ${actionStatusColorMap[sample.status] || "bg-gray-100 text-gray-700"}`}>
                                        {/* {sample.actionStatus} */}
                                        {sample.status}
                                    </span>
                                </td>
                                <td className=" py-4 text-center">
                                    <button
                                        onClick={() => handleRowClick(sample)}
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-600 hover:text-gray-800"
                                    >
                                        <IoMdArrowRoundForward size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}