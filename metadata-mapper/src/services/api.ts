import {
  Entity,
  Field,
  MappingRule,
  ValidationResult,
  ParseMetadataRequest,
  ParseMetadataResponse,
  ValidateMappingRequest,
  ValidateMappingResponse,
  ApplyMappingRequest,
  ApplyMappingResponse
} from '../types/mapping';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Mock data for testing without a backend
const extractFields = (obj: any, parentPath: string = ''): Field[] => {
  const fields: Field[] = [];
  
  if (obj === null || obj === undefined) return fields;
  
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      // Handle array type
      if (obj.length > 0) {
        // Add array field
        fields.push({
          id: parentPath,
          name: parentPath.split('.').pop() || '',
          path: parentPath,
          type: 'array',
          description: `Array with ${obj.length} items`
        });
        
        // Process first item as example
        if (typeof obj[0] === 'object') {
          fields.push(...extractFields(obj[0], `${parentPath}[0]`));
        }
      }
    } else {
      // Handle object type
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;
        const valueType = Array.isArray(value) ? 'array' : typeof value;
        
        // Add field for current property
        fields.push({
          id: currentPath,
          name: key,
          path: currentPath,
          type: valueType,
          description: `${key} (${valueType})`
        });
        
        // Recursively process nested objects and arrays
        if (typeof value === 'object' && value !== null) {
          fields.push(...extractFields(value, currentPath));
        }
      });
    }
  }
  
  return fields;
};

const mockParseResponse = (metadata: string): ParseMetadataResponse => {
  try {
    console.log('Parsing metadata in mock implementation:', metadata.substring(0, 100) + '...');
    const parsedData = JSON.parse(metadata);
    
    // Use the generic field extraction
    const fields = extractFields(parsedData);
    console.log(`Extracted ${fields.length} fields from metadata`);
    
    const response = {
      entities: [{
        id: 'root',
        name: 'Root Entity',
        fields: fields
      }],
      errors: []
    };
    
    console.log('Mock parse response:', JSON.stringify(response, null, 2).substring(0, 200) + '...');
    return response;
  } catch (error) {
    console.error('Error parsing metadata:', error);
    throw new Error('Failed to parse metadata');
  }
};

const mockApplyMapping = (metadata: string, rules: MappingRule[]): ApplyMappingResponse => {
  try {
    const parsedData = JSON.parse(metadata);
    const result: Record<string, any> = {};
    
    rules.forEach(rule => {
      const { sourceField, targetField } = rule;
      const pathParts = sourceField.path.split('.');
      
      let value = parsedData;
      for (const part of pathParts) {
        if (part.includes('[') && part.includes(']')) {
          const arrayName = part.substring(0, part.indexOf('['));
          const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')));
          value = value[arrayName]?.[index];
        } else {
          value = value[part];
        }
        
        if (value === undefined) break;
      }
      
      if (value !== undefined) {
        const targetParts = targetField.path.split('.');
        let current = result;
        
        for (let i = 0; i < targetParts.length - 1; i++) {
          const part = targetParts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        
        current[targetParts[targetParts.length - 1]] = value;
      }
    });
    
    return {
      result,
      errors: []
    };
  } catch (error) {
    console.error('Error applying mapping:', error);
    return {
      result: null,
      errors: ['Failed to apply mapping rules']
    };
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

class ApiService {
  async fetchMetadata(url: string): Promise<any> {
    try {
      console.log('Fetching metadata from URL:', url);
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      throw error;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      // For mock implementation, always return true
      return true;
    } catch (error) {
      console.error('Server connection check failed:', error);
      return false;
    }
  }

  async parseMetadata(metadata: string): Promise<ParseMetadataResponse> {
    try {
      console.log('parseMetadata called with metadata length:', metadata.length);
      
      // Check if we can connect to the real API
      const isConnected = await this.checkConnection();
      
      if (isConnected) {
        try {
          console.log('Attempting to connect to real API at:', `${API_BASE_URL}/metadata/parse`);
          const response = await fetch(`${API_BASE_URL}/metadata/parse`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ metadata } as ParseMetadataRequest),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Real API response:', JSON.stringify(data).substring(0, 200) + '...');
            
            // Extract fields from the raw response data
            const parsedMetadata = JSON.parse(metadata);
            const fields = extractFields(parsedMetadata);
            console.log(`Extracted ${fields.length} fields from metadata`);
            
            return {
              entities: [{
                id: 'root',
                name: 'Root Entity',
                fields: fields
              }],
              errors: []
            };
          } else {
            console.warn('API server returned error status:', response.status);
          }
        } catch (error) {
          console.warn('API server not available, using mock implementation:', error);
        }
      }
      
      // Fall back to mock implementation
      console.log('Using mock implementation for parseMetadata');
      const mockResponse = mockParseResponse(metadata);
      console.log('Mock response:', JSON.stringify(mockResponse, null, 2));
      return mockResponse;
    } catch (error) {
      console.error('Failed to parse metadata:', error);
      throw new Error('Failed to parse metadata: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  async validateMapping(sourceField: Field, targetField: Field): Promise<ValidateMappingResponse> {
    try {
      // For mock implementation, always return valid
      return {
        isValid: true,
        errors: []
      };
    } catch (error) {
      console.error('Failed to validate mapping:', error);
      throw error;
    }
  }

  async applyMapping(metadata: string, rules: MappingRule[]): Promise<ApplyMappingResponse> {
    try {
      console.log('applyMapping called with rules:', rules);
      
      // Check if we can connect to the real API
      const isConnected = await this.checkConnection();
      
      if (isConnected) {
        try {
          console.log('Attempting to connect to real API for mapping');
          const response = await fetch(`${API_BASE_URL}/metadata/apply`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ metadata, rules } as ApplyMappingRequest),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Real API mapping response:', JSON.stringify(data).substring(0, 200) + '...');
            return data;
          } else {
            console.warn('API server returned error status for mapping:', response.status);
          }
        } catch (error) {
          console.warn('API server not available for mapping, using mock implementation:', error);
        }
      }
      
      console.log('Using mock implementation for applyMapping');
      // Fall back to mock implementation
      return mockApplyMapping(metadata, rules);
    } catch (error) {
      console.error('Failed to apply mapping:', error);
      throw error;
    }
  }
}

export const api = new ApiService(); 