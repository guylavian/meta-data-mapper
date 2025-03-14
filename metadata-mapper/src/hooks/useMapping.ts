import { useState, useEffect } from 'react';
import { MappingRule, Entity } from '../types/mapping';
import { extractEntities } from '../utils/metadataExtractor';

export const useMapping = (metadata: string, onRulesChange: (rules: MappingRule[]) => void) => {
  const [rules, setRules] = useState<MappingRule[]>([]);
  const [availableEntities, setAvailableEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [selectedSourceFields, setSelectedSourceFields] = useState<Set<string>>(new Set());
  const [mappingPairs, setMappingPairs] = useState<Map<string, string>>(new Map());
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (metadata) {
      try {
        const parsedMetadata = JSON.parse(metadata);
        const entities = extractEntities(parsedMetadata);
        setAvailableEntities(entities);
      } catch (error) {
        console.error('Failed to parse metadata:', error);
      }
    }
  }, [metadata]);

  const handleEntitySelect = (entityPath: string) => {
    setSelectedEntity(entityPath);
    setSelectedSourceFields(new Set());
    setMappingPairs(new Map());
    setRules([]);
    setStep(2);
  };

  const handleSourceFieldSelect = (emmField: string) => {
    const newSelectedFields = new Set(selectedSourceFields);
    if (newSelectedFields.has(emmField)) {
      newSelectedFields.delete(emmField);
      const newMappingPairs = new Map(mappingPairs);
      newMappingPairs.delete(emmField);
      setMappingPairs(newMappingPairs);
    } else {
      newSelectedFields.add(emmField);
    }
    setSelectedSourceFields(newSelectedFields);
  };

  const handleTargetFieldSelect = (dataField: string, emmField: string) => {
    const newMappingPairs = new Map(mappingPairs);
    newMappingPairs.set(emmField, dataField);
    setMappingPairs(newMappingPairs);
  };

  const generateRules = () => {
    if (!selectedEntity || mappingPairs.size === 0) return;

    const newRules: MappingRule[] = Array.from(mappingPairs.entries()).map(([emmField, dataField]) => ({
      sourceField: emmField,
      targetField: dataField,
    }));
    setRules(newRules);
    onRulesChange(newRules);
    setStep(4);
  };

  const resetMapping = () => {
    setStep(1);
    setSelectedEntity(null);
    setSelectedSourceFields(new Set());
    setMappingPairs(new Map());
    setRules([]);
  };

  return {
    rules,
    availableEntities,
    selectedEntity,
    selectedSourceFields,
    mappingPairs,
    step,
    handleEntitySelect,
    handleSourceFieldSelect,
    handleTargetFieldSelect,
    generateRules,
    resetMapping,
    setStep,
    setMappingPairs
  };
}; 