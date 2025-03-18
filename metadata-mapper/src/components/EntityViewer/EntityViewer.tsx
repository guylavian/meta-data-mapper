import React from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '../../types/mapping';
import styles from './EntityViewer.module.css';

interface EntityViewerProps {
  sourceFields: Field[];
  targetFields?: Field[];
  title?: string;
  onStepClick?: (step: number) => void;
}

export const EntityViewer: React.FC<EntityViewerProps> = ({ sourceFields, targetFields, title, onStepClick }) => {
  const { t } = useTranslation();

  // Group fields by their parent path
  const groupFieldsByPath = (fields: Field[]) => {
    return fields.reduce((acc, field) => {
      const parentPath = field.path.split('.').slice(0, -1).join('.') || 'root';
      if (!acc[parentPath]) {
        acc[parentPath] = [];
      }
      acc[parentPath].push(field);
      return acc;
    }, {} as Record<string, Field[]>);
  };

  const sourceGroupedFields = groupFieldsByPath(sourceFields);
  const targetGroupedFields = targetFields ? groupFieldsByPath(targetFields) : null;

  const renderFields = (fields: Field[], prefix: string) => (
    <div className={styles.fieldList}>
      {fields.map((field) => (
        <div key={`${prefix}_${field.id}_${field.path}`} className={styles.field}>
          <div className={styles.fieldInfo}>
            <div className={styles.fieldName}>{field.name}</div>
            <div className={styles.fieldPath}>{field.path}</div>
            {field.description && (
              <div className={styles.description}>{field.description}</div>
            )}
          </div>
          <span className={`${styles.fieldType} ${styles[field.type]}`}>
            {field.type}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={targetFields ? styles.compareContainer : ''}>
        <div className={targetFields ? styles.sourceFields : ''}>
          {Object.entries(sourceGroupedFields).map(([entityPath, entityFields]) => (
            <div key={`source_${entityPath}`} className={styles.entityCard}>
              <div className={styles.entityHeader}>
                <h3 className={styles.entityName}>
                  {entityPath === 'root' ? t('entities.source') : entityPath}
                </h3>
                <span className={styles.fieldCount}>
                  {t('entities.fieldCount', { count: entityFields.length })}
                </span>
              </div>
              {renderFields(entityFields, 'source')}
            </div>
          ))}
        </div>

        {targetFields && (
          <div className={styles.targetFields}>
            {Object.entries(targetGroupedFields || {}).map(([entityPath, entityFields]) => (
              <div key={`target_${entityPath}`} className={styles.entityCard}>
                <div className={styles.entityHeader}>
                  <h3 className={styles.entityName}>
                    {entityPath === 'root' ? t('entities.target') : entityPath}
                  </h3>
                  <span className={styles.fieldCount}>
                    {t('entities.fieldCount', { count: entityFields.length })}
                  </span>
                </div>
                {renderFields(entityFields, 'target')}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.actionButtons}>
        <button 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          onClick={() => onStepClick?.(3)}
        >
          {t('buttons.continue')}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 