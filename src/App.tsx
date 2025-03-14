import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ApiMetadataForm from './components/ApiMetadataForm';
import EntityForm from './components/EntityForm';
import MappingBuilder from './components/MappingBuilder';
import QueryPreview from './components/QueryPreview';
import { ApiMetadata, Entity, Mapping } from './types';

const queryClient = new QueryClient();

function App() {
  const [apiMetadata, setApiMetadata] = useState<ApiMetadata | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Metadata Mapper</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">API Metadata</h2>
                  <ApiMetadataForm onMetadataChange={setApiMetadata} />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Entity Definition</h2>
                  <EntityForm onEntitiesChange={setEntities} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Field Mapping</h2>
                  <MappingBuilder
                    apiMetadata={apiMetadata}
                    entities={entities}
                    onMappingsChange={setMappings}
                  />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Query Preview</h2>
                  <QueryPreview mappings={mappings} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App; 