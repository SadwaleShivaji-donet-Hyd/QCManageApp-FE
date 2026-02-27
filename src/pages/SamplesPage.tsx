import { useState } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
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
    "5x Alignment Scan": "bg-cyan-50 text-cyan-500",
    "Waiting for 40x": "bg-purple-50 text-purple-500",
    "waiting for Ark": "bg-orange-50 text-orange-500",
    "waiting for dry": "bg-yellow-50 text-yellow-500",
    "awaiting dry dry": "bg-pink-50 text-pink-500",
    "Ready for Lysis": "bg-blue-50 text-blue-500",
    "Ready for Scan": "bg-indigo-50 text-indigo-500",
    "Ready for Fiducials": "bg-green-50 text-green-500",
    "Ready for Review": "bg-red-50 text-red-500",
};

export default function SamplesPage() {
    const [samplesData, setSamplesData] = useState<Sample[]>(mockSamples);
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<string>("All Statuses");
    const [sortOrder, setSortOrder] = useState<string>("Sort by Status");

    const handleRowClick = (sample: Sample) => {
        navigate(`/sample-details/${sample.id}`, { state: { sample } });
    };

    const filterOptions = ["All Statuses", "In Process", "Completed", "On Hold", "Ready for Fiducials", "Scanned"];
    const sortOptions = ["Sort by Status", "Sort by ID", "Sort by Batch"];

    const filteredSamples = filterStatus === "All Statuses"
        ? samplesData
        : samplesData.filter(s => s.status === filterStatus);

    return (
        <div className="min-h-screen w-full bg-white p-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-5xl font-bold text-gray-900">
                        Samples
                    </h1>
                    <div className="flex items-center gap-4">
                        {/* Filter Dropdown */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400 cursor-pointer"
                        >
                            {filterOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        {/* Sort Dropdown */}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400 cursor-pointer"
                        >
                            {sortOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sample Count */}
                <p className="text-gray-400 text-sm">{filteredSamples.length} samples</p>
            </div>

            {/* Samples List */}
            {/* <div className="">
                {filteredSamples.map((sample) => (
                    <div
                        key={sample.id}
                        className="bg-white border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                        onClick={() => handleRowClick(sample)}
                    >

                            <div className="flex flex-row justify-between">
                                
                                <div className="flex items-baseline mb-2">
                                    <h3 className="text-2xl font-bold text-gray-900">{sample.id}</h3>
                                    <span className="text-sm text-gray-500">{sample.customer}</span>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div>
                                        <p className="text-lg text-black font-bold">{sample.batchId}</p>
                                        <p className="text-xs text-cyan-500">Batch</p>
                                    </div>
                                    <div>
                                        <p className="text-lg text-black font-bold">{sample.slides}</p>
                                        <p className="text-xs text-cyan-500">Slides</p>
                                    </div>
                                </div>

                            <div className="flex items-center gap-6 ml-8">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${actionStatusColorMap[sample.actionStatus] || "bg-gray-100 text-gray-700"}`}>
                                    {sample.actionStatus}
                                </span>
                                <button 
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-600 hover:text-gray-800"
                                >
                                    <IoMdArrowRoundForward size={20} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}


            <div className="bg-white border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">

                    <tbody>
                        {filteredSamples.map((sample, index) => (
                            <tr
                                key={sample.id}
                                className={`border-t border-gray-100 hover:bg-gray-50 transition bg-white`}
                                onClick={() => handleRowClick(sample)}
                            >
                                <td className="flex items-baseline mb-2 px-6 py-4">
                                    <h3 className="text-2xl font-semibold text-gray-900">{sample.id}</h3>
                                    <span className="text-sm text-gray-500">{sample.customer}</span>
                                </td>
                                <td >
                                    <p className="text-lg text-black font-semibold">{sample.batchId}</p>
                                    <p className="text-xs text-cyan-500 font-semibold">Batch</p>
                                </td>
                                <td>
                                    <p className="text-lg text-black font-semibold">{sample.slides}</p>
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