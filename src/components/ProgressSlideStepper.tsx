import { SLIDE_WORKFLOW_STEPS } from "../types/slide";
import type { SlideStatus } from "../types/slide";

import { Check, X } from "lucide-react";

interface ProgressStepperProps {
 currentStatus: SlideStatus;
 isExcluded:boolean;
}
const ProgressStepper = ({ currentStatus, isExcluded }: ProgressStepperProps) => {

  if (isExcluded) {
  return (
    <div className="flex items-center gap-1 w-full">
      <div className="bg-red-500 rounded-full shrink-0 w-4 h-4 flex items-center justify-center overflow-hidden">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M18 6 6 18" />
          <path d="M6 6 12 12" />
        </svg> */}

        <X size={10} className="text-white" strokeWidth={3} />
      </div>

      <div className="flex-[1_0_0] min-w-[8px] flex items-center">
        <svg className="block w-full h-px" fill="none">
          <line
            x1="0"
            y1="0.5"
            x2="100%"
            y2="0.5"
            stroke="black"
            strokeDasharray="2 2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="bg-red-100 border border-red-300 flex items-center justify-center px-2.5 py-1.5 rounded-lg shrink-0">
        <span className="text-red-700 text-xs font-medium whitespace-nowrap">
          Excluded
        </span>
      </div>
    </div>
  );
}

const currentIndex = SLIDE_WORKFLOW_STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center w-full gap-1">
    {SLIDE_WORKFLOW_STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step} className="flex items-center flex-1 min-w-[8px]">

            {/* STEP NODE */}
            {/* {isComplete ? (
              <div className="w-4 h-4 rounded-full bg-[#14ae5c] flex items-center justify-center shrink-0">
                <Check size={10} className="text-white" strokeWidth={3}/>
              </div>
            ) : isActive ? (
              <div className="px-2 py-1 rounded-md bg-[#E6E6E6] text-[#2C2C2C] text-xs whitespace-nowrap">
                {step}
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-[#757575] bg-[#D9D9D9] shrink-0" />
            )} */}

            <div className="relative flex items-center justify-center shrink-0">
              {isComplete ? (
                <div className="w-4 h-4 rounded-full bg-[#14ae5c] flex items-center justify-center">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border border-[#757575] bg-[#D9D9D9]" />
              )}

              {/* ACTIVE LABEL FLOATING */}
              {isActive && (
                <div className="absolute -top-1 whitespace-nowrap px-2 py-1 rounded-md bg-[#E6E6E6] text-[#2C2C2C] text-xs shadow-sm">
                  {step}
                </div>
              )}
            </div>

            {/* CONNECTOR */}
            {/* {index < WORKFLOW_STEPS.length - 1 && (
              <div className="flex-1 flex items-center min-w-[8px] mx-1">
                <svg className="w-full h-px" preserveAspectRatio="none">
                  <line
                    x1="0"
                    y1="0.5"
                    x2="100%"
                    y2="0.5"
                    stroke="#000"
                    strokeDasharray="2 2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )} */}

            {index < SLIDE_WORKFLOW_STEPS.length - 1 && (
              <div className="flex-1 flex items-center min-w-[8px] mx-1">
                <svg className="w-full h-px" preserveAspectRatio="none">
                  <line
                    x1="0"
                    y1="0.5"
                    x2="100%"
                    y2="0.5"
                    stroke="#000"
                    strokeDasharray="2 2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default ProgressStepper;
