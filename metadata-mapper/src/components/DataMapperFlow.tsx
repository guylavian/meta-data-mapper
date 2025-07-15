import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DataMapperFlow.module.css';

const steps = [
  { label: 'Select Data', description: 'Please select or load your data to get started.' },
  { label: 'Choose Fields', description: 'Pick the fields you want to include in your mapping.' },
  { label: 'Map Fields', description: 'Map your source fields to target fields.' },
  { label: 'Review', description: 'Review your mapping before finishing.' },
];

const lightTheme = {
  cardBg: '#fff',
  cardShadow: '0 4px 32px rgba(30,30,30,0.10)',
  text: '#333',
  textSecondary: '#666',
  textInactive: '#999',
  stepCircleActiveBg: '#333',
  stepCircleInactiveBg: '#ddd',
  stepCircleActiveColor: '#fff',
  stepCircleInactiveColor: '#999',
  stepLabelActive: '#333',
  stepLabelInactive: '#999',
  contentBg: '#fff',
  contentBorder: '#ddd',
  placeholder: '#999',
  navBtnBg: 'transparent',
  navBtnBorder: '#333',
  navBtnText: '#333',
  navBtnBgActive: '#333',
  navBtnTextActive: '#fff',
  navBtnBgHover: '#f3f3f3',
  navBtnBorderHover: '#222',
  navBtnTextHover: '#222',
  nextBtnBg: '#333',
  nextBtnText: '#fff',
  nextBtnBgHover: '#444',
  nextBtnBorderHover: '#222',
  wrapperBg: '#f7f8fa',
};

const darkTheme = {
  cardBg: '#232526',
  cardShadow: '0 4px 32px rgba(0,0,0,0.25)',
  text: '#fff',
  textSecondary: '#aaa',
  textInactive: '#777',
  stepCircleActiveBg: '#fff',
  stepCircleInactiveBg: '#555',
  stepCircleActiveColor: '#222',
  stepCircleInactiveColor: '#aaa',
  stepLabelActive: '#fff',
  stepLabelInactive: '#777',
  contentBg: '#222',
  contentBorder: '#555',
  placeholder: '#aaa',
  navBtnBg: 'transparent',
  navBtnBorder: '#fff',
  navBtnText: '#fff',
  navBtnBgActive: '#fff',
  navBtnTextActive: '#222',
  navBtnBgHover: '#333',
  navBtnBorderHover: '#fff',
  navBtnTextHover: '#fff',
  nextBtnBg: '#fff',
  nextBtnText: '#222',
  nextBtnBgHover: '#eee',
  nextBtnBorderHover: '#fff',
  wrapperBg: '#181a1b',
};

export const DataMapperFlow: React.FC = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [dark, setDark] = useState(false);
  const theme = dark ? darkTheme : lightTheme;

  const goToStep = (idx: number) => {
    setDirection(idx > step ? 1 : -1);
    setStep(idx);
  };
  const next = () => {
    if (step < steps.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };
  const back = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  return (
    <div className={styles.wrapper} style={{ background: theme.wrapperBg }}>
      <div className={styles.card} style={{ background: theme.cardBg, boxShadow: theme.cardShadow }}>
        <header className={styles.header}>
          <span className={styles.title} style={{ color: theme.text }}>Data Mapper</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              className={styles.themeToggle}
              aria-label="Toggle dark mode"
              onClick={() => setDark((d) => !d)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
                color: theme.text,
                marginRight: 8,
                transition: 'color 0.2s',
              }}
            >
              {dark ? '🌙' : '☀️'}
            </button>
            <span className={styles.avatar}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill={dark ? '#333' : '#eee'}/><path d="M16 17c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.314 0-10 1.657-10 5v2h20v-2c0-3.343-6.686-5-10-5z" fill={dark ? '#bbb' : '#bbb'}/></svg>
            </span>
          </div>
        </header>
        <nav className={styles.stepper}>
          {steps.map((s, i) => (
            <div key={s.label} className={styles.step} onClick={() => goToStep(i)}>
              <motion.div
                className={styles.circle}
                animate={{
                  backgroundColor: step === i ? theme.stepCircleActiveBg : theme.stepCircleInactiveBg,
                  color: step === i ? theme.stepCircleActiveColor : theme.stepCircleInactiveColor,
                  borderColor: step === i ? theme.stepCircleActiveBg : theme.stepCircleInactiveBg,
                }}
                transition={{ duration: 0.25 }}
              >
                {i + 1}
              </motion.div>
              <motion.div
                className={styles.label}
                animate={{ color: step === i ? theme.stepLabelActive : theme.stepLabelInactive }}
                transition={{ duration: 0.25 }}
              >
                {s.label}
              </motion.div>
            </div>
          ))}
        </nav>
        <div className={styles.contentArea}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              className={styles.stepContent}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40, position: 'absolute' }}
              animate={{ opacity: 1, x: 0, position: 'relative', transition: { duration: 0.35 } }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40, position: 'absolute', transition: { duration: 0.25 } }}
            >
              <h2 className={styles.stepTitle} style={{ color: theme.text }}>{steps[step].label}</h2>
              <div className={styles.stepDesc} style={{ color: theme.textSecondary }}>{steps[step].description}</div>
              <div
                className={styles.placeholderBox}
                style={{
                  border: `1.5px dashed ${theme.contentBorder}`,
                  background: theme.contentBg,
                }}
              >
                <span className={styles.placeholderText} style={{ color: theme.placeholder }}>{steps[step].description}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className={styles.navButtons}>
          <button
            className={styles.backBtn}
            onClick={back}
            disabled={step === 0}
            tabIndex={step === 0 ? -1 : 0}
            style={{
              borderRadius: 7,
              border: `1.5px solid ${theme.navBtnBorder}`,
              background: theme.navBtnBg,
              color: theme.navBtnText,
              fontWeight: 500,
              fontSize: 15,
              padding: '8px 28px',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              opacity: step === 0 ? 0.5 : 1,
              transition: 'background 0.18s, border-color 0.18s, color 0.18s',
            }}
            onMouseOver={e => {
              if (step !== 0) {
                e.currentTarget.style.background = theme.navBtnBgHover;
                e.currentTarget.style.borderColor = theme.navBtnBorderHover;
                e.currentTarget.style.color = theme.navBtnTextHover;
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = theme.navBtnBg;
              e.currentTarget.style.borderColor = theme.navBtnBorder;
              e.currentTarget.style.color = theme.navBtnText;
            }}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              className={styles.nextBtn}
              onClick={next}
              style={{
                borderRadius: 7,
                border: `1.5px solid ${theme.nextBtnBg}`,
                background: theme.nextBtnBg,
                color: theme.nextBtnText,
                fontWeight: 500,
                fontSize: 15,
                padding: '8px 28px',
                cursor: 'pointer',
                transition: 'background 0.18s, border-color 0.18s, color 0.18s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = theme.nextBtnBgHover;
                e.currentTarget.style.borderColor = theme.nextBtnBorderHover;
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = theme.nextBtnBg;
                e.currentTarget.style.borderColor = theme.nextBtnBg;
              }}
            >
              Next
            </button>
          ) : (
            <button
              className={styles.nextBtn}
              onClick={() => alert('Finished!')}
              style={{
                borderRadius: 7,
                border: `1.5px solid ${theme.nextBtnBg}`,
                background: theme.nextBtnBg,
                color: theme.nextBtnText,
                fontWeight: 500,
                fontSize: 15,
                padding: '8px 28px',
                cursor: 'pointer',
                transition: 'background 0.18s, border-color 0.18s, color 0.18s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = theme.nextBtnBgHover;
                e.currentTarget.style.borderColor = theme.nextBtnBorderHover;
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = theme.nextBtnBg;
                e.currentTarget.style.borderColor = theme.nextBtnBg;
              }}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 