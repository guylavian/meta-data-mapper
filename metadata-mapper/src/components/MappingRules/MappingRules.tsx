import React from "react";
import styles from "./MappingRules.module.css";
import { motion } from "framer-motion";

interface Step {
  label: string;
  description: string;
}

interface MappingRulesProps {
  step: number;
  steps: Step[];
}

export const MappingRules: React.FC<MappingRulesProps> = ({ step, steps }) => (
  <motion.div
    className={styles.rulesCard}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -24 }}
    transition={{ duration: 0.35 }}
  >
    <h2 className={styles.title}>{steps[step].label}</h2>
    <div className={styles.desc}>{steps[step].description}</div>
    <div className={styles.box}>
      <span className={styles.placeholder}>Content for step {step + 1} will appear here…</span>
    </div>
  </motion.div>
); 