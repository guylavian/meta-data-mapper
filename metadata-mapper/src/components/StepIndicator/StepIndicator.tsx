import React from 'react';
import styles from './StepIndicator.module.css';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;
  setStep: (s: number) => void;
  steps: Step[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, setStep, steps }) => {
  return (
    <div className={styles.stepper}>
      <div className={styles.connector}>
        <div
          className={styles.connectorActive}
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
          }}
        />
      </div>
      {steps.map((s, i) => (
        <div
          key={s.number}
          className={styles.step}
          onClick={() => setStep(s.number)}
        >
          <div
            className={`${styles.circle} ${currentStep === s.number ? styles.active : ''}`}
          >
            {s.number}
          </div>
          <div className={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}; 