import React from "react";
import styles from "./ReviewMapping.module.css";
import { motion } from "framer-motion";

interface ReviewMappingProps {
  mapping: { source: string; target: string }[];
}

export const ReviewMapping: React.FC<ReviewMappingProps> = ({ mapping }) => (
  <motion.div
    className={styles.reviewCard}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -24 }}
    transition={{ duration: 0.35 }}
  >
    <h3 className={styles.title}>Review Mapping</h3>
    {mapping.length === 0 ? (
      <div className={styles.empty}>No mappings to review.</div>
    ) : (
      <ul className={styles.list}>
        {mapping.map((pair, idx) => (
          <motion.li
            key={pair.source + pair.target}
            className={styles.item}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <span className={styles.source}>{pair.source}</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.target}>{pair.target}</span>
          </motion.li>
        ))}
      </ul>
    )}
  </motion.div>
); 