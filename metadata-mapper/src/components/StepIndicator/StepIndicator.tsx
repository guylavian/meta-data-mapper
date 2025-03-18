import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../../contexts/RTLContext';
import { CheckIcon } from '@heroicons/react/24/solid';

export interface Step {
  key: string;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <div className="py-8 px-6 bg-gray-50 border-b border-gray-200">
      <nav aria-label="Progress">
        <ol
          role="list"
          className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <li
                key={step.key}
                className={`relative ${index !== steps.length - 1 ? 'flex-1' : ''}`}
              >
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute inset-0 flex items-center ${
                      isRTL ? '-scale-x-100' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <div
                      className={`h-0.5 w-full ${
                        isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                )}
                <button
                  onClick={() => onStepClick?.(index)}
                  disabled={!onStepClick || isPending}
                  className={`relative flex flex-col items-center group ${
                    onStepClick && !isPending ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span className="px-6">
                    <span
                      className={`h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                        isCompleted
                          ? 'bg-blue-600 border-blue-600 shadow-md'
                          : isCurrent
                          ? 'border-blue-600 text-blue-600'
                          : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="w-6 h-6 text-white" />
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            isCurrent ? 'text-blue-600' : 'text-gray-500'
                          }`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </span>
                  </span>
                  <div
                    className={`mt-4 text-center ${
                      isRTL ? 'right-0' : 'left-0'
                    } w-full`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {t(step.title)}
                    </span>
                    {step.description && (
                      <p className={`text-xs text-gray-500 mt-1 max-w-xs mx-auto ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}>
                        {t(step.description)}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}; 