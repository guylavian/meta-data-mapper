import React from "react";
import styles from "./MappingPreview.module.css";
import { motion } from "framer-motion";

interface MappingPreviewProps {
  loading?: boolean;
  result?: string;
}

export const MappingPreview: React.FC<MappingPreviewProps> = ({ loading, result }) => (
  <motion.div
    className={styles.previewCard}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -24 }}
    transition={{ duration: 0.35 }}
  >
    <h3 className={styles.title}>Mapping Preview</h3>
    {loading ? (
      <div className={styles.loading}>Loading preview…</div>
    ) : result ? (
      <pre className={styles.result}>{result}</pre>
    ) : (
      <div className={styles.empty}>No preview available.</div>
    )}
  </motion.div>
); 