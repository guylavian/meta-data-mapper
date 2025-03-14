import React, { useState } from 'react'
import MetadataInput from './components/MetadataInput'
import MappingRules from './components/MappingRules'
import MappedResult from './components/MappedResult'

interface MappingRule {
  sourceField: string;
  targetField: string;
  transformation?: string;
}

function App() {
  const [metadata, setMetadata] = useState('');
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([]);
  const [mappedResult, setMappedResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMetadataChange = (newMetadata: string) => {
    setMetadata(newMetadata);
    applyMapping(newMetadata, mappingRules);
  };

  const handleRulesChange = (newRules: MappingRule[]) => {
    setMappingRules(newRules);
    applyMapping(metadata, newRules);
  };

  const applyMapping = (sourceMetadata: string, rules: MappingRule[]) => {
    try {
      const sourceData = JSON.parse(sourceMetadata);
      const result: any = {};

      rules.forEach(rule => {
        const sourceValue = getNestedValue(sourceData, rule.sourceField);
        if (sourceValue !== undefined) {
          setNestedValue(result, rule.targetField, sourceValue);
        }
      });

      setMappedResult(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply mapping');
      setMappedResult(null);
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  const setNestedValue = (obj: any, path: string, value: any): void => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Metadata Mapper</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <MetadataInput onMetadataChange={handleMetadataChange} />
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <MappingRules 
              onRulesChange={handleRulesChange} 
              metadata={metadata}
            />
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow">
          <MappedResult result={mappedResult} error={error} />
        </div>
      </div>
    </div>
  )
}

export default App
