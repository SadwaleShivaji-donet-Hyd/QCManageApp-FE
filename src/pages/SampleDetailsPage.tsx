import { useState } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { PiNoteDuotone } from "react-icons/pi";

import { Plus } from "lucide-react";
import SampleLogModal from "../components/SampleLogModal";
import ProgressStepper from "../components/ProgressStepper";
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
    "Requested": "bg-blue-600 text-white",
    "In Process": "bg-yellow-500 text-white",
    "Completed": "bg-green-500 text-white",
    "On Hold": "bg-red-500 text-white",
};

const slideStatusColorMap: Record<string, string> = {
    "Requested": "text-[#CC783B] bg-[#FFFBEB] rounded-[10px] px-2 py-1 text-xs",
};

export default function SampleDetailsPage() {
    const { sampleId } = useParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState("Status");
    const [logOpen, setLogOpen] = useState(false);

    const [sample, setSample] = useState<Sample | null>(mockSamples.find((s) => s.id === sampleId) || null);
    const [slides, setSlides] = useState<Slide[]>(sampleId ? mockSlides[sampleId] || [] : []);

    // Get sample details from the map (in a real app, this would come from an API)
    const sampleDetail = sampleDetailsMap[sampleId || "0789456321"] || sampleDetailsMap["0789456321"];

    const handleBackToSamples = () => {
        navigate("/samples");
    };

    const handleSlideClick = (slideId: string) => {
        navigate(`/slide-details/${slideId}`);
    };

    return (<>
        <div className="min-h-screen w-full bg-white p-8 px-18">
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
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg border-0 hover:bg-blue-700 cursor-pointer"
                        >
                            <option value="Status">Status</option>
                            <option value="ID">ID</option>
                            <option value="Date">Date</option>
                        </select>
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

                <div className="overflow-hidden border border-gray-200 rounded-xl">
                    <table className="w-full">
                        {/* Body */}
                        <tbody>
                            {sampleDetail.slidesList.map((slide) => (
                                <tr
                                    key={slide.slideId}
                                    onClick={() => handleSlideClick(slide.slideId)}
                                    className="border-b last:border-none border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                                >

                                    {/* Checkbox */}
                                    <td className="p-2 px-8">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-[#CBD5E1]"
                                            onChange={() => { }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="p-2 text-2xl font-semibold text-gray-900">
                                            {slide.slideId}

                                        </span>
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

                                            <span className={`text-sm font-bold ${slideStatusColorMap[slide.status] || "text-gray-700"}`}>
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