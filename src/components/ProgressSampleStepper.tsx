import type { SampleStatus } from "../types/sample";
import { WORKFLOW_STEPS } from "../types/sample";
import { Check } from "lucide-react";

interface ProgressStepperProps {
  currentStatus: SampleStatus;
}
const ProgressStepper = ({ currentStatus }: ProgressStepperProps) => {
  const currentIndex = WORKFLOW_STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center w-full gap-1">
      {WORKFLOW_STEPS.map((step, index) => {
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

            {index < WORKFLOW_STEPS.length - 1 && (
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
