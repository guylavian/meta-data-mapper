import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    number: number;
    label: string;
  }>;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex items-center ${currentStep >= step.number ? 'text-blue-500' : 'text-gray-400'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${currentStep >= step.number ? 'border-blue-500' : 'border-gray-300'}`}
          >
            {step.number}
          </div>
          <span className="ml-2">{step.label}</span>
        </div>
      ))}
    </div>
  );
}; 