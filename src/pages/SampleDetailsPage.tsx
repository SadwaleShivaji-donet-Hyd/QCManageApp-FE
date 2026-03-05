import { useState } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { PiNoteDuotone } from "react-icons/pi";

import { Check, ChevronDown, Eye, FastForward, Plus, TriangleAlert, X } from "lucide-react";
import SampleLogModal from "../components/SampleLogModal";
import ProgressStepper from "../components/ProgressSampleStepper";
import { mockSamples, mockSlides, mockLogEntries } from "../data/mockData";
import type { Sample } from "../types/sample";

type Slide = {
    slideId: string;
    status: string;
};

interface LogEntry {
    type: string;
    entityId: string;
    action: string;
    user: string;
    timestamp: string;
}


const SampleLogsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M11.2482 1.49976H4.49927C4.10151 1.49976 3.72004 1.65777 3.43878 1.93903C3.15752 2.22029 2.99951 2.60176 2.99951 2.99952V14.9976C2.99951 15.3954 3.15752 15.7769 3.43878 16.0581C3.72004 16.3394 4.10151 16.4974 4.49927 16.4974H13.4979C13.8956 16.4974 14.2771 16.3394 14.5583 16.0581C14.8396 15.7769 14.9976 15.3954 14.9976 14.9976V5.24916L11.2482 1.49976Z" stroke="#0F172A" stroke-width="1.49976" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10.4985 1.49976V4.49928C10.4985 4.89704 10.6565 5.27851 10.9378 5.55977C11.2191 5.84104 11.6005 5.99905 11.9983 5.99905H14.9978" stroke="#0F172A" stroke-width="1.49976" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M7.49879 6.74902H5.99902" stroke="#0F172A" stroke-width="1.49976" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.9981 9.74854H5.99902" stroke="#0F172A" stroke-width="1.49976" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.9981 12.748H5.99902" stroke="#0F172A" stroke-width="1.49976" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
)

type SampleDetail = {
    id: string;
    customer: string;
    receivedDate: string;
    slides: number;
    limsId: string;
    status: string;
    slidesList: Slide[];
};

// Sample mock data for slides
const generateSlides = (count: number): Slide[] => {
    const slideIds = [
        "3587438297", "7658693406", "4900551617", "9603359928",
        "1234567890", "2345678901", "3456789012", "4567890123"
    ];
    return slideIds.slice(0, count).map(id => ({
        slideId: id,
        status: "Requested"
    }));
};

const sampleDetailsMap: Record<string, SampleDetail> = {
    "0789456321": {
        id: "937069936",
        customer: "Provenance Medical System",
        receivedDate: "02/25/26",
        slides: 4,
        limsId: "-",
        status: "Requested",
        slidesList: generateSlides(4)
    },
    "0789456322": {
        id: "937069937",
        customer: "Mayo Lab",
        receivedDate: "02/25/26",
        slides: 5,
        limsId: "-",
        status: "In Process",
        slidesList: generateSlides(5)
    },
    "0789456323": {
        id: "937069938",
        customer: "Stanford Med",
        receivedDate: "02/25/26",
        slides: 8,
        limsId: "-",
        status: "Requested",
        slidesList: generateSlides(8)
    }
};

const statusColorMap: Record<string, string> = {
    "Requested": "bg-blue-100 text-blue-800",

    "Intake": "bg-indigo-100 text-indigo-800",

    "Received": "bg-cyan-100 text-cyan-800",

    "Waiting for 40x": "bg-amber-100 text-amber-800",

    "Fiducial Printing": "bg-purple-100 text-purple-800",

    "5x Alignment Scan": "bg-violet-100 text-violet-800",

    "PrintMatch Processing": "bg-sky-100 text-sky-800",

    "Checkfile Review": "bg-orange-100 text-orange-800",

    "Mask Printing": "bg-pink-100 text-pink-800",

    "Lysis": "bg-rose-100 text-rose-800",

    "Delivery": "bg-green-100 text-green-800",
    "Excluded": "bg-red-100 text-red-800",
};

const slideStatusColorMap: Record<string, string> = {
    "Requested": "text-[#CC783B] bg-[#FFFBEB] rounded-[10px] px-2 py-1 text-xs",
};

export default function SampleDetailsPage() {
    const { sampleId } = useParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState("Status");
    const [logOpen, setLogOpen] = useState(false);
    const [selectedSlides, setSelectedSlides] = useState<string[]>([]);
    const [sample, setSample] = useState<Sample | null>(mockSamples.find((s) => s.id === sampleId) || null);
    const [slides, setSlides] = useState(sampleId ? mockSlides[sampleId] || [] : []);
    const [markProblemVisible, setMarkProblemVisible] = useState(false);
    const [updateStatusVisible, setUpdateStatusVisible] = useState(false);
    const [problemType, setProblemType] = useState("");
    const [showProblemDropdown, setShowProblemDropdown] = useState(false);
    const [problemNote, setProblemNote] = useState("");
    const [sortByVisible, setSortByVisible] = useState(false);
    const problemOptions = [
        "Damaged during processing",
        "Poor tissue quality",
        "Insufficient tissue",
        "Labeling error",
        "Contamination",
        "Equipment malfunction",
        "Other",
    ]
    // Get sample details from the map (in a real app, this would come from an API)
    const sampleDetail = sampleDetailsMap[sampleId || "0789456321"] || sampleDetailsMap["0789456321"];



    const handleBackToSamples = () => {
        navigate("/samples");
    };

    const handleSlideClick = (slideId: string) => {
        navigate(`/samples/${sampleId}/slide-details/${slideId}`);
    };

    const toggleSlide = (id: string) => {
        setSelectedSlides((prev) =>
            prev.includes(id)
                ? prev.filter((s) => s !== id)
                : [...prev, id]
        );
    };

    const updateSelectedSlideStatus = (newStatus: string) => {
        setSlides((prevSlides) =>
            prevSlides.map((slide) =>
                selectedSlides.includes(slide.id)
                    ? { ...slide, status: newStatus }
                    : slide
            )
        );
        setUpdateStatusVisible(false);
        setSelectedSlides([]);
    };

    const excludeSelectedSlideStatus = () => {
        setSlides((prevSlides) =>
            prevSlides.map((slide) =>
                selectedSlides.includes(slide.id)
                    ? { ...slide, status: "Excluded" }
                    : slide
            )
        );
        setMarkProblemVisible(false);
        setSelectedSlides([]);
    };

    return (<>
        <div className="min-h-screen bg-white p-8 mx-18 my-4">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-6 flex items-center gap-4">
                <button
                    onClick={handleBackToSamples}
                    className="text-gray-600 hover:text-gray-800 cursor-pointer underline font-bold"
                >
                    Samples
                </button>
                <span><IoMdArrowRoundForward className="text-gray-400" /></span>
                <span className="text-gray-700 font-bold">Sample {sample?.id}</span>
            </div>

            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-gray-900">
                    Sample {sample?.id}
                </h1>

                <button
                    onClick={() => setLogOpen(true)}
                    className="px-4 py-2 text-sm text-black rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                    <span> <SampleLogsIcon /> </span><span className="text-base"> Sample Log</span>
                </button>
            </div>

            {/* Status Badge and Navigation Dots */}
            {/* <div className="flex items-center gap-4 mb-8">
                <span className={`px-4 py-2 text-xs font-bold rounded-full ${statusColorMap[sampleDetail.status] || "bg-gray-700 text-white"}`}>
                    {sampleDetail.status}
                </span>

                <div className="flex items-center gap-2">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full cursor-pointer transition ${i < sampleDetail.slides
                                    ? "bg-gray-400 hover:bg-gray-500"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div> */}

            {/* <div className="mb-8 flex flex-row items-center justify-center w-full">
                <div className="flex items-center gap-4 text-sm text-white-600">
                    <span className="px-3 py-1 bg-[#4338E0] rounded-[10px] rounded-lg text-white">
                        Requested
                    </span>
                </div>

                <div className="flex w-full items-center justify-between">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex-1 flex items-center">

                            {i !== 10 && (
                                <div className="flex-1 h-0.5" />
                            )}
                            <div className="w-4 h-4 rounded-full border-1 border-gray-400 bg-gray-200" />
                        </div>
                    ))}
                </div>
            </div> */}

            <div className="mb-6">
                <ProgressStepper currentStatus={sample?.status} />
            </div>

            {sample?.status === "Ready to Process" && (
                <div
                    className="rounded-xl px-6 py-4 mb-6 flex items-center justify-between bg-[#E0F7FA]"
                    style={{ border: "4px solid rgb(0, 172, 193)" }}
                >
                    <div className="flex items-center gap-3">
                        <span style={{ fontWeight: 600 }}>
                            All files loaded for {sample?.slideCount} slides — ready to begin processing
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors bg-[#4338E0] text-white hover:bg-[#3730B8]"
                            onClick={handleStartProcessing}
                        >
                            Start Processing
                        </button>
                    </div>
                </div>
            )}

            {/* Sample Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 py-4 mb-8">
                <div className="flex items-center gap-12">
                    {/* Customer */}
                    <div className="flex flex-col gap-2">
                        <p className="text-base text-gray-900 font-semibold ">{sample?.customer}</p>
                        <p className="text-xs text-cyan-500 font-semibold mb-1">Customer</p>

                    </div>

                    {/* Received Date */}
                    <div className="flex flex-col gap-2">
                        <p className="text-base text-gray-900 font-semibold ">{sample?.receivedDate}</p>
                        <p className="text-xs text-cyan-500 font-semibold mb-1">Received</p>

                    </div>

                    {/* Slides Count */}
                    <div className="flex flex-col gap-2">
                        <p className="text-base text-gray-900 font-semibold">{sample?.slideCount}</p>
                        <p className="text-xs text-cyan-500 font-semibold mb-1">Slides</p>

                    </div>

                    {/* LIMS ID */}
                    <div className="flex flex-col gap-2">
                        {sample?.limsId ?
                            (<p className="text-base text-gray-900 font-semibold ">{sample?.limsId}</p>

                            ) :
                            (<p className="text-base text-gray-900 font-semibold "> - </p>

                            )
                        }

                        <p className="text-xs text-cyan-500 font-semibold mb-1">LIMS ID</p>

                    </div>

                    {/* Batch */}
                    <div className="flex flex-col gap-2">
                        {sample?.batchId ?
                            (<p className="text-base text-gray-900 font-semibold ">{sample?.batchId}</p>
                            ) : <button className="px-4 py-1 bg-[#4338E0] text-white text-base rounded-xl hover:bg-blue-700 transition flex flex-row gap-2 justify-center items-center">
                                <Plus size={15} /> <span>Add to Batch</span>
                            </button>}

                        <p className="text-xs text-cyan-500 font-semibold mb-1">Batch</p>

                    </div>


                </div>
            </div>

            {/* Slides Section */}
            <div className="">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-4xl text-gray-900">
                        Slides
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Sort by</span>
                        {/* <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg border-0 hover:bg-blue-700 cursor-pointer"
                        >
                            <option value="Status">Status</option>
                            <option value="ID">ID</option>
                            <option value="Date">Date</option>
                        </select> */}
                        <div className="relative">
                            <div
                                onClick={() => setSortByVisible(true)}
                                className="flex flex-row items-center justify-center gap-2 bg-black text-white rounded-lg px-4 py-2">
                                <ChevronDown size={20} className="text-white" /> {sortBy}
                            </div>
                            {sortByVisible && (
                                <div className="absolute top-full right-0 mt-1 bg-white border border-[#d9d9d9] rounded-lg shadow-lg py-1 min-w-[120px] z-10">

                                    <button
                                        onClick={() => {
                                            setSortBy("Status");
                                            setSortByVisible(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-[#f5f5f5] text-sm cursor-pointer"
                                    >
                                        Status
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSortBy("Slide ID");
                                            setSortByVisible(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-[#f5f5f5] text-sm cursor-pointer"
                                    >
                                        Slide ID
                                    </button>

                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Slides List */}
                {/* <div className="">
                    {sampleDetail.slidesList.map((slide) => (
                        <div
                            key={slide.slideId}
                            className="bg-gray-50 border  rounded-xl border-gray-200 p-4 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer"
                            onClick={() => handleSlideClick(slide.slideId)}
                        >
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-[#CBD5E1] cursor-pointer"
                                    onChange={() => { }}
                                />
                                <span className="text-lg font-bold text-gray-900">{slide.slideId}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-bold ${slideStatusColorMap[slide.status] || "text-gray-700"}`}>
                                    {slide.status}
                                </span>
                                <button className="p-2 hover:bg-gray-200 rounded-full transition">
                                    <IoMdArrowRoundForward size={18} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div> */}

                <div className="border border-gray-200 rounded-xl">
                    {selectedSlides.length > 0 && (
                        <div className="bg-[#1e1e1e] text-white px-6 py-3 flex items-center justify-between">

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedSlides([])}
                                    className="w-5 h-5 rounded border-2 border-white flex items-center justify-center bg-white"
                                >
                                    <div className="w-2.5 h-0.5 bg-[#1e1e1e] rounded" />
                                </button>

                                <span className="text-sm font-medium">
                                    {selectedSlides.length} slides selected
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button
                                        onClick={() => setUpdateStatusVisible(!updateStatusVisible)}
                                        className="flex cursor items-center gap-2 px-4 py-1.5 rounded-lg bg-white text-[#1e1e1e] text-sm hover:bg-[#f5f5f5]">
                                        <FastForward size={14} />
                                        Update Status
                                        <ChevronDown size={14} />
                                    </button>
                                    {updateStatusVisible && (
                                        <div
                                            className="absolute top-full right-0 mt-1 bg-white border border-[#d9d9d9] rounded-lg shadow-lg py-1 min-w-[200px] z-20 max-h-[300px] overflow-y-auto">
                                            {[
                                                "Requested",
                                                "Intake",
                                                "Received",
                                                "Waiting for 40x",
                                                "Fiducial Printing",
                                                "5x Alignment Scan",
                                                "PrintMatch Processing",
                                                "Checkfile Review",
                                                "Mask Printing",
                                                "Lysis",
                                                "Delivery",
                                            ].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => updateSelectedSlideStatus(status)}
                                                    className="w-full text-left px-4 py-2 hover:bg-[#f5f5f5] text-sm text-[#1e1e1e]"
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>

                                    )}

                                </div>

                                <button
                                    onClick={() => setMarkProblemVisible(true)}
                                    className="flex cursor items-center gap-2 px-4 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">
                                    <TriangleAlert size={14} />
                                    Mark Problem
                                </button>

                                {markProblemVisible && (

                                    <div className="fixed inset-0 bg-black/40 w-[100vw] h-[100vh] flex items-center justify-center z-999">
                                        <div className="bg-white rounded-lg shadow-xl text-black w-[800px] max-w-[92vw] px-6 py-8 flex flex-col gap-8">

                                            {/* Header */}
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-[32px]  font-normal">Problem with Slide</h2>
                                                <button
                                                    onClick={() => setMarkProblemVisible(false)}
                                                    className="text-[#757575] hover:text-[#1e1e1e]"
                                                >
                                                    <X size={24} />
                                                </button>
                                            </div>

                                            {/* Info */}
                                            <div className="border border-[#757575] rounded-lg p-4 flex items-start gap-3">
                                                <Eye className="text-[#1e1e1e]" size={23} />
                                                <p className="text-[16px] font-semibold">
                                                    If there was a problem with this slide and you can no longer process it to complete, Exclude it here.
                                                </p>
                                            </div>

                                            {/* Problem Type */}
                                            <div className="flex relative flex-col gap-2 w-[282px]">
                                                <label className="text-[16px]">Type of Problem</label>

                                                <button
                                                    onClick={() => setShowProblemDropdown(!showProblemDropdown)}
                                                    className="flex items-center justify-between w-full h-[40px] px-4 bg-white border border-[#d9d9d9] rounded-lg hover:border-[#b3b3b3] transition-colors"
                                                >
                                                    <span className={`text-[16px] ${problemType ? "text-[#1e1e1e]" : "text-[#757575]"}`}>
                                                        {problemType || "Choose"}
                                                    </span>

                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform ${showProblemDropdown ? "rotate-180" : ""}`}
                                                    />
                                                </button>
                                                {showProblemDropdown && (
                                                    <div className="absolute top-18 z-10 mt-1 left-0 w-full bg-white border border-[#d9d9d9] rounded-lg shadow-lg z-10 py-1 max-h-[240px] overflow-y-auto">

                                                        {problemOptions.map((option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() => {
                                                                    setProblemType(option);
                                                                    setShowProblemDropdown(false);
                                                                }}
                                                                className="w-full text-left px-4 py-2.5 text-[15px] hover:bg-[#f5f5f5] transition-colors"
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}

                                                    </div>
                                                )}

                                            </div>

                                            {/* Description */}
                                            <div className="flex flex-col gap-2 w-full">
                                                <label className="text-[16px]">Describe the Problem</label>

                                                <textarea
                                                    value={problemNote}
                                                    onChange={(e) => setProblemNote(e.target.value)}
                                                    placeholder="Describe what happened..."
                                                    className="w-full min-h-[80px] px-4 py-3 border border-[#d9d9d9] rounded-lg focus:border-[#757575]"
                                                />
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center gap-4 w-full">
                                                <button
                                                    onClick={() => setMarkProblemVisible(false)}
                                                    className="flex-1 py-3 rounded-lg hover:bg-[#f5f5f5]"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={() => excludeSelectedSlideStatus()}
                                                    className={`
                                                        flex-1 py-3 rounded-lg text-white border border-[#757575]
                                                        ${problemType ? "bg-black" : "bg-[#757575]"}
                                                    `}
                                                >
                                                    Exclude Slide
                                                </button>
                                            </div>

                                        </div>

                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedSlides([])}
                                    className="text-[#999] hover:text-white text-sm"
                                >
                                    Cancel
                                </button>

                            </div>
                        </div>
                    )}
                    <table className="w-full">
                        {/* Body */}
                        <tbody>
                            {/* {sampleDetail.slidesList.map((slide) => ( */}
                            {slides.map((slide) => (

                                // <tr
                                //     key={slide.slideId}
                                //     onClick={() => handleSlideClick(slide.slideId)}
                                //     className="border-b last:border-none border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                                // >
                                <tr
                                    key={slide.id}
                                    onClick={() => handleSlideClick(slide.id)}
                                    className={`
    border-b border-gray-200 cursor-pointer transition
    ${selectedSlides.includes(slide.id)
                                            ? "bg-[#f0f7fa]"
                                            : "hover:bg-gray-50"}
  `}
                                >
                                    {/* Checkbox */}
                                    {/* <td className="p-2 px-8">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-[#CBD5E1]"
                                            onChange={() => { }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="p-2 text-2xl font-semibold text-gray-900">
                                            {slide.slideId}

                                        </span>
                                    </td> */}
                                    <td className="p-2 px-8 flex items-center gap-3">

                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSlide(slide.id);
                                            }}
                                            className={`
      w-5 h-5 rounded border-2 flex items-center justify-center shrink-0
      ${selectedSlides.includes(slide.id)
                                                    ? "bg-[#1e1e1e] border-[#1e1e1e]"
                                                    : "border-[#d9d9d9] bg-white hover:border-[#999]"}
    `}
                                        >
                                            {selectedSlides.includes(slide.id) && (
                                                <Check size={14} className="text-white" />
                                            )}
                                        </div>

                                        <span className="text-[20px] font-semibold tracking-tight text-gray-900">
                                            {slide.id}
                                        </span>

                                        {slide.status === "Excluded" && (
                                            <span className="ml-2 text-xs font-bold bg-red-100 text-red-800 rounded-full px-2 py-1">
                                                Excluded
                                            </span>
                                        )}

                                    </td>

                                    {/* Slide ID */}


                                    {/* <td >
                                        <span className={`p-4 text-sm font-bold ${slideStatusColorMap[slide.status] || "text-gray-700"}`}>
                                            {slide.status}

                                        </span>
                                    </td>

                                    <td className="p-2 text-right">
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-600 hover:text-gray-800"
                                        >
                                            <IoMdArrowRoundForward size={18} className="text-gray-600" />
                                        </button>
                                    </td> */}

                                    {/* Status + Action */}
                                    <td className="p-2 px-8">
                                        <div className="flex items-center justify-end gap-4">

                                            <span className={`text-sm font-bold rounded-xl px-2 py-1 ${statusColorMap[slide.status] || "text-gray-700"}`}>
                                                {slide.status}
                                            </span>

                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-600 hover:text-gray-800"
                                            >
                                                <IoMdArrowRoundForward size={18} />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
        <SampleLogModal
            sampleId={sampleId}
            entries={mockLogEntries}
            isOpen={logOpen}
            onClose={() => setLogOpen(false)}
        />
    </>);
}