import { useState } from "react";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  ScanBarcode,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  CircleAlert,
  Tag,
} from "lucide-react";

import { Upload } from "lucide-react";
import {
  createSample,
  createSlide,
  createBatch,
} from "../services/batchService";
import { logger } from "../utils/logger";

interface Slide {
  id: string; // local UI id
  slideId: string; // API slide_id
  tags?: string[];
}

interface Sample {
  id: string; // local UI id
  sampleId: string; // API sample_id
  slides: Slide[];
  expanded: boolean;
}

interface NewAccessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewAccessionModal = ({ open, onOpenChange }: NewAccessionModalProps) => {
  const [customer, setCustomer] = useState("");
  const [orderId, setOrderId] = useState("");
  const [receivedOn, setReceivedOn] = useState("");
  const [showNotesDropdown, setShowNotesDropdown] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [scanningSampleId, setScanningSampleId] = useState<string | null>(null);
  const [scanValue, setScanValue] = useState("");
  const [activeTagSlideId, setActiveTagSlideId] = useState<string | null>(null);

  const noteOptions = [
    "Box damaged",
    "Not stored properly",
    "Box opened",
    "Missing sample",
    "No customer name",
    "Incomplete paperwork",
    "Temperature compromised",
    "Late delivery",
  ];

  const slideTagOptions = [
    "Slide dropped",
    "Coverslip missing",
    "Slide missing",
    "Slide cracked",
    "Label damaged",
    "Tissue missing",
    "Staining issue",
    "Wrong orientation",
  ];

  // Step Management
  const [currentStep, setCurrentStep] = useState(1);

  // API and Error Handling States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Helper function to generate unique random IDs
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  const [samples, setSamples] = useState<Sample[]>([
    {
      id: generateId(),
      sampleId: generateId().toUpperCase().substring(0, 8), // Pre-fill with random sample ID
      slides: [],
      expanded: true,
    },
  ]);

  if (!open) return null;

  const totalSlides = samples.reduce((acc, s) => acc + s.slides.length, 0);

  // Validation function
  const validateForm = (): boolean => {
    if (!customer.trim()) {
      setError("Customer name is required");
      return false;
    }

    if (!orderId.trim()) {
      setError("Order ID is required");
      return false;
    }

    if (!receivedOn.trim()) {
      setError("Received date is required");
      return false;
    }

    if (!samples.length) {
      setError("At least one sample required");
      return false;
    }

    for (const sample of samples) {
      if (!sample.sampleId.trim()) {
        setError("All samples must have Sample ID");
        return false;
      }

      for (const slide of sample.slides) {
        if (!slide.slideId.trim()) {
          setError("All slides must have Slide ID");
          return false;
        }
      }
    }

    return true;
  };

  // Move to review step
  const handleNext = () => {
    setError(null);

    // Validate form first
    if (!validateForm()) {
      return;
    }

    logger.info("Moving to review step");
    // Move to step 2 (Review)
    setCurrentStep(2);
  };

  // Go back to details step
  const handleBack = () => {
    logger.info("Going back to details step");
    setCurrentStep(1);
    setError(null);
  };

  // API submission handler - Create Accession from Review step
  const handleCreateAccession = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1️⃣ Create samples and slides
      for (const sample of samples) {
        await createSample(sample.sampleId);

        for (const slide of sample.slides) {
          await createSlide(sample.sampleId, slide.slideId);
        }
      }

      // 2️⃣ Create batch
      const batchResponse = await createBatch(samples.map((s) => s.sampleId));

      if (batchResponse.error) {
        setError(batchResponse.details || batchResponse.error);
        setIsLoading(false);
        return;
      }

      setSuccess(true);

      // Reset form
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to create accession");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentStep(1);
    setCustomer("");
    setOrderId("");
    setReceivedOn("");
    setSelectedNotes([]);
    setShowNotesDropdown(false);
    setSamples([
      {
        id: generateId(),
        sampleId: "",
        slides: [],
        expanded: true,
      },
    ]);
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      setSuccess(false);
      setCurrentStep(1);
      onOpenChange(false);
    }
  };

  const addSample = () => {
    setSamples((prev) => [
      ...prev,
      {
        id: generateId(),
        sampleId: "",
        slides: [],
        expanded: true,
      },
    ]);
  };

  const addSlide = (sampleLocalId: string) => {
    const newId = generateId();

    setSamples((prev) =>
      prev.map((s) =>
        s.id === sampleLocalId
          ? {
              ...s,
              slides: [
                ...s.slides,
                {
                  id: newId,
                  slideId: "",
                },
              ],
            }
          : s,
      ),
    );

    // Automatically open scan mode
    setScanningSampleId(sampleLocalId);
  };

  const toggleSample = (sampleId: string) => {
    setSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId ? { ...s, expanded: !s.expanded } : s,
      ),
    );
  };

  const removeSample = (sampleId: string) => {
    setSamples((prev) => prev.filter((s) => s.id !== sampleId));
  };

  const removeSlide = (sampleId: string, slideId: string) => {
    setSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? {
              ...s,
              slides: s.slides.filter((sl) => sl.id !== slideId),
            }
          : s,
      ),
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-[720px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col mt-[5vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#e6e6e6] shrink-0">
          <h2 className="text-[28px] tracking-tight font-bold leading-[1.2]">
            New Accession
          </h2>

          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-[#f5f5f5] text-[#757575] hover:text-[#1e1e1e] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {/* Success Message */}
          {success && (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">
                Accession created successfully! Redirecting...
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center gap-4 px-8 py-4 shrink-0 border-b border-[#f0f0f0]">
              {/* Details */}
              <div
                className={`px-3 py-1 rounded text-sm ${
                  currentStep === 1
                    ? "bg-[#1e1e1e] text-white"
                    : "bg-[#e6e6e6] text-[#2c2c2c]"
                }`}
              >
                Details
              </div>

              {/* Progress Line */}
              <div className="flex-1 h-px bg-[#d9d9d9] relative">
                <div
                  className="absolute inset-y-0 left-0 bg-[#1e1e1e]"
                  style={{
                    width: currentStep === 2 ? "100%" : "50%",
                    height: "2px",
                    top: "-0.5px",
                  }}
                />
              </div>

              {/* Review */}
              <div
                className={`px-3 py-1 rounded text-sm ${
                  currentStep === 2
                    ? "bg-[#1e1e1e] text-white"
                    : "bg-[#e6e6e6] text-[#2c2c2c]"
                }`}
              >
                Review
              </div>
            </div>
          </div>

          {/* STEP 1: DETAILS */}
          {currentStep === 1 && (
            <div>
              {/* Customer + Order */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      Customer
                    </label>
                    <input
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      placeholder="e.g. Kaiser Clinic"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black outline-none transition-colors"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      Order ID
                    </label>
                    <input
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g. 1854802893"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-gray-500 mb-1">
                    Received On
                  </label>
                  <input
                    type="datetime-local"
                    value={receivedOn}
                    onChange={(e) => setReceivedOn(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black outline-none"
                  />
                </div>
              </div>

              {/* Accession Notes */}
              <div className="mt-4 relative px-8">
                <div className="flex items-center gap-2 mb-2">
                  <CircleAlert size={16} className="text-[#757575]" />
                  <label className="text-sm text-[#757575]">
                    Accession Notes
                  </label>
                </div>

                {/* Add Note Button */}
                <button
                  type="button"
                  onClick={() => setShowNotesDropdown(!showNotesDropdown)}
                  className="flex items-center gap-2 rounded-md border border-dashed px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  <Plus size={14} />
                  Add Note
                </button>

                {/* Dropdown */}
                {showNotesDropdown && (
                  <div className="absolute mt-2 w-64 rounded-md border bg-white shadow-lg max-h-48 overflow-y-auto z-50">
                    {noteOptions.map((note) => (
                      <div
                        key={note}
                        onClick={() => {
                          if (!selectedNotes.includes(note)) {
                            setSelectedNotes([...selectedNotes, note]);
                          }
                          setShowNotesDropdown(false);
                        }}
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Notes Display */}
                {selectedNotes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedNotes.map((note) => (
                      <span
                        key={note}
                        className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 border border-yellow-300"
                      >
                        {note}
                        <button
                          onClick={() =>
                            setSelectedNotes(
                              selectedNotes.filter((n) => n !== note),
                            )
                          }
                          className="text-yellow-600 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Samples */}
              <div className="border-t border-[#e6e6e6] pt-6 mt-6 px-8">
                <h3 className="text-[20px] font-semibold tracking-tight mb-4">
                  Samples
                </h3>
                {/* sample card container */}
                <div className="mb-4">
                  {samples.map((sample) => (
                    <div
                      key={sample.id}
                      className="mb-4 bg-[#fafafa] border border-[#e6e6e6] rounded-xl overflow-hidden"
                    >
                      {/* Sample Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-[#f5f5f5]">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-[#757575] hover:text-[#1e1e1e]"
                            onClick={() => toggleSample(sample.id)}
                          >
                            {sample.expanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>

                          <span className="text-[16px] font-semibold">
                            Sample
                          </span>
                          <input
                            value={sample.sampleId}
                            onChange={(e) =>
                              setSamples((prev) =>
                                prev.map((s) =>
                                  s.id === sample.id
                                    ? { ...s, sampleId: e.target.value }
                                    : s,
                                ),
                              )
                            }
                            placeholder="Scan or type Sample ID"
                            className="bg-transparent outline-none border-b border-transparent hover:border-[#d9d9d9] focus:border-[#1e1e1e] w-[140px] text-[16px] font-semibold"
                          />

                          <span className="text-xs text-gray-500">
                            ({sample.slides.length} slide
                            {sample.slides.length !== 1 ? "s" : ""})
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            title="Import slide list from file"
                            className="flex items-center gap-1.5 px-2.5 py-1 border border-[#d9d9d9] rounded-lg text-xs hover:bg-white transition-colors"
                          >
                            <Upload size={12} />
                            Import
                          </button>
                          <button
                            onClick={() => removeSample(sample.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Slides Dropdown */}
                      {sample.expanded && (
                        <div className="border-t border-[#e6e6e6] px-4 py-4 space-y-4">
                          {/* Slides */}
                          {sample.slides.map((slide) => (
                            <div
                              key={slide.id}
                              className="bg-white border border-[#e6e6e6] rounded-lg px-3 py-2"
                            >
                              {/* Top Row */}
                              <div className="flex items-center justify-between">
                                {/* Slide ID */}
                                <span className="text-sm font-medium text-gray-800">
                                  {slide.slideId}
                                </span>

                                {/* Right Controls */}
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    className="px-2 py-0.5 border border-[#d9d9d9] rounded text-xs cursor-pointer transition-colors whitespace-nowrap hover:bg-[#f5f5f5]"
                                  >
                                    Annotations
                                  </button>

                                  <button
                                    type="button"
                                    className="px-2 py-0.5 border border-[#d9d9d9] rounded text-xs cursor-pointer transition-colors whitespace-nowrap hover:bg-[#f5f5f5]"
                                  >
                                    40x Scan
                                  </button>

                                  {/* Tag Icon */}
                                  <div className="relative">
                                    <button
                                      type="button"
                                      title="Add tag"
                                      onClick={() =>
                                        setActiveTagSlideId(
                                          activeTagSlideId === slide.id
                                            ? null
                                            : slide.id,
                                        )
                                      }
                                      className="p-1 rounded cursor-pointer transition-colors text-[#b3b3b3] hover:text-[#757575] hover:bg-[#f5f5f5]"
                                    >
                                      <Tag size={14} strokeWidth={2} />
                                    </button>

                                    {activeTagSlideId === slide.id && (
                                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                                        {slideTagOptions.map((tag) => (
                                          <div
                                            key={tag}
                                            onClick={() => {
                                              setSamples((prev) =>
                                                prev.map((s) =>
                                                  s.id === sample.id
                                                    ? {
                                                        ...s,
                                                        slides: s.slides.map(
                                                          (sl) =>
                                                            sl.id === slide.id
                                                              ? {
                                                                  ...sl,
                                                                  tags: sl.tags?.includes(
                                                                    tag,
                                                                  )
                                                                    ? sl.tags
                                                                    : [
                                                                        ...(sl.tags ||
                                                                          []),
                                                                        tag,
                                                                      ],
                                                                }
                                                              : sl,
                                                        ),
                                                      }
                                                    : s,
                                                ),
                                              );
                                              setActiveTagSlideId(null);
                                            }}
                                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                          >
                                            {tag}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() =>
                                      removeSlide(sample.id, slide.id)
                                    }
                                    className="text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* 🔥 TAGS BELOW SLIDE ID */}
                              {slide.tags && slide.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {slide.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 
             bg-amber-50 border border-amber-200 
             text-amber-700 rounded text-xs 
             cursor-pointer hover:bg-amber-100 transition-colors"
                                    >
                                      {tag}
                                      <button
                                        onClick={() => {
                                          setSamples((prev) =>
                                            prev.map((s) =>
                                              s.id === sample.id
                                                ? {
                                                    ...s,
                                                    slides: s.slides.map(
                                                      (sl) =>
                                                        sl.id === slide.id
                                                          ? {
                                                              ...sl,
                                                              tags: sl.tags?.filter(
                                                                (t) =>
                                                                  t !== tag,
                                                              ),
                                                            }
                                                          : sl,
                                                    ),
                                                  }
                                                : s,
                                            ),
                                          );
                                        }}
                                        className="text-orange-500 hover:text-red-500"
                                      >
                                        ✕
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Bottom Action Row */}
                          <div className="mt-4 flex items-center justify-center gap-3">
                            {scanningSampleId === sample.id ? (
                              <>
                                <input
                                  autoFocus
                                  value={scanValue}
                                  onChange={(e) => setScanValue(e.target.value)}
                                  placeholder="Scan or type, Enter..."
                                  className="px-3 py-2 border border-[#d9d9d9] rounded-lg text-sm w-64 outline-none focus:border-[#1e1e1e]"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && scanValue.trim()) {
                                      setSamples((prev) =>
                                        prev.map((s) =>
                                          s.id === sample.id
                                            ? {
                                                ...s,
                                                slides: [
                                                  ...s.slides,
                                                  {
                                                    id: generateId(),
                                                    slideId: scanValue.trim(),
                                                    tags: [],
                                                  },
                                                ],
                                              }
                                            : s,
                                        ),
                                      );
                                      setScanValue("");
                                      setScanningSampleId(null);
                                    }
                                  }}
                                />

                                <button
                                  onClick={() => {
                                    setScanValue("");
                                    setScanningSampleId(null);
                                  }}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setScanningSampleId(sample.id)}
                                  className="flex items-center gap-2 px-4 py-2 border border-[#d9d9d9] rounded-lg text-sm hover:bg-white transition-colors"
                                >
                                  <ScanBarcode size={16} />
                                  Scan barcode
                                </button>

                                <button
                                  onClick={() => {
                                    const newId = generateId()
                                      .toUpperCase()
                                      .substring(0, 8);

                                    setSamples((prev) =>
                                      prev.map((s) =>
                                        s.id === sample.id
                                          ? {
                                              ...s,
                                              slides: [
                                                ...s.slides,
                                                {
                                                  id: generateId(),
                                                  slideId: newId,
                                                  tags: [],
                                                },
                                              ],
                                            }
                                          : s,
                                      ),
                                    );
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 border border-[#d9d9d9] rounded-lg text-sm hover:bg-white transition-colors"
                                >
                                  <Plus size={16} />
                                  Add Slide
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-center pb-6">
                  <button
                    onClick={addSample}
                    className="flex items-center gap-2 px-4 py-2 
             bg-[#e3e3e3] border border-[#767676] 
             rounded-lg cursor-pointer 
             hover:bg-[#d5d5d5] transition-colors text-sm"
                  >
                    <Plus size={14} />
                    Add Sample
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: REVIEW ACCESSION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Accession Header */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Review Accession
                </h3>
              </div>

              {/* Customer Info */}
              <div className="rounded-2xl border-t border-gray-300 bg-gray-100/60 p-6 shadow-sm">
                {/* Top Grid */}
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Customer</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {customer || "Not specified"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Order ID</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {orderId || "Not specified"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Received On
                    </div>
                    <div className="text-md font-semibold text-gray-900">
                      {receivedOn
                        ? new Date(receivedOn).toLocaleString()
                        : "Not specified"}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 border-t border-gray-300" />

                {/* Notes Section */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Notes</div>

                  {selectedNotes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedNotes.map((note) => (
                        <span
                          key={note}
                          className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 border border-yellow-300"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">No notes added</div>
                  )}
                </div>
              </div>

              {/* Samples Summary */}
              <div className="space-y-4">
                {samples.map((sample) => (
                  <div
                    key={sample.id}
                    className="rounded-xl border-t border-gray-200 bg-white shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3  bg-gray-50 rounded-t-xl">
                      <span className="font-semibold text-gray-800">
                        Sample {sample.sampleId || "—"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {sample.slides.length} slide
                        {sample.slides.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Slides */}
                    <div className="px-4 py-4">
                      {sample.slides.length > 0 ? (
                        <>
                          {/* Slide Pills */}
                          <div className="flex flex-wrap gap-3">
                            {sample.slides.map((slide) => (
                              <div
                                key={slide.id}
                                className="bg-gray-100 rounded-lg px-3 py-2"
                              >
                                {/* Slide ID */}
                                <div className="text-sm font-medium text-gray-800">
                                  {slide.slideId || "Slide —"}
                                </div>

                                {/* Tags */}
                                {slide.tags && slide.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {slide.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="nline-flex items-center gap-1 px-2 py-0.5 
             bg-amber-50 border border-amber-200 
             text-amber-700 rounded text-xs 
             cursor-pointer hover:bg-amber-100 transition-colors"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400">
                          No slides added
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="rounded-md border border-gray-200 bg-gray-100 px-4 py-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Total Samples:</span>
                  <span className="font-medium">{samples.length}</span>
                </div>

                <div className="mt-1 flex justify-between text-gray-700">
                  <span>Total Slides:</span>
                  <span className="font-medium">{totalSlides}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-[#e6e6e6] shrink-0 bg-white">
          {currentStep === 1 ? (
            <>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-5 py-2 cursor-pointer hover:text-[#06748c] transition-colors"
              >
                Cancel
              </button>

              <span className="text-sm text-[#757575]">
                {samples.length} sample
                {samples.length !== 1 ? "s" : ""}, {totalSlides} slide
                {totalSlides !== 1 ? "s" : ""}
              </span>

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#1e1e1e] text-white rounded-lg cursor-pointer hover:bg-[#333] transition-colors"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="px-5 py-2 cursor-pointer hover:text-[#06748c] transition-colors"
              >
                Back
              </button>

              <span className="text-xs text-gray-500">
                {samples.length} sample
                {samples.length !== 1 ? "s" : ""}, {totalSlides} slide
                {totalSlides !== 1 ? "s" : ""}
              </span>

              <button
                onClick={handleCreateAccession}
                disabled={isLoading || success}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                {isLoading
                  ? "Creating..."
                  : success
                    ? "Done"
                    : "Create Accession"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewAccessionModal;
