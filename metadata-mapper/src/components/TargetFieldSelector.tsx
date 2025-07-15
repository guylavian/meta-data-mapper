import React from "react";
import styles from "./TargetFieldSelector.module.css";
import { motion } from "framer-motion";

interface TargetFieldSelectorProps {
  fields: string[];
  selected: string | null;
  onSelect: (field: string) => void;
  loading?: boolean;
}

export const TargetFieldSelector: React.FC<TargetFieldSelectorProps> = ({
  fields,
  selected,
  onSelect,
  loading,
}) => (
  <div className={styles.selectorCard}>
    <h3 className={styles.title}>Target Fields</h3>
    {loading ? (
      <div className={styles.loading}>Loading fields…</div>
    ) : fields.length === 0 ? (
      <div className={styles.empty}>No target fields found.</div>
    ) : (
      <motion.ul
        className={styles.list}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {fields.map((field) => (
          <li
            key={field}
            className={`${styles.item} ${selected === field ? styles.selected : ""}`}
            onClick={() => onSelect(field)}
            tabIndex={0}
          >
            {field}
          </li>
        ))}
      </motion.ul>
    )}
  </div>
); 