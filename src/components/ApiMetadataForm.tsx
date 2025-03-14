import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApiMetadata } from '../types';

interface ApiMetadataFormProps {
  onMetadataChange: (metadata: ApiMetadata) => void;
}

const ApiMetadataForm: React.FC<ApiMetadataFormProps> = ({ onMetadataChange }) => {
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('GET');
  const [isLoading, setIsLoading] = useState(false);

  const fetchMetadata = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(endpoint);
      // In a real application, you would parse the response to extract metadata
      // This is a simplified example
      const metadata: ApiMetadata = {
        endpoint,
        method,
        fields: Object.keys(response.data).map(key => ({
          name: key,
          type: typeof response.data[key],
          required: false,
        })),
      };
      onMetadataChange(metadata);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700">
          API Endpoint
        </label>
        <input
          type="text"
          id="endpoint"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://api.example.com/endpoint"
        />
      </div>

      <div>
        <label htmlFor="method" className="block text-sm font-medium text-gray-700">
          HTTP Method
        </label>
        <select
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <button
        onClick={fetchMetadata}
        disabled={isLoading || !endpoint}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Fetching...' : 'Fetch Metadata'}
      </button>
    </div>
  );
};

export default ApiMetadataForm; 