import type { SampleStatus } from "../types/sample";
import { WORKFLOW_STEPS } from "../types/sample";
import { Check } from "lucide-react";

interface ProgressStepperProps {
  currentStatus: SampleStatus;
}

const ProgressStepper = ({ currentStatus }: ProgressStepperProps) => {
  const currentIndex = WORKFLOW_STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1">
      {WORKFLOW_STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step} className="flex items-center w-full flex-1">
            {isComplete ? (
              <div className="w-6 h-6 rounded-full bg-[#00ACC1] flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            ) : isActive ? (
              <div className="flex items-center">
                <span className="flex mr-16 whitespace-nowrap items-center px-4 py-4 rounded-full text-xs font-medium border border-primary bg-[#4338E0] text-white">
                  {step}
                </span>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-400" />
            )}
            {index < WORKFLOW_STEPS.length - 1 && (
              <div className="w-4" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepper;
