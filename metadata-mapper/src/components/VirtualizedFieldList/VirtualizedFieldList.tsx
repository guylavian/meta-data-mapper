import React from "react";
import styles from "./VirtualizedFieldList.module.css";

interface VirtualizedFieldListProps {
  fields: string[];
  selected: string[];
  onSelect: (field: string) => void;
  height?: number;
  rowHeight?: number;
}

export const VirtualizedFieldList: React.FC<VirtualizedFieldListProps> = ({
  fields,
  selected,
  onSelect,
  height = 300,
  rowHeight = 36,
}) => {
  // Simple virtualization (for demo; use react-window for large lists in production)
  const visibleCount = Math.floor(height / rowHeight);
  const [start, setStart] = React.useState(0);
  const end = Math.min(start + visibleCount, fields.length);

  return (
    <div
      className={styles.listContainer}
      style={{ height, overflowY: "auto" }}
      onScroll={e => {
        const scrollTop = (e.target as HTMLDivElement).scrollTop;
        setStart(Math.floor(scrollTop / rowHeight));
      }}
    >
      <ul className={styles.list} style={{ height: fields.length * rowHeight }}>
        {fields.slice(start, end).map((field, idx) => (
          <li
            key={field}
            className={`${styles.item} ${selected.includes(field) ? styles.selected : ""}`}
            style={{ top: (start + idx) * rowHeight, height: rowHeight }}
            onClick={() => onSelect(field)}
            tabIndex={0}
          >
            {field}
          </li>
        ))}
      </ul>
    </div>
  );
}; 