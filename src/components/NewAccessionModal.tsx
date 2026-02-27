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
} from "lucide-react";
import {
  createSample,
  createSlide,
  createBatch,
} from "../services/batchService";
import { useToast } from "../context/ToastContext";
import { logger } from "../utils/logger";

interface Slide {
  id: string;
  barcode: string;
  annotations: boolean;
  scanTime: string;
}

interface Sample {
  id: string;
  barcode: string;
  slides: Slide[];
  expanded: boolean;
}

interface NewAccessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewAccessionModal = ({ open, onOpenChange }: NewAccessionModalProps) => {
  const { addToast } = useToast();

  const [customer, setCustomer] = useState("");
  const [orderId, setOrderId] = useState("");
  const [receivedOn, setReceivedOn] = useState("");
  const [accessionNotes, setAccessionNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  // Step Management
  const [currentStep, setCurrentStep] = useState(1);

  // API and Error Handling States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Optimistic Updates - Track created samples for retry capability
  const [createdSampleIds, setCreatedSampleIds] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<{
    current: number;
    total: number;
    stage: "samples" | "slides" | "batch" | "idle";
  }>({ current: 0, total: 0, stage: "idle" });

  // Helper function to generate unique random IDs
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  const [samples, setSamples] = useState<Sample[]>([
    {
      id: generateId(),
      barcode: "937069936",
      slides: [
        {
          id: generateId(),
          barcode: "3587438297",
          annotations: true,
          scanTime: "40x Scan",
        },
      ],
      expanded: true,
    },
  ]);

  if (!open) return null;

  const totalSlides = samples.reduce((acc, s) => acc + s.slides.length, 0);

  // Validation function
  const validateForm = (): boolean => {
    if (!customer.trim()) {
      const msg = "Customer name is required";
      logger.warn(`Validation failed: ${msg}`);
      setError(msg);
      addToast(msg, "warning", 4000);
      return false;
    }
    if (!orderId.trim()) {
      const msg = "Order ID is required";
      logger.warn(`Validation failed: ${msg}`);
      setError(msg);
      addToast(msg, "warning", 4000);
      return false;
    }
    if (!receivedOn.trim()) {
      const msg = "Received date is required";
      logger.warn(`Validation failed: ${msg}`);
      setError(msg);
      addToast(msg, "warning", 4000);
      return false;
    }
    if (samples.length === 0) {
      const msg = "At least one sample is required";
      logger.warn(`Validation failed: ${msg}`);
      setError(msg);
      addToast(msg, "warning", 4000);
      return false;
    }

    // Check if all samples have barcodes
    if (samples.some((s) => !s.barcode.trim())) {
      const msg = "All samples must have a barcode";
      logger.warn(`Validation failed: ${msg}`);
      setError(msg);
      addToast(msg, "warning", 4000);
      return false;
    }

    // Check if all slides have barcodes
    if (samples.some((s) => s.slides.some((sl) => !sl.barcode.trim()))) {
      const msg = "All slides must have a barcode";
      logger.warn(`Validation failed: ${msg}`);
      setError(msg);
      addToast(msg, "warning", 4000);
      return false;
    }

    logger.info("Form validation passed");
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
    setError(null);
    setSuccess(false);
    setIsLoading(true);
    setCreatedSampleIds([]);

    try {
      const newCreatedSampleIds: string[] = [];

      // Step 1: Create all samples
      logger.info(`Creating ${samples.length} samples`);
      setProcessingStatus({
        current: 0,
        total: samples.length,
        stage: "samples",
      });

      for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        try {
          setProcessingStatus({
            current: i + 1,
            total: samples.length,
            stage: "samples",
          });

          const sampleResponse = await createSample(sample.barcode);

          // Check if there was an error
          if (sampleResponse.error) {
            throw new Error(sampleResponse.details || sampleResponse.error);
          }

          newCreatedSampleIds.push(sampleResponse.sample_id);
          setCreatedSampleIds([...newCreatedSampleIds]);
          addToast(
            `Sample created: ${sampleResponse.sample_id}`,
            "success",
            3000,
          );

          // Step 2: Create slides for each sample
          setProcessingStatus({
            current: i + 1,
            total: samples.length,
            stage: "slides",
          });

          for (const slide of sample.slides) {
            try {
              await createSlide(sampleResponse.sample_id, slide.barcode);
              addToast(`Slide created: ${slide.barcode}`, "success", 2000);
            } catch (slideErr: unknown) {
              const slideError =
                slideErr instanceof Error
                  ? slideErr.message
                  : "Failed to create slide";
              const errorMsg = `Error creating slide ${slide.barcode}: ${slideError}`;
              logger.error(errorMsg, slideErr);
              throw new Error(errorMsg);
            }
          }
        } catch (sampleErr: unknown) {
          const sampleError =
            sampleErr instanceof Error
              ? sampleErr.message
              : "Failed to create sample";
          logger.error(`Sample creation failed: ${sampleError}`, sampleErr);
          throw new Error(sampleError);
        }
      }

      // Step 3: Create batch with all sample IDs
      logger.info(`Creating batch with ${newCreatedSampleIds.length} samples`);
      setProcessingStatus({ current: 0, total: 1, stage: "batch" });

      try {
        const batchResponse = await createBatch(newCreatedSampleIds);

        // Check if there was an error
        if (batchResponse.error) {
          logger.error(
            `Batch creation error: ${batchResponse.error}`,
            batchResponse,
          );

          // Optimistic update: Samples were created successfully, show warning for batch failure
          const warningMsg =
            batchResponse.details ||
            batchResponse.error ||
            "Batch creation failed. Samples were created but batch could not be finalized.";

          addToast(warningMsg, "warning", 7000);
          setError(
            `Batch Error: ${batchResponse.details || batchResponse.error}. Created samples: ${newCreatedSampleIds.join(", ")}`,
          );

          throw new Error(batchResponse.details || batchResponse.error);
        }

        // Batch created successfully
        logger.info(`Accession created successfully`, {
          batch_id: batchResponse.batch_id,
          slide_count: batchResponse.slide_count,
        });

        setSuccess(true);
        addToast(
          `Accession created successfully! Batch ID: ${batchResponse.batch_id}`,
          "success",
          5000,
        );

        // Reset form after successful submission
        setTimeout(() => {
          setCurrentStep(1);
          setCustomer("");
          setOrderId("");
          setReceivedOn("");
          setAccessionNotes("");
          setCreatedSampleIds([]);
          setProcessingStatus({ current: 0, total: 0, stage: "idle" });
          setSamples([
            {
              id: generateId(),
              barcode: "",
              slides: [],
              expanded: true,
            },
          ]);
          onOpenChange(false);
        }, 1500);
      } catch (batchErr: unknown) {
        const batchError =
          batchErr instanceof Error
            ? batchErr.message
            : "Failed to create batch";
        logger.error(`Batch error: ${batchError}`, batchErr);
        throw new Error(batchError);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as any)?.response?.data?.error ||
            (err as any)?.response?.data?.message ||
            "Failed to create accession. Please try again.";

      logger.error(`Accession creation failed: ${errorMessage}`, err);
      setError(errorMessage);

      // Show error toast
      addToast(errorMessage, "error", 7000);

      // If some samples were created, show option to retry batch
      if (createdSampleIds.length > 0) {
        addToast(
          `Note: ${createdSampleIds.length} samples were already created. You can try again to complete the batch.`,
          "warning",
          8000,
        );
      }
    } finally {
      setIsLoading(false);
      setProcessingStatus({ current: 0, total: 0, stage: "idle" });
    }
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
        barcode: "",
        slides: [],
        expanded: true,
      },
    ]);
  };

  const addSlide = (sampleId: string) => {
    setSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? {
              ...s,
              slides: [
                ...s.slides,
                {
                  id: generateId(),
                  barcode: "",
                  annotations: false,
                  scanTime: "40s Scan",
                },
              ],
            }
          : s,
      ),
    );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b px-6 py-5 flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">New Accession</h2>
          <button onClick={handleClose} disabled={isLoading}>
            <X className="h-5 w-5 text-gray-500 hover:text-black disabled:opacity-50" />
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

          {/* Processing Progress */}
          {isLoading && processingStatus.stage !== "idle" && (
            <div className="mb-4 rounded-lg border bg-blue-50 p-4 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Loader className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-blue-700">
                  Processing {processingStatus.stage === "samples" && "Samples"}
                  {processingStatus.stage === "slides" && "Slides"}
                  {processingStatus.stage === "batch" && "Batch"}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      processingStatus.total > 0
                        ? (processingStatus.current / processingStatus.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-2">
                {processingStatus.current} of {processingStatus.total}
              </p>
            </div>
          )}
          {/* Step Indicator */}
          <div className="mb-6 flex items-center">
            {/* DETAILS STEP */}
            <div className="flex items-center">
              {currentStep > 1 ? (
                // Completed
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white text-xs">
                  ✓
                </div>
              ) : (
                <span
                  className={`rounded-full px-4 py-1 text-xs font-medium transition ${
                    currentStep === 1
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Details
                </span>
              )}
            </div>

            {/* LINE */}
            <div className="mx-3 h-px flex-1 bg-gray-300" />

            {/* REVIEW STEP */}
            <div>
              <span
                className={`rounded-full px-4 py-1 text-xs font-medium transition ${
                  currentStep === 2
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                Review
              </span>
            </div>
          </div>

          {/* STEP 1: DETAILS */}
          {currentStep === 1 && (
            <>
              {/* Customer + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Customer
                  </label>
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="e.g. Kaiser Clinic"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Order ID
                  </label>
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="e.g. 1854802893"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
              </div>

              {/* Received On */}
              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Received On
                </label>
                <input
                  type="date"
                  className="w-48 rounded-md border px-3 py-2 text-sm"
                  value={receivedOn}
                  onChange={(e) => setReceivedOn(e.target.value)}
                />
              </div>

              {/* Notes */}
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="mt-3 text-xs text-gray-500 hover:text-black"
              >
                + Accession Notes
              </button>

              {showNotes && (
                <textarea
                  className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Add notes..."
                  value={accessionNotes}
                  onChange={(e) => setAccessionNotes(e.target.value)}
                />
              )}

              {/* Samples */}
              <div className="mt-6">
                <h3 className="text-base font-semibold text-gray-900">
                  Samples
                </h3>

                <div className="mt-3 space-y-3">
                  {samples.map((sample) => (
                    <div
                      key={sample.id}
                      className="rounded-lg border bg-gray-50"
                    >
                      {/* Sample Header */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleSample(sample.id)}>
                            {sample.expanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>

                          <span className="text-sm font-semibold">
                            Sample {sample.barcode || "—"}
                          </span>

                          <span className="text-xs text-gray-500">
                            ({sample.slides.length} slide
                            {sample.slides.length !== 1 ? "s" : ""})
                          </span>
                        </div>

                        <button
                          onClick={() => removeSample(sample.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Slides */}
                      {sample.expanded && (
                        <div className="border-t px-4 py-3">
                          {sample.slides.map((slide) => (
                            <div
                              key={slide.id}
                              className="flex items-center justify-between py-2"
                            >
                              <span className="text-sm">
                                {slide.barcode || "—"}
                              </span>

                              <div className="flex items-center gap-3">
                                <span className="rounded-full border px-2 py-0.5 text-xs text-gray-500">
                                  Annotations
                                </span>
                                <span className="rounded-full border px-2 py-0.5 text-xs text-gray-500">
                                  {slide.scanTime}
                                </span>

                                <button
                                  onClick={() =>
                                    removeSlide(sample.id, slide.id)
                                  }
                                  className="text-gray-500 hover:text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}

                          <div className="mt-3 flex items-center justify-center gap-3">
                            <button className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-100">
                              <ScanBarcode size={14} />
                              Scan barcode
                            </button>

                            <button
                              onClick={() => addSlide(sample.id)}
                              className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-100"
                            >
                              <Plus size={14} />
                              Add Slide
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={addSample}
                    className="flex items-center gap-2 rounded-md border border-black px-4 py-1.5 text-xs hover:bg-black hover:text-white"
                  >
                    <Plus size={14} />
                    Add Sample
                  </button>
                </div>
              </div>
            </>
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
              <div className="rounded-2xl border bg-gray-100/60 p-6 shadow-sm">
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
                    <div className="text-sm font-semibold text-gray-900">
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

                  {accessionNotes ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 border border-yellow-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>
                      {accessionNotes}
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
                    className="rounded-xl border bg-white shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                      <span className="font-semibold text-gray-800">
                        Sample {sample.barcode || "—"}
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
                          <div className="flex flex-wrap gap-2">
                            {sample.slides.map((slide) => (
                              <span
                                key={slide.id}
                                className="px-3 py-1 text-sm bg-gray-100 rounded-md text-gray-700"
                              >
                                {slide.barcode}
                              </span>
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
              <div className="rounded-md border bg-gray-100 px-4 py-3 text-sm">
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
        <div className="flex items-center justify-between border-t px-6 py-4">
          {currentStep === 1 ? (
            <>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="text-sm font-medium text-gray-700 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <span className="text-xs text-gray-500">
                {samples.length} sample
                {samples.length !== 1 ? "s" : ""}, {totalSlides} slide
                {totalSlides !== 1 ? "s" : ""}
              </span>

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-md bg-black px-6 py-2 text-sm text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="text-sm font-medium text-gray-700 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
