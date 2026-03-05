import { ChevronRight, TriangleAlert, FileText, Eye, Upload, X, ChevronDown } from "lucide-react";
import ProgressStepper from "../components/ProgressSampleStepper";
import { mockFiles } from "../data/mockData";
import { mockSlides } from "../data/mockData";
import { useParams } from "react-router-dom";
import type { Slide } from "../types/sample";
import ProgressSlideStepper from "../components/ProgressSlideStepper";
import { useState } from "react";
import { SLIDE_STATUS_ORDER, type SlideStatus } from "../types/slide";

interface SlideDetailsProps {
  sampleId: string;
  slideId: string;
  status: string;
}

const ZoomIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#2c2c2c]"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
    <line x1="11" x2="11" y1="8" y2="14" />
    <line x1="8" x2="14" y1="11" y2="11" />
  </svg>
)

const SlideDetails = () => {
  const params = useParams();
  const sampleId = params.sampleId || "Unknown";
  const slideId = params.slideId || "Unknown";
  const slides = mockSlides[sampleId] || [];
  const selectedSlide = slides.find((slide) => slide.id === slideId);
  const [currentStatus, setCurrentStatus] = useState<SlideStatus>(
    selectedSlide?.status as SlideStatus
  ); const [uploadOptions, setUploadOptions] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [markProblemVisible, setMarkProblemVisible] = useState(false);
  const [problemType, setProblemType] = useState("");
  const [showProblemDropdown, setShowProblemDropdown] = useState(false);
  const [problemNote, setProblemNote] = useState("");
  const [showLog, setShowLog] = useState(false);
  const [isExcluded, setIsExcluded] = useState(false);
  const [exclusionReason, setExclusionReason] = useState<string | null>(null);

  const SampleInfoCard = ({
    sampleId,
    batchId,
    slides,
    customer,
    received,
    limsId,
  }: {
    sampleId: string;
    batchId: string;
    slides: number;
    customer: string;
    received: string;
    limsId: string;
  }) => {
    return (
      <div className="bg-white border border-[#CBD5E1] rounded-lg px-8 py-5 mb-8">
        <div className="flex items-center gap-12">

          <div className="flex flex-col gap-1">
            <span className="text-[#4338E0] cursor-pointer hover:underline font-semibold">
              {sampleId}
            </span>
            <span className="text-[#00ACC1] text-sm">Sample</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[#4338E0] cursor-pointer hover:underline font-semibold">
              {batchId}
            </span>
            <span className="text-[#00ACC1] text-sm">Batch</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-semibold">{slides}</span>
            <span className="text-[#00ACC1] text-sm">Slides</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-semibold">{customer}</span>
            <span className="text-[#00ACC1] text-sm">Customer</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-semibold">{received}</span>
            <span className="text-[#00ACC1] text-sm">Received</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-semibold">{limsId}</span>
            <span className="text-[#00ACC1] text-sm">LIMS ID</span>
          </div>

        </div>
      </div>
    );
  };

  const problemOptions = [
    "Damaged during processing",
    "Poor tissue quality",
    "Insufficient tissue",
    "Labeling error",
    "Contamination",
    "Equipment malfunction",
    "Other",
  ]

  const ORDERED_STATUSES = Object.entries(SLIDE_STATUS_ORDER)
    .sort((a, b) => a[1] - b[1])
    .map(([status]) => status as SlideStatus);

  const getNextStatus = (status: SlideStatus): SlideStatus | null => {
    const currentOrder = SLIDE_STATUS_ORDER[status];

    const next = Object.entries(SLIDE_STATUS_ORDER).find(
      ([, order]) => order === currentOrder + 1
    );

    return next ? (next[0] as SlideStatus) : null;
  };

  const handleApprove = () => {
    const next = getNextStatus(currentStatus);
    if (next) setCurrentStatus(next);
  };

  const handleReject = () => {
    const prev = getPreviousStatus(currentStatus);
    if (prev) setCurrentStatus(prev);
  };

  const handleExclude = (reason: string) => {
    setIsExcluded(true);
    setExclusionReason(reason);
  };

  const getPreviousStatus = (status: SlideStatus): SlideStatus | null => {
    const currentOrder = SLIDE_STATUS_ORDER[status];

    const prev = Object.entries(SLIDE_STATUS_ORDER).find(
      ([, order]) => order === currentOrder - 1
    );

    return prev ? (prev[0] as SlideStatus) : null;
  };


  const renderSlideLog = () => {
    if (!showLog) return null;

    const currentOrder = SLIDE_STATUS_ORDER[currentStatus];

    return (
      <div className="bg-[#f9f9f9] border border-[#d9d9d9] rounded-lg p-6 mb-8">
        <h3 className="text-lg mb-4 font-semibold">Slide Log</h3>

        <div className="space-y-2 text-sm">
          {ORDERED_STATUSES.map((status) => {
            const order = SLIDE_STATUS_ORDER[status];
            const isCompleted = order <= currentOrder;

            return (
              <div
                key={status}
                className={`flex items-center gap-3 ${isCompleted ? "" : "text-[#b3b3b3]"
                  }`}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#d9d9d9]" />
                )}

                <span className="text-[#757575] w-[120px]">
                  {isCompleted ? "02/1X/26" : "-"}
                </span>

                <span>{status}</span>

                <span className="ml-auto text-[#757575]">
                  {isCompleted ? "Lindsay L" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAlert = () => {

    if (isExcluded) {
      return (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl px-6 py-4 mb-6 flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500 shrink-0"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>

          <div className="flex-1">
            <span className="text-red-700 font-semibold">
              This slide has been excluded
            </span>
            <span className="text-red-600 ml-2">
              — {exclusionReason}
            </span>
          </div>
        </div>
      );
    }

    const order = SLIDE_STATUS_ORDER[currentStatus];

    // 1–3 → no alert
    if (order <= 3) return null;

    if (order === 4) {
      return (
        <AlertLayout
          message="Waiting for 40x Scan & Annotation Files"
          actions={
            <>
              <button className="px-4 py-2 rounded-lg hover:text-[#06748c]">
                Recheck Folder
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#4338E0] text-white hover:bg-[#3730B8]">
                Upload Files
              </button>
            </>
          }
        />
      );
    }

    if (order === 5) {
      return (
        <AlertLayout
          message="Ready for Fiducial Printing"
          actions={
            <MarkCompleteButton />
          }
        />
      );
    }

    if (order === 6) {
      return (
        <AlertLayout
          message="Ready for 5x Alignment Scan"
          actions={
            <button
              className="px-4 py-2 rounded-lg bg-[#4338E0] text-white hover:bg-[#3730B8]"
            >
              Upload Scan
            </button>
          }
        />
      );
    }

    if (order === 7) {
      return (
        <AlertLayout
          message="PrintMatch Processing in progress"
          actions={<MarkCompleteButton />}
        />
      );
    }

    if (order === 8) {
      return (
        <AlertLayout
          message={
            <>
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  // optional: open checkfile image
                  setSelectedImage("/mock/checkfile.png");
                }}
              >
                Checkfile.png
              </span>{" "}
              is ready for Review
            </>
          }
          actions={
            <>
              <button
                onClick={handleReject}
                className="px-4 py-2 hover:text-[#06748c]"
              >
                Reject Checkfile
              </button>

              <button
                onClick={handleApprove}
                className="px-4 py-2 rounded-lg bg-[#2c2c2c] text-white hover:bg-[#1e1e1e]"
              >
                Approve Checkfile
              </button>
            </>
          }
        />
      );
    }

    if (order === 9) {
      return (
        <AlertLayout
          message="Ready for Mask Printing"
          actions={<MarkCompleteButton />}
        />
      );
    }

    if (order === 10) {
      return (
        <AlertLayout
          message="Ready for Lysis"
          actions={<MarkCompleteButton />}
        />
      );
    }

    if (order === 11) {
      return (
        <div className="flex items-center gap-3 mb-8">
          {!isArchived ? (
            <button
              onClick={() => setIsArchived(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {/* Archive Icon */}
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
              >
                <rect width="20" height="5" x="2" y="3" rx="1" />
                <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                <path d="M10 12h4" />
              </svg>
              <span>Archive Slide</span>
            </button>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-600 rounded-lg">
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
              >
                <rect width="20" height="5" x="2" y="3" rx="1" />
                <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                <path d="M10 12h4" />
              </svg>
              <span>Archived</span>
            </span>
          )}
        </div>
      );
    }

    return null;
  };

  const AlertLayout = ({
    message,
    actions,
  }: {
    message: React.ReactNode;
    actions: React.ReactNode;
  }) => (
    <div className="bg-[#E0F7FA] border-4 border-[#00ACC1] rounded-xl px-6 py-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* <Eye size={20} /> */}
        <span className="font-semibold">{message}</span>
      </div>

      <div className="flex items-center gap-3">
        {actions}
      </div>
    </div>
  );

  const MarkCompleteButton = () => (
    <button
      onClick={() => {
        const next = getNextStatus(currentStatus);
        if (next) setCurrentStatus(next);
      }}
      className="px-4 py-2 rounded-lg bg-[#4338E0] text-white hover:bg-[#3730B8]"
    >
      Mark Complete
    </button>
  );


  return (
    <div className="px-8 py-8 mx-18 my-4 relative">

      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-4 flex-wrap text-sm">
        <button className="underline hover:text-[#06748c]">Samples</button>
        <ChevronRight size={14} className="text-[#757575]" />
        <button className="underline hover:text-[#06748c]">
          Sample {sampleId}
        </button>
        <ChevronRight size={14} className="text-[#757575]" />
        <span className="font-semibold">Slide {slideId}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[36px] font-bold tracking-tight">
          Slide {slideId}
        </h1>

        <div className="flex items-center gap-3">
          {!isExcluded ? (
            <button className="flex cursor-pointer items-center gap-2 text-red-600 hover:text-red-700"
              onClick={() => setMarkProblemVisible(true)}>
              <TriangleAlert size={16} />
              Problem with Slide
            </button>) :
            <span className="flex cursor-pointer items-center gap-2 text-red-600 hover:text-red-700">
              <div className="rounded-full border border-red-500 shrink-0 w-4 h-4 flex items-center justify-center overflow-hidden">

                <X size={10} className="text-red" strokeWidth={3} />

              </div>
              <span className="flex items-center gap-2 font-semibold text-lg text-red-600 hover:text-red-700">
                Excluded
              </span>
            </span>
          }


          <button
            onClick={() => setShowLog((prev) => !prev)}
            className="flex items-center gap-2 hover:text-[#06748c]"
          >
            <FileText size={16} />
            Slide Log
          </button>

        </div>
      </div>

      {/* Progress Stepper */}
      <div className="mb-6">
        <ProgressSlideStepper currentStatus={currentStatus}
          isExcluded={isExcluded}

        />
      </div>

      {/* Alert */}
      {renderAlert()}

      {renderSlideLog()}

      <SampleInfoCard
        sampleId="0789456621"
        batchId="003818856"
        slides={8}
        customer="Stanford Med"
        received="02/10/26"
        limsId="18548028123"
      />

      {/* Alert */}
      {/* <div className="bg-[#e6e6e6] border-4 border-[#757575] rounded-xl px-6 py-4 mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Eye size={20} />
          <span className="font-semibold">
            Waiting for 40x Scan & Annotation Files
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg hover:text-[#06748c]">
            Recheck Folder
          </button>

          <button className="px-4 py-2 rounded-lg bg-[#2c2c2c] text-white hover:bg-[#1e1e1e]">
            Upload Files
          </button>
        </div>

      </div> */}

      {/* Files */}
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-[28px]">Files</h2>

        <button className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:bg-[#f5f5f5]"
          onClick={() => setUploadOptions(true)}>
          <Upload size={14} />
          Upload File
        </button>
        {uploadOptions && (
          <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-[500px] max-w-[90vw]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9d9d9]">
                <h3 className="text-lg font-semibold">Simulate File Upload</h3>
                <button onClick={() => setUploadOptions(false)}
                  className="text-[#757575] hover:text-[#1e1e1e] cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m15 9-6 6"></path>
                    <path d="m9 9 6 6"></path>
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-sm text-[#757575] mb-4">Select a file type to simulate uploading. In production, this would connect to your file system.</p>
                {[
                  {
                    name: "40x Scan.tiff",
                    desc: "High resolution scan image"
                  },
                  {
                    name: "Annotations.JSON",
                    desc: "Region annotations file"
                  },
                  {
                    name: "5x Fiducial Scan.svs",
                    desc: "Fiducial alignment scan"
                  },
                  {
                    name: "Checkfile.png",
                    desc: "Print quality checkfile"
                  }
                ].map(file => (
                  <button
                    key={file.name}
                    onClick={() => {
                      console.log("Uploading:", file.name);
                      setUploadOptions(false);
                    }}
                    className="w-full cursor-pointer text-left px-4 py-3 border border-[#d9d9d9] rounded-lg hover:bg-[#f5f5f5] transition flex items-center gap-3"
                  >
                    <span className="text-lg">＋</span>

                    <div>
                      <span className="font-medium">{file.name}</span>
                      <p className="text-xs font-semibold text-[#757575]">{file.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        )}
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">

        {mockFiles.map((file) => (
          <div
            key={file.name}
            className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md group"
          >
            <div className="h-[180px] bg-[#f5f5f5] relative overflow-hidden">

              {/* <img
                src={file.image}
                alt={file.name}
                className="w-full h-full object-cover"
              /> */}

              <img
                src={file.image}
                alt={file.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => {
                  setSelectedImage(file.image);
                  setZoom(1);
                }}
              />

              <div className="absolute pointer-events-none inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition bg-white/80 rounded-full p-3">
                  <ZoomIcon />
                </div>
              </div>

            </div>

            <div className="px-3 py-2">
              <span className="text-sm">{file.name}</span>
            </div>

          </div>
        ))}

      </div>

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
                onClick={() => handleExclude(problemType || "")}
                className={`flex-1 py-3 rounded-lg text-white border border-[#757575]
               ${problemType ? "bg-black" : "bg-[#757575]"}`}
              >
                Exclude Slide
              </button>
            </div>

          </div>

        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-[90vw] h-[85vh] overflow-hidden cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Layer */}
            <div className="relative w-full h-full ">
              <div className="w-full h-full flex overflow-hidden rounded-3xl bg-white px-0 mx-0 items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full max-h-full object-cover transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "center center",
                  }}
                />
              </div>
            </div>

            {/* Bottom LEFT Controls */}
            <div className="absolute bottom-4 left-4 flex gap-2 z-20">
              <button className="p-2.5 rounded-lg border border-[#d9d9d9] shadow bg-white/60 hover:bg-white transition">
                {/* Split Icon */}
                <ChevronRight className="rotate-90" size={20} />
              </button>

              <button className="p-2.5 rounded-lg border border-[#d9d9d9] shadow bg-white/60 hover:bg-white transition">
                {/* Layers Icon */}
                <FileText size={20} />
              </button>
            </div>

            {/* Bottom RIGHT Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              <button
                onClick={() => setZoom((z) => z + 0.2)}
                className="p-3 rounded-lg border border-[#d9d9d9] shadow bg-white/60 hover:bg-white transition"
              >
                <ZoomIcon />
              </button>

              <button
                onClick={() => setZoom((z) => Math.max(0.2, z - 0.2))}
                className="p-3 rounded-lg border border-[#d9d9d9] shadow bg-white/60 hover:bg-white transition"
              >
                {/* Zoom Out Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#2c2c2c]"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  <line x1="8" x2="14" y1="11" y2="11" />
                </svg>
              </button>
            </div>

            {/* Zoom Percentage Indicator */}
            <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-md text-sm font-medium z-20">
              {Math.round(zoom * 100)}%
            </div>
            <div
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white px-2 py-2 rounded-[100%] text-sm font-medium z-20">
              <X />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideDetails;