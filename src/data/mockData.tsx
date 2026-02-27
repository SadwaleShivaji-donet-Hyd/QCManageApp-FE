import type { Sample, Slide, LogEntry } from "../types/sample";

export const mockSamples: Sample[] = [
  { id: "0789456321", customer: "UCLA Health", batchId: "003818853", slideCount: 12, status: "5x Alignment Scan", receivedDate: "02/10/26", limsId: "1854802893" },
  { id: "0789456322", customer: "Mayo Lab", batchId: "003818853", slideCount: 5, status: "Waiting for 40x", receivedDate: "02/08/26" },
  { id: "0789456323", customer: "Stanford Med", batchId: "003818853", slideCount: 8, status: "5x Alignment Scan", receivedDate: "02/09/26" },
  { id: "0789456421", customer: "Stanford Med", batchId: "003818854", slideCount: 9, status: "5x Alignment Scan", receivedDate: "02/11/26" },
  { id: "0789456422", customer: "Stanford Med", batchId: "003818854", slideCount: 11, status: "5x Alignment Scan", receivedDate: "02/11/26" },
  { id: "0789456423", customer: "Stanford Med", batchId: "003818854", slideCount: 10, status: "Waiting for 40x", receivedDate: "02/10/26" },
  { id: "0789456521", customer: "Mayo Lab", batchId: "003818855", slideCount: 12, status: "5x Alignment Scan", receivedDate: "02/12/26" },
  { id: "0789456522", customer: "Stanford Med", batchId: "003818855", slideCount: 8, status: "5x Alignment Scan", receivedDate: "02/12/26" },
  { id: "0789456523", customer: "Kaiser Clinic", batchId: "003818855", slideCount: 12, status: "Ready for Lysis", receivedDate: "02/12/26" },
  { id: "0789456621", customer: "Stanford Med", batchId: "003818856", slideCount: 12, status: "Ready for Review", receivedDate: "02/13/26" },
  { id: "0789456622", customer: "Mayo Lab", batchId: "003818856", slideCount: 6, status: "Ready for Lysis", receivedDate: "02/13/26" },
  { id: "0789456623", customer: "UCLA Health", batchId: "003818856", slideCount: 12, status: "Ready for Lysis", receivedDate: "02/13/26" },
  { id: "0789456721", customer: "Johns Hopkins", batchId: "003818857", slideCount: 9, status: "Ready for Mask", receivedDate: "02/14/26" },
  { id: "0789456722", customer: "Mayo Lab", batchId: "003818857", slideCount: 9, status: "Ready for Lysis", receivedDate: "02/14/26" },
  { id: "0789456723", customer: "Johns Hopkins", batchId: "003818857", slideCount: 8, status: "Ready for Mask", receivedDate: "02/14/26" },
  { id: "0789456821", customer: "Stanford Med", batchId: "003818858", slideCount: 8, status: "Ready for Mask", receivedDate: "02/15/26" },
  { id: "0789456822", customer: "Johns Hopkins", batchId: "003818858", slideCount: 10, status: "Ready for Fiducials", receivedDate: "02/15/26" },
  { id: "0789456823", customer: "UCLA Health", batchId: "003818858", slideCount: 8, status: "Ready for Review", receivedDate: "02/15/26" },
];

export const mockSlides: Record<string, Slide[]> = {
  "0789456321": [
    { id: "8238058135", status: "5x Alignment Scan" },
    { id: "8238058136", status: "5x Alignment Scan" },
    { id: "8238058139", status: "5x Alignment Scan", hasWarning: true },
    { id: "8238058140", status: "5x Alignment Scan" },
    { id: "8238058142", status: "5x Alignment Scan" },
    { id: "8238058132", status: "PrintMatch Processing" },
    { id: "8238058133", status: "PrintMatch Processing" },
    { id: "8238058134", status: "PrintMatch Processing" },
    { id: "8238058137", status: "PrintMatch Processing" },
    { id: "8238058138", status: "PrintMatch Processing" },
    { id: "8238058141", status: "PrintMatch Processing" },
    { id: "8238058143", status: "PrintMatch Processing" },
  ],
  "937069936": [
    { id: "3587438297", status: "Requested" },
    { id: "7658693406", status: "Requested" },
    { id: "4900551617", status: "Requested" },
    { id: "9603359928", status: "Requested" },
  ],
};

export const mockLogEntries: LogEntry[] = [
  { type: "Slide", entityId: "8238058136", action: "Status advanced to Mask Printing", user: "Marcus T.", timestamp: "02/12/26 12:11 AM" },
  { type: "Slide", entityId: "8238058135", action: "Status advanced to Mask Printing", user: "Marcus T.", timestamp: "02/11/26 9:54 AM" },
  { type: "Slide", entityId: "8238058135", action: "Status advanced to 5x Alignment Scan", user: "Alex R.", timestamp: "02/11/26 9:41 AM" },
  { type: "Slide", entityId: "8238058135", action: "Status advanced to Checkfile Review", user: "Priya S.", timestamp: "02/11/26 9:37 AM" },
  { type: "Slide", entityId: "8238058135", action: "Status advanced to Fiducial Printing", user: "Lindsay L.", timestamp: "02/11/26 7:14 AM" },
  { type: "Slide", entityId: "8238058137", action: "Status advanced to Fiducial Printing", user: "Lindsay L.", timestamp: "02/11/26 7:02 AM" },
  { type: "Slide", entityId: "8238058136", action: "Status advanced to Checkfile Review", user: "Priya S.", timestamp: "02/11/26 6:36 PM" },
  { type: "Slide", entityId: "8238058137", action: "Status advanced to PrintMatch Processing", user: "Jordan K.", timestamp: "02/11/26 6:16 AM" },
  { type: "Slide", entityId: "8238058133", action: "Status advanced to Checkfile Review", user: "Priya S.", timestamp: "02/11/26 6:09 PM" },
  { type: "Slide", entityId: "8238058133", action: "Status advanced to 5x Alignment Scan", user: "Alex R.", timestamp: "02/11/26 5:16 AM" },
  { type: "Slide", entityId: "8238058134", action: "Status advanced to Checkfile Review", user: "Priya S.", timestamp: "02/11/26 4:18 AM" },
];
