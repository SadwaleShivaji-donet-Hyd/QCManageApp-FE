import type { SlideStatus } from "./slide";

export type SampleStatus =
  "No Slides"|
"Waiting for files"|
"Ready to Process"|
"Preparing"|
"Ready for Fiducials"|
"Ready for 5x Scan"|
"PrintMatch Processing"|
"Ready for PrintMatch Review"|
"Ready for Print"|
"Printing"|
"Ready for Lysis"|
"In Lysis"|
"Ready to Deliver"|
"Complete"

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
  status: SlideStatus;
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
