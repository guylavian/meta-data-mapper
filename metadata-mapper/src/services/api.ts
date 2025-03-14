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

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

class ApiService {
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/metadata/parse`, {
        method: 'HEAD',
      });
      return response.ok;
    } catch (error) {
      console.error('Server connection check failed:', error);
      return false;
    }
  }

  async parseMetadata(metadata: string): Promise<ParseMetadataResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/metadata/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metadata } as ParseMetadataRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to parse metadata:', error);
      throw error;
    }
  }

  async validateMapping(sourceField: Field, targetField: Field): Promise<ValidateMappingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/metadata/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceField, targetField } as ValidateMappingRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to validate mapping:', error);
      throw error;
    }
  }

  async applyMapping(metadata: string, rules: MappingRule[]): Promise<ApplyMappingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/metadata/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metadata, rules } as ApplyMappingRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to apply mapping:', error);
      throw error;
    }
  }
}

export const api = new ApiService(); 