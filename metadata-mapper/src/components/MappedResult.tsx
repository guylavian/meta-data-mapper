import React from "react";
import styles from "./MappedResult.module.css";

interface MappedResultProps {
  result: string;
}

export const MappedResult: React.FC<MappedResultProps> = ({ result }) => (
  <div className={styles.resultCard}>
    <h3 className={styles.title}>Mapped Result</h3>
    <pre className={styles.result}>{result}</pre>
  </div>
); 