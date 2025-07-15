import React from 'react';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;
  setStep: (step: number) => void;
  steps: Step[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, setStep, steps }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40, fontFamily: 'Inter, sans-serif' }}>
      {steps.map((s) => (
        <div key={s.number} onClick={() => setStep(s.number)} style={{ cursor: 'pointer', textAlign: 'center' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: `2px solid ${currentStep === s.number ? '#1677ff' : '#ddd'}`,
              backgroundColor: currentStep === s.number ? '#1677ff' : '#fff',
              color: currentStep === s.number ? '#fff' : '#999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {s.number}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: currentStep === s.number ? '#1677ff' : '#999', fontWeight: 500 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}; 