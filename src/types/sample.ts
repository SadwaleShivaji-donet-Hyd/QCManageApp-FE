export type SampleStatus =
  | "Requested"
  | "5x Alignment Scan"
  | "Waiting for 40x"
  | "Ready for Lysis"
  | "Ready for Review"
  | "Ready for Mask"
  | "Ready for Fiducials"
  | "PrintMatch Processing"
  | "Checkfile Review"
  | "Fiducial Printing"
  | "Mask Printing"
  | "Complete";

export interface Sample {
  id: string;
  customer: string;
  batchId: string;
  slideCount: number;
  limsId?: string;
  status: SampleStatus;
  receivedDate: string;
}

export interface Slide {
  id: string;
  status: SampleStatus;
  hasWarning?: boolean;
}

export interface LogEntry {
  type: "Slide" | "Sample";
  entityId: string;
  action: string;
  user: string;
  timestamp: string;
}

export const WORKFLOW_STEPS: SampleStatus[] = [
  "Requested",
  "Ready for Lysis",
  "Ready for Mask",
  "Ready for Fiducials",
  "5x Alignment Scan",
  "Waiting for 40x",
  "PrintMatch Processing",
  "Checkfile Review",
  "Fiducial Printing",
  "Mask Printing",
  "Complete",
];
