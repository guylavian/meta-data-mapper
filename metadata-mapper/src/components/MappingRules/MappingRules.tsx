import React, { useMemo, useCallback } from 'react';
import { MappingRule, Entity } from '../../types/mapping';
import { EMM_TARGET_FIELDS } from '../../constants/emmFields';
import { StepIndicator } from '../StepIndicator/StepIndicator';
import { FieldSelector } from '../FieldSelector/FieldSelector';
import { useMapping } from '../../hooks/useMapping';

interface MappingRulesProps {
  onRulesChange: (rules: MappingRule[]) => void;
  metadata: string;
}

const STEPS = [
  { number: 1, label: 'Select Data' },
  { number: 2, label: 'Choose Fields' },
  { number: 3, label: 'Map Fields' },
  { number: 4, label: 'Review' }
];

export const MappingRules: React.FC<MappingRulesProps> = ({ onRulesChange, metadata }) => {
  const {
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
  } = useMapping(metadata, onRulesChange);

  const entityFields = useMemo(() => {
    if (!selectedEntity) return [];
    const entity = availableEntities.find(e => e.path === selectedEntity);
    return entity?.fields || [];
  }, [selectedEntity, availableEntities]);

  const mappedSourceFields = useMemo(() => 
    new Set(Array.from(mappingPairs.keys())),
    [mappingPairs]
  );

  const mappedTargetFields = useMemo(() => 
    new Set(Array.from(mappingPairs.values())),
    [mappingPairs]
  );

  const handleFieldMapping = useCallback((targetField: string) => {
    const selectedEmmField = Array.from(selectedSourceFields)
      .find(emmField => !mappingPairs.has(emmField));
    if (selectedEmmField) {
      handleTargetFieldSelect(targetField, selectedEmmField);
    }
  }, [selectedSourceFields, mappingPairs, handleTargetFieldSelect]);

  const removeMapping = useCallback((sourceField: string) => {
    const newMappingPairs = new Map(mappingPairs);
    newMappingPairs.delete(sourceField);
    setMappingPairs(newMappingPairs);
  }, [mappingPairs, setMappingPairs]);

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Map Your Data</h2>
        <p className="text-gray-600 mb-4">
          Follow these steps to map your data to the Entity Metadata Manager (EMM) format.
          We'll guide you through selecting your data and mapping it to the appropriate fields.
        </p>
        <StepIndicator currentStep={step} steps={STEPS} />
      </div>

      {step === 1 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Step 1: Select Your Data</h3>
          <p className="text-gray-600 mb-4">
            Choose the data you want to map. This could be information about a person, place, thing, or any other entity.
          </p>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {availableEntities.map((entity) => (
              <div
                key={entity.path}
                className={`flex items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedEntity === entity.path ? 'bg-blue-50 border-blue-500' : ''
                }`}
                onClick={() => handleEntitySelect(entity.path)}
              >
                <div className="flex-1">
                  <span className="font-medium text-lg">{entity.name}</span>
                  <p className="text-gray-500 text-sm mt-1">
                    Contains {entity.fields.length} fields of information
                  </p>
                </div>
                <span className="text-blue-500">→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedEntity && (
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">EMM Fields (Source)</h3>
            <p className="text-gray-600 mb-4">
              Select the EMM fields that you want to map from.
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
              {EMM_TARGET_FIELDS.map((group) => (
                <div key={group.name} className="mb-4">
                  <h4 className="font-medium text-lg mb-2">{group.name}</h4>
                  {group.fields.map((field) => (
                    <FieldSelector
                      key={field.path}
                      field={field}
                      isSelected={selectedSourceFields.has(field.path)}
                      isMatched={mappedSourceFields.has(field.path)}
                      matchedField={mappingPairs.get(field.path)}
                      onSelect={() => handleSourceFieldSelect(field.path)}
                      onRemoveMatch={() => removeMapping(field.path)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">API Data Fields (Target)</h3>
            <p className="text-gray-600 mb-4">
              For each selected EMM field, choose a matching field from your data.
            </p>
            {selectedSourceFields.size > 0 ? (
              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                {entityFields.map((field) => (
                  <div
                    key={field.path}
                    className={`flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                      mappedTargetFields.has(field.path) ? 'bg-blue-50 border-blue-500' : ''
                    }`}
                    onClick={() => handleFieldMapping(field.path)}
                  >
                    <div className="flex-1">
                      <span className="font-medium">{field.path}</span>
                      <p className="text-gray-500 text-sm">Type: {field.type}</p>
                      {!mappedTargetFields.has(field.path) && (
                        <p className="text-blue-500 text-sm mt-1">
                          Click to map to selected EMM field
                        </p>
                      )}
                    </div>
                    {Array.from(mappingPairs.entries())
                      .filter(([_, dataField]) => dataField === field.path)
                      .map(([emmField]) => (
                        <div key={emmField} className="text-blue-500">
                          <span>← {emmField}</span>
                        </div>
                      ))
                    }
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-gray-500 text-center">Select EMM fields first to start mapping</p>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && mappingPairs.size > 0 && (
        <div className="mt-8 flex justify-end">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
            onClick={() => setStep(3)}
          >
            Continue to Review
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Step 3: Review Your Mapping</h3>
          <div className="space-y-4">
            {Array.from(mappingPairs.entries()).map(([emmField, dataField]) => (
              <div key={emmField} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <span className="font-medium">{emmField}</span>
                  <p className="text-gray-500 text-sm">
                    {EMM_TARGET_FIELDS.flatMap(g => g.fields)
                      .find(f => f.path === emmField)?.description}
                  </p>
                </div>
                <span className="text-2xl text-gray-400">→</span>
                <div className="flex-1">
                  <span className="font-medium">{dataField.split('.').pop()}</span>
                  <p className="text-gray-500 text-sm">{dataField}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={generateRules}
            >
              Generate Mapping
            </button>
          </div>
        </div>
      )}

      {step === 4 && rules.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Step 4: Mapping Complete!</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">
              Your mapping has been generated successfully. The data will be transformed according to these rules:
            </p>
          </div>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium">{rule.sourceField}</span>
                  <p className="text-gray-500 text-sm">
                    {EMM_TARGET_FIELDS.flatMap(g => g.fields)
                      .find(f => f.path === rule.sourceField)?.description}
                  </p>
                </div>
                <span className="text-2xl text-gray-400">→</span>
                <div className="flex-1">
                  <span className="font-medium">{rule.targetField.split('.').pop()}</span>
                  <p className="text-gray-500 text-sm">{rule.targetField}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={resetMapping}
            >
              Start New Mapping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 