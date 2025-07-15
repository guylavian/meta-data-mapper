import React from 'react';
import { StepIndicator } from './StepIndicator/StepIndicator';
import { AnimatePresence, motion } from 'framer-motion';

const stepVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
    position: 'absolute',
  }),
  animate: { opacity: 1, x: 0, position: 'relative', transition: { duration: 0.35 } },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
    position: 'absolute',
    transition: { duration: 0.25 }
  }),
};

interface Step {
  number: number;
  label: string;
  description: string;
}

interface MappingRulesProps {
  step: number;
  setStep: (s: number) => void;
  direction: number;
  steps: Step[];
}

const MappingRules: React.FC<MappingRulesProps> = ({ step, setStep, direction, steps }) => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
    <StepIndicator currentStep={step} setStep={setStep} steps={steps} />
    <div style={{ minHeight: 220, position: 'relative' }}>
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ width: '100%' }}
        >
          <div style={{ width: '100%' }}>
            <h2 style={{ margin: 0, fontWeight: 500, fontSize: '1.25rem', color: '#333' }}>{steps[step - 1].label}</h2>
            <div style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>{steps[step - 1].description}</div>
            <div style={{ minHeight: 120, border: '1px dashed #ddd', borderRadius: 6, padding: 16, marginBottom: 32 }}>
              <span style={{ color: '#999' }}>Content for step {step} will appear here...</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  style={{
                    borderRadius: 6,
                    padding: '8px 24px',
                    fontWeight: 500,
                    border: '1px solid #333',
                    background: 'transparent',
                    color: '#333',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.15s, transform 0.15s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Back
            </button>
              ) : <div />}
              {step < steps.length ? (
            <button
                  onClick={() => setStep(step + 1)}
                  style={{
                    borderRadius: 6,
                    background: '#333',
                    border: '1px solid #333',
                    color: '#fff',
                    padding: '8px 24px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(30,30,30,0.10)',
                    transition: 'box-shadow 0.15s, transform 0.15s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  Next
            </button>
              ) : (
            <button
                  onClick={() => console.log('Finish')}
                  style={{
                    borderRadius: 6,
                    background: '#333',
                    border: '1px solid #333',
                    color: '#fff',
                    padding: '8px 24px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(30,30,30,0.10)',
                    transition: 'box-shadow 0.15s, transform 0.15s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  Finish
            </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
    </div>
  );

export default MappingRules; 
