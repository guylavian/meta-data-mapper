import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../../contexts/RTLContext';
import { Field, MappingRule } from '../../types/mapping';
import styles from './MappingRules.module.css';

interface MappingRulesProps {
  sourceFields: Field[];
  targetFields: Field[];
  onRulesChange: (rules: MappingRule[]) => void;
  isLoading: boolean;
}

export const MappingRules: React.FC<MappingRulesProps> = ({
  sourceFields,
  targetFields,
  onRulesChange,
  isLoading
}) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [selectedSourceField, setSelectedSourceField] = useState<Field | null>(null);
  const [selectedTargetField, setSelectedTargetField] = useState<Field | null>(null);
  const [rules, setRules] = useState<MappingRule[]>([]);
  const [isMappingEntity, setIsMappingEntity] = useState(false);

  const handleCreateMapping = () => {
    if (isMappingEntity) {
      // Create mapping rules for all fields
      const entityRules: MappingRule[] = sourceFields.map((sourceField, index) => ({
        id: `rule_${index}`,
        sourceField,
        targetField: targetFields[index] || targetFields[targetFields.length - 1], // fallback to last field if no direct match
      }));
      console.log('Creating entity-level mapping with rules:', entityRules);
      onRulesChange(entityRules);
    } else {
      // Create single field mapping
      if (!selectedSourceField || !selectedTargetField) {
        console.warn('No fields selected for mapping');
        return;
      }
      const newRule: MappingRule = {
        id: `rule_${rules.length}`,
        sourceField: selectedSourceField,
        targetField: selectedTargetField,
      };
      const updatedRules = [...rules, newRule];
      console.log('Creating field-level mapping with rules:', updatedRules);
      onRulesChange(updatedRules);
    }
    // Reset selections
    setSelectedSourceField(null);
    setSelectedTargetField(null);
    setRules([]);
  };

  const toggleMappingMode = () => {
    setIsMappingEntity(!isMappingEntity);
    setSelectedSourceField(null);
    setSelectedTargetField(null);
    setRules([]);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('mapping.title')}</h2>
          <button
            onClick={toggleMappingMode}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            {isMappingEntity ? t('mapping.switchToFieldMode') : t('mapping.switchToEntityMode')}
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          {isMappingEntity
            ? t('mapping.entityModeDescription')
            : t('mapping.fieldModeDescription')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">{t('mapping.sourceFields')}</h3>
          {isMappingEntity ? (
            <div className="p-4 border rounded bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">
                {t('mapping.entitySourceDescription', { count: sourceFields.length })}
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {sourceFields.slice(0, 3).map((field) => (
                  <li key={field.id}>{field.name}</li>
                ))}
                {sourceFields.length > 3 && (
                  <li className="text-gray-500">
                    {t('mapping.andMore', { count: sourceFields.length - 3 })}
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <ul className="space-y-2">
              {sourceFields.map((field) => (
                <li key={`source-${field.id}-${field.path}-${field.name}`}>
                  <button
                    type="button"
                    onClick={() => setSelectedSourceField(field)}
                    className={`w-full text-left p-2 rounded ${
                      selectedSourceField?.id === field.id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{field.name}</div>
                    <div className="text-sm text-gray-500">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-gray-200 mr-2">
                        {field.type}
                      </span>
                      {field.path}
                    </div>
                    {field.description && (
                      <div className="text-xs text-gray-500 mt-1">{field.description}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">{t('mapping.targetFields')}</h3>
          {isMappingEntity ? (
            <div className="p-4 border rounded bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">
                {t('mapping.entityTargetDescription', { count: targetFields.length })}
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {targetFields.slice(0, 3).map((field) => (
                  <li key={field.id}>{field.name}</li>
                ))}
                {targetFields.length > 3 && (
                  <li className="text-gray-500">
                    {t('mapping.andMore', { count: targetFields.length - 3 })}
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <ul className="space-y-2">
              {targetFields.map((field) => (
                <li key={`target-${field.id}-${field.path}-${field.name}`}>
                  <button
                    type="button"
                    onClick={() => setSelectedTargetField(field)}
                    className={`w-full text-left p-2 rounded ${
                      selectedTargetField?.id === field.id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{field.name}</div>
                    <div className="text-sm text-gray-500">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-gray-200 mr-2">
                        {field.type}
                      </span>
                      {field.path}
                    </div>
                    {field.description && (
                      <div className="text-xs text-gray-500 mt-1">{field.description}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleCreateMapping}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {isMappingEntity ? t('mapping.mapEntireEntity') : t('mapping.createMapping')}
        </button>
      </div>
    </div>
  );
}; 