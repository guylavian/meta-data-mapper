import React from "react";
import styles from "./FieldSelector.module.css";
import { motion } from "framer-motion";

interface FieldSelectorProps {
  fields: string[];
  selected: string[];
  onSelect: (field: string) => void;
  loading?: boolean;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  selected,
  onSelect,
  loading,
}) => (
  <div className={styles.selectorCard}>
    <h3 className={styles.title}>Available Fields</h3>
    {loading ? (
      <div className={styles.loading}>Loading fields…</div>
    ) : fields.length === 0 ? (
      <div className={styles.empty}>No fields found.</div>
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
            className={`${styles.item} ${selected.includes(field) ? styles.selected : ""}`}
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