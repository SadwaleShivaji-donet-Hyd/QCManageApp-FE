export const SLIDE_WORKFLOW_STEPS = [
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
] as const;

export type SlideStatus = typeof SLIDE_WORKFLOW_STEPS[number];

export const SLIDE_STATUS_ORDER: Record<SlideStatus, number> = {
  "Requested": 1,
  "Intake": 2,
  "Received": 3,
  "Waiting for 40x": 4,
  "Fiducial Printing": 5,
  "5x Alignment Scan": 6,
  "PrintMatch Processing": 7,
  "Checkfile Review": 8,
  "Mask Printing": 9,
  "Lysis": 10,
  "Delivery": 11,
};