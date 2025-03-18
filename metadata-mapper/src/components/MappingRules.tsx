import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../contexts/RTLContext';

interface MappingRule {
  sourceField: string;
  targetField: string;
  transformation?: string;
}

interface MappingRulesProps {
  onRulesChange: (rules: MappingRule[]) => void;
  metadata: string;
}

interface EntityField {
  path: string;
  type: string;
  value: any;
}

interface Entity {
  path: string;
  name: string;
  fields: EntityField[];
}

// Example EMM target fields - replace these with your actual EMM fields
const EMM_TARGET_FIELDS = [
  {
    name: 'Basic Information',
    fields: [
      { path: 'id', type: 'string', description: 'Unique identifier' },
      { path: 'name', type: 'string', description: 'Entity name' },
      { path: 'description', type: 'string', description: 'Entity description' },
      { path: 'created_at', type: 'datetime', description: 'Creation timestamp' },
      { path: 'updated_at', type: 'datetime', description: 'Last update timestamp' }
    ]
  },
  {
    name: 'Classification',
    fields: [
      { path: 'type', type: 'string', description: 'Entity type' },
      { path: 'category', type: 'string', description: 'Entity category' },
      { path: 'tags', type: 'array', description: 'Entity tags' }
    ]
  },
  {
    name: 'Relationships',
    fields: [
      { path: 'parent_id', type: 'string', description: 'Parent entity ID' },
      { path: 'related_entities', type: 'array', description: 'Related entity IDs' }
    ]
  }
];

const MappingRules: React.FC<MappingRulesProps> = ({ onRulesChange, metadata }) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [rules, setRules] = useState<MappingRule[]>([]);
  const [availableEntities, setAvailableEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [selectedSourceFields, setSelectedSourceFields] = useState<Set<string>>(new Set());
  const [selectedTargetFields, setSelectedTargetFields] = useState<Set<string>>(new Set());
  const [step, setStep] = useState(1);
  const [mappingPairs, setMappingPairs] = useState<Map<string, string>>(new Map());

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

  const extractEntities = (obj: any, prefix = ''): Entity[] => {
    const entities: Entity[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            const sampleItem = value[0];
            const fields = extractFields(sampleItem);
            entities.push({
              path,
              name: key,
              fields
            });
          }
        } else {
          const fields = extractFields(value);
          entities.push({
            path,
            name: key,
            fields
          });
        }
      }
    }
    
    return entities;
  };

  const extractFields = (obj: any, prefix = ''): EntityField[] => {
    const fields: EntityField[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        fields.push(...extractFields(value, path));
      } else {
        fields.push({
          path,
          type: typeof value,
          value
        });
      }
    }
    
    return fields;
  };

  const handleEntitySelect = (entityPath: string) => {
    setSelectedEntity(entityPath);
    setSelectedSourceFields(new Set());
    setSelectedTargetFields(new Set());
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

  const getEntityFields = () => {
    if (!selectedEntity) return [];
    const entity = availableEntities.find(e => e.path === selectedEntity);
    return entity?.fields || [];
  };

  const renderStepIndicator = () => (
    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between mb-8`}>
      <div className={`flex items-center ${step >= 1 ? 'text-blue-500' : 'text-gray-400'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-500' : 'border-gray-300'}`}>
          1
        </div>
        <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{t('steps.selectData')}</span>
      </div>
      <div className={`flex items-center ${step >= 2 ? 'text-blue-500' : 'text-gray-400'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-500' : 'border-gray-300'}`}>
          2
        </div>
        <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{t('steps.chooseFields')}</span>
      </div>
      <div className={`flex items-center ${step >= 3 ? 'text-blue-500' : 'text-gray-400'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-500' : 'border-gray-300'}`}>
          3
        </div>
        <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{t('steps.mapFields')}</span>
      </div>
      <div className={`flex items-center ${step >= 4 ? 'text-blue-500' : 'text-gray-400'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 4 ? 'border-blue-500' : 'border-gray-300'}`}>
          4
        </div>
        <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{t('steps.review')}</span>
      </div>
    </div>
  );

  const addRule = () => {
    const newRules = [...rules, { sourceField: '', targetField: '' }];
    setRules(newRules);
    onRulesChange(newRules);
  };

  const updateRule = (index: number, field: keyof MappingRule, value: string) => {
    const newRules = rules.map((rule, i) => {
      if (i === index) {
        return { ...rule, [field]: value };
      }
      return rule;
    });
    setRules(newRules);
    onRulesChange(newRules);
  };

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
    onRulesChange(newRules);
  };

  return (
    <div className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('labels.mappingRules')}</h2>
        <p className="text-gray-600 mb-4">
          {t('instructions.mainDescription')}
        </p>
        {renderStepIndicator()}
      </div>

      {step === 1 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{t('steps.step1Title')}</h3>
          <p className="text-gray-600 mb-4">
            {t('steps.step1Description')}
          </p>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {availableEntities.map((entity) => (
              <div
                key={entity.path}
                className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedEntity === entity.path ? 'bg-blue-50 border-blue-500' : ''
                }`}
                onClick={() => handleEntitySelect(entity.path)}
              >
                <div className="flex-1">
                  <span className="font-medium text-lg">{entity.name}</span>
                  <p className="text-gray-500 text-sm mt-1">
                    {t('messages.containsFields', { count: entity.fields.length })}
                  </p>
                </div>
                <span className={`text-blue-500 transform ${isRTL ? 'rotate-180' : ''}`}>→</span>
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
                    <div key={field.path} 
                      className={`flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 mb-2 ${
                        selectedSourceFields.has(field.path) ? 'bg-blue-50 border-blue-500' : ''
                      }`}
                      onClick={() => handleSourceFieldSelect(field.path)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSourceFields.has(field.path)}
                        onChange={() => handleSourceFieldSelect(field.path)}
                        className="h-5 w-5"
                      />
                      <div className="flex-1">
                        <span className="font-medium">{field.path}</span>
                        <p className="text-gray-500 text-sm">{field.description}</p>
                      </div>
                      {selectedSourceFields.has(field.path) && (
                        <div className="text-blue-500">
                          {mappingPairs.get(field.path) ? (
                            <div className="flex items-center gap-2">
                              <span>→ {mappingPairs.get(field.path)}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newMappingPairs = new Map(mappingPairs);
                                  newMappingPairs.delete(field.path);
                                  setMappingPairs(newMappingPairs);
                                }}
                                className="text-red-500 hover:text-red-600 text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">Select a data field →</span>
                          )}
                        </div>
                      )}
                    </div>
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
                {getEntityFields().map((field) => (
                  <div
                    key={field.path}
                    className={`flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                      Array.from(mappingPairs.values()).includes(field.path) ? 'bg-blue-50 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      const unmappedEmmFields = Array.from(selectedSourceFields).filter(
                        emmField => !mappingPairs.has(emmField)
                      );
                      if (unmappedEmmFields.length > 0) {
                        handleTargetFieldSelect(field.path, unmappedEmmFields[unmappedEmmFields.length - 1]);
                      }
                    }}
                  >
                    <div className="flex-1">
                      <span className="font-medium">{field.path}</span>
                      <p className="text-gray-500 text-sm">Type: {field.type}</p>
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
              onClick={() => {
                setStep(1);
                setSelectedEntity(null);
                setSelectedSourceFields(new Set());
                setSelectedTargetFields(new Set());
                setRules([]);
              }}
            >
              Start New Mapping
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {rules.map((rule, index) => (
          <div key={index} className="flex space-x-4 items-start">
            <div className="flex-1">
              <input
                type="text"
                className={`w-full p-2 border rounded ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('labels.sourceField')}
                value={rule.sourceField}
                onChange={(e) => updateRule(index, 'sourceField', e.target.value)}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                className={`w-full p-2 border rounded ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('labels.targetField')}
                value={rule.targetField}
                onChange={(e) => updateRule(index, 'targetField', e.target.value)}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <button
              onClick={() => removeRule(index)}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t('buttons.remove')}
            </button>
          </div>
        ))}
        <button
          onClick={addRule}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('buttons.addRule')}
        </button>
      </div>
    </div>
  );
};

export default MappingRules; 