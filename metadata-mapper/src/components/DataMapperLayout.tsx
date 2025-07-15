import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DataMapperLayout.module.css";
import { useTheme } from "../theme/ThemeProvider";
import { MetadataInput } from "./MetadataInput";
import { MappingRules } from "./MappingRules/MappingRules";

const steps = [
  { label: "Select Data", description: "Please select or load your data to get started." },
  { label: "Choose Fields", description: "Pick the fields you want to include in your mapping." },
  { label: "Map Fields", description: "Map your source fields to target fields." },
  { label: "Review", description: "Review your mapping before finishing." },
];

export const DataMapperLayout: React.FC = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [metadata, setMetadata] = useState<string | null>(null);
  const { theme, toggle } = useTheme();

  const goToStep = (idx: number) => {
    setDirection(idx > step ? 1 : -1);
    setStep(idx);
  };
  const next = () => {
    if (step < steps.length - 1 && metadata) {
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
    <div className={styles.wrapper} /* Theming handled by CSS variables from ThemeProvider */>
      <div className={styles.card}>
        {/* Header */}
        <header className={styles.header}>
          <span className={styles.title}>Meta Data Mapper</span>
          <button
            className={styles.themeToggle}
            aria-label="Toggle dark mode"
            onClick={toggle}
          >
            {theme.mode === "dark" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12 2.5a9.5 9.5 0 0 0 0 19 9.5 9.5 0 1 1 0-19zM12 4a8 8 0 0 0 0 16 8 8 0 1 1 0-16z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="6" fill="currentColor" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
                <line x1="5.64" y1="5.64" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="18.36" y2="18.36" />
                <line x1="5.64" y1="18.36" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="18.36" y2="5.64" />
              </svg>
            )}
          </button>
        </header>

        {/* Step Indicator */}
        <nav className={styles.stepper}>
          {steps.map((s, i) => (
            <div
              key={s.label}
              className={styles.step}
              onClick={() => goToStep(i)}
              tabIndex={0}
              aria-current={step === i}
              style={{ cursor: "pointer" }}
            >
              <motion.div
                className={styles.circle}
                animate={{
                  borderColor: step === i ? theme.colors.stepCircleActiveBg : theme.colors.stepCircleInactiveBg,
                  background: step === i ? theme.colors.stepCircleActiveBg : theme.colors.stepCircleInactiveBg,
                  color: step === i ? theme.colors.stepCircleActiveColor : theme.colors.stepCircleInactiveColor,
                }}
                transition={{ duration: 0.25 }}
              >
                {i + 1}
              </motion.div>
              <motion.div
                className={styles.label}
                animate={{
                  color: step === i ? theme.colors.stepLabelActive : theme.colors.stepLabelInactive,
                }}
                transition={{ duration: 0.25 }}
              >
                {s.label}
              </motion.div>
            </div>
          ))}
        </nav>

        {/* Step Content */}
        <div className={styles.contentArea}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              className={styles.stepContent}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40, position: "absolute" }}
              animate={{ opacity: 1, x: 0, position: "relative", transition: { duration: 0.35 } }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40, position: "absolute", transition: { duration: 0.25 } }}
            >
              <h2 className={styles.stepTitle} style={{ color: theme.colors.text }}>{steps[step].label}</h2>
              <div className={styles.stepDesc} style={{ color: theme.colors.textSecondary }}>{steps[step].description}</div>
              <div
                className={styles.placeholderBox}
                style={{
                  border: `1.5px dashed ${theme.colors.borderStrong}`,
                  background: theme.colors.surface,
                }}
              >
                {/* Conditional rendering for each step's content */}
                {step === 0 && <MetadataInput onMetadataChange={setMetadata} />}
                {step === 1 && metadata && <p>Content for Choose Fields. Metadata loaded: {metadata.substring(0, 50)}...</p>}
                {step === 2 && metadata && <MappingRules step={step} steps={steps} />} {/* Pass metadata or relevant data down */}
                {step === 3 && metadata && <p>Content for Review.</p>}
                {!metadata && step > 0 && <span className={styles.placeholderText} style={{ color: theme.colors.placeholder }}>Please select or load your data to continue.</span>}
                {metadata && step === 0 && null} {/* Hide placeholder if MetadataInput is active and metadata is set */}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className={styles.navButtons}>
          <button
            className={styles.backBtn}
            onClick={back}
            disabled={step === 0}
            tabIndex={step === 0 ? -1 : 0}
            style={{
              borderRadius: 7,
              border: `1.5px solid ${theme.colors.btnBorder}`,
              background: theme.colors.btnBg,
              color: theme.colors.btnText,
              fontWeight: 500,
              fontSize: 15,
              padding: '8px 28px',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              opacity: step === 0 ? 0.5 : 1,
              transition: 'background 0.18s, border-color 0.18s, color 0.18s',
            }}
            onMouseOver={e => {
              if (step !== 0) {
                e.currentTarget.style.background = theme.colors.btnBgHover;
                e.currentTarget.style.borderColor = theme.colors.btnBorderHover;
                e.currentTarget.style.color = theme.colors.btnTextHover;
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = theme.colors.btnBg;
              e.currentTarget.style.borderColor = theme.colors.btnBorder;
              e.currentTarget.style.color = theme.colors.btnText;
            }}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              className={styles.nextBtn}
              onClick={next}
              disabled={step === 0 && !metadata} // Disable if on step 0 and no metadata
              style={{
                borderRadius: 7,
                border: `1.5px solid ${theme.colors.primary}`,
                background: theme.colors.primary,
                color: theme.colors.primaryText,
                fontWeight: 500,
                fontSize: 15,
                padding: '8px 28px',
                cursor: (step === 0 && !metadata) ? 'not-allowed' : 'pointer',
                opacity: (step === 0 && !metadata) ? 0.5 : 1,
                transition: 'background 0.18s, border-color 0.18s, color 0.18s',
              }}
              onMouseOver={e => {
                if (!(step === 0 && !metadata)) {
                  e.currentTarget.style.background = theme.colors.nextBtnBgHover;
                  e.currentTarget.style.borderColor = theme.colors.nextBtnBorderHover;
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = theme.colors.primary;
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
            >
              Next
            </button>
          ) : (
            <button
              className={styles.nextBtn}
              onClick={() => alert("Finished!")}
              style={{
                borderRadius: 7,
                border: `1.5px solid ${theme.colors.primary}`,
                background: theme.colors.primary,
                color: theme.colors.primaryText,
                fontWeight: 500,
                fontSize: 15,
                padding: '8px 28px',
                cursor: 'pointer',
                transition: 'background 0.18s, border-color 0.18s, color 0.18s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = theme.colors.nextBtnBgHover;
                e.currentTarget.style.borderColor = theme.colors.nextBtnBorderHover;
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = theme.colors.primary;
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
            >
              Finish
            </button>
          )}
        </div>
      </div>
      {/* Footer */}
      <footer className={styles.footer} style={{ color: theme.colors.textMuted }}>
        © 2025 Meta Data Mapper
      </footer>
    </div>
  );
}; 