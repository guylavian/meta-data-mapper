import React from "react";
import styles from "./MappingManagement.module.css";
import { motion } from "framer-motion";

interface Mapping {
  id: string;
  name: string;
}

interface MappingManagementProps {
  mappings: Mapping[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  loading?: boolean;
}

export const MappingManagement: React.FC<MappingManagementProps> = ({
  mappings,
  onSelect,
  onCreate,
  loading,
}) => (
  <div className={styles.managementCard}>
    <h3 className={styles.title}>Saved Mappings</h3>
    <button className={styles.createBtn} onClick={onCreate}>+ New Mapping</button>
    {loading ? (
      <div className={styles.loading}>Loading mappings…</div>
    ) : mappings.length === 0 ? (
      <div className={styles.empty}>No mappings found.</div>
    ) : (
      <motion.ul
        className={styles.list}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {mappings.map((m) => (
          <li
            key={m.id}
            className={styles.item}
            onClick={() => onSelect(m.id)}
            tabIndex={0}
          >
            {m.name}
          </li>
        ))}
      </motion.ul>
    )}
  </div>
); 