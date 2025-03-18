import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { RTLProvider } from './contexts/RTLContext';
import { MetadataInput } from './components/MetadataInput/MetadataInput';
import { MappingRules } from './components/MappingRules/MappingRules';
import { MappedResult } from './components/MappedResult/MappedResult';
import { EntityViewer } from './components/EntityViewer/EntityViewer';
import { api } from './services/api';
import { Field, MappingRule } from './types/mapping';
import { StepIndicator } from './components/StepIndicator/StepIndicator';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import './i18n';
import './styles/rtl.css';

const steps = [
  { key: 'metadata', title: 'steps.selectData', description: 'steps.metadataDesc' },
  { key: 'selectEntity', title: 'steps.selectEntity', description: 'steps.selectEntityDesc' },
  { key: 'fields', title: 'steps.chooseFields', description: 'steps.chooseFieldsDesc' },
  { key: 'mapping', title: 'steps.mapFields', description: 'steps.mappingDesc' },
  { key: 'result', title: 'steps.review', description: 'steps.resultDesc' },
];

function App() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [sourceMetadata, setSourceMetadata] = useState('');
  const [sourceFields, setSourceFields] = useState<Field[]>([]);
  const [targetFields, setTargetFields] = useState<Field[]>([]);
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([]);
  const [mappedResult, setMappedResult] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [availableEntities, setAvailableEntities] = useState<{ name: string; fields: Field[] }[]>([]);

  const handleMetadataSubmit = useCallback(async (metadata: string) => {
    try {
      console.log('Starting metadata submission...');
      setIsLoading(true);
      setErrors([]);
      
      // Parse the source metadata first
      const sourceFields = extractFieldsFromJson(metadata);
      console.log('Extracted source fields:', sourceFields);
      
      // Group fields by entity (parent path)
      const entities = sourceFields.reduce((acc, field) => {
        const entityPath = field.path.split('.')[0];
        if (!acc[entityPath]) {
          acc[entityPath] = [];
        }
        acc[entityPath].push(field);
        return acc;
      }, {} as Record<string, Field[]>);

      const entityList = Object.entries(entities).map(([name, fields]) => ({
        name,
        fields
      }));

      console.log('Available entities:', entityList);
      setAvailableEntities(entityList);
      
      // Then get the API response
      const response = await api.parseMetadata(metadata);
      console.log('Received API response:', response);
      
      if (!response || !response.entities || response.entities.length === 0) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from API');
      }
      
      const apiFields = response.entities[0]?.fields || [];
      console.log(`Processing ${apiFields.length} API fields...`);
      
      // Update states
      setSourceMetadata(metadata);
      setTargetFields(apiFields);
      
      // Move to entity selection step
      Promise.resolve().then(() => {
        console.log('Updating current step to 1');
        setCurrentStep(1);
      });
      
    } catch (error) {
      console.error('Error in handleMetadataSubmit:', error);
      setErrors([error instanceof Error ? error.message : 'Failed to parse metadata']);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEntitySelect = useCallback((entityName: string) => {
    console.log('Selected entity:', entityName);
    const entityFields = availableEntities.find(e => e.name === entityName)?.fields || [];
    setSelectedEntity(entityName);
    setSourceFields(entityFields);
    setCurrentStep(2);
  }, [availableEntities]);

  // Helper function to extract fields from JSON
  const extractFieldsFromJson = (jsonString: string): Field[] => {
    try {
      const parsed = JSON.parse(jsonString);
      const fields: Field[] = [];
      let idCounter = 0;
      
      const processValue = (value: any, path: string[] = [], name: string = ''): void => {
        if (value === null) {
          fields.push({
            id: `field_${++idCounter}`,
            name: name || path[path.length - 1] || 'root',
            path: path.join('.'),
            type: 'null',
            description: 'Null value'
          });
          return;
        }

        const type = Array.isArray(value) ? 'array' : typeof value;
        
        if (type === 'object' || type === 'array') {
          fields.push({
            id: `field_${++idCounter}`,
            name: name || path[path.length - 1] || 'root',
            path: path.join('.'),
            type,
            description: `${type === 'array' ? 'Array of' : 'Object containing'} nested values`
          });

          if (type === 'object') {
            Object.entries(value).forEach(([key, val]) => {
              processValue(val, [...path, key], key);
            });
          } else if (type === 'array' && value.length > 0) {
            // For arrays, we'll process the first item to understand the structure
            processValue(value[0], [...path, '0'], '0');
          }
        } else {
          fields.push({
            id: `field_${++idCounter}`,
            name: name || path[path.length - 1] || 'root',
            path: path.join('.'),
            type,
            description: `${type} value`
          });
        }
      };

      processValue(parsed);
      return fields;
    } catch (error) {
      console.error('Error extracting fields from JSON:', error);
      return [];
    }
  };

  const handleRulesChange = useCallback(async (rules: MappingRule[]) => {
    console.log('handleRulesChange called with rules:', rules);
    try {
      setIsLoading(true);
      setErrors([]);
      setMappingRules(rules);

      if (rules.length > 0) {
        console.log('Calling api.applyMapping...');
        const response = await api.applyMapping(sourceMetadata, rules);
        console.log('Mapping response received:', response);
        
        setMappedResult(response.result);
        if (response.errors?.length) {
          setErrors(response.errors);
        }
        
        console.log('Moving to step 4 (result step)');
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Error in handleRulesChange:', error);
      setErrors([error instanceof Error ? error.message : 'Failed to apply mapping']);
    } finally {
      setIsLoading(false);
    }
  }, [sourceMetadata]);

  const handleStepClick = useCallback((stepIndex: number) => {
    console.log('handleStepClick called with stepIndex:', stepIndex);
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  }, [currentStep]);

  const handleFieldsSelection = useCallback(() => {
    console.log('handleFieldsSelection called, moving to step 3 (mapping step)');
    setCurrentStep(3);
  }, []);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="card-body">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t('steps.step1Title')}
              </h2>
              <p className="text-gray-600">
                {t('steps.step1Description')}
              </p>
            </div>
            <MetadataInput
              onSubmit={handleMetadataSubmit}
              isLoading={isLoading}
            />
          </div>
        );
      case 1:
        return (
          <div className="card-body">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t('steps.selectEntity')}
              </h2>
              <p className="text-gray-600">
                {t('steps.selectEntityDesc')}
              </p>
              <div className="mt-4 space-y-4">
                {availableEntities.map((entity) => (
                  <div
                    key={entity.name}
                    className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                    onClick={() => handleEntitySelect(entity.name)}
                  >
                    <h3 className="text-lg font-medium text-gray-800">{entity.name}</h3>
                    <p className="text-sm text-gray-500">
                      {t('entities.fieldCount', { count: entity.fields.length })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="card-body">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t('steps.chooseFields')}
              </h2>
              <p className="text-gray-600">
                {t('steps.chooseFieldsDesc')}
              </p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {t('messages.selectedEntity', { entity: selectedEntity })}
                </p>
                <EntityViewer 
                  sourceFields={sourceFields} 
                  targetFields={targetFields}
                  onStepClick={handleStepClick}
                />
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={handleFieldsSelection}
                    className="btn-primary"
                  >
                    {t('buttons.continue')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="card-body">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t('steps.mapFields')}
              </h2>
              <p className="text-gray-600">
                {t('messages.mappingInstructions')}
              </p>
            </div>
            <MappingRules
              sourceFields={sourceFields}
              targetFields={targetFields}
              onRulesChange={handleRulesChange}
              isLoading={isLoading}
            />
          </div>
        );
      case 4:
        return (
          <div className="card-body">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t('steps.review')}
              </h2>
              <p className="text-gray-600">
                {t('messages.reviewInstructions')}
              </p>
            </div>
            <MappedResult
              result={mappedResult}
              errors={errors}
              isLoading={isLoading}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <RTLProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t('labels.title')}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('instructions.mainDescription')}
                  </p>
                </div>
                <LanguageSwitcher />
              </div>

              <StepIndicator
                steps={steps}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />

              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
    </RTLProvider>
  );
}

export default App;
