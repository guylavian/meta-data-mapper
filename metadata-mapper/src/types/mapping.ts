export interface Field {
  id: string;
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  path: string;
}

export interface Entity {
  id: string;
  name: string;
  description?: string;
  fields: Field[];
}

export interface MappingRule {
  sourceField: Field;
  targetField: Field;
  transformation?: {
    type: 'direct' | 'format' | 'convert';
    sourceType?: string;
    targetType?: string;
    format?: string;
    options?: Record<string, any>;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface ParseMetadataResponse {
  entities: Entity[];
}

export interface ValidateMappingResponse {
  result: ValidationResult;
}

export interface ApplyMappingResponse {
  result: Record<string, any>;
}

export interface FetchMetadataResponse {
  metadata: string;
}

export interface FetchMetadataRequest {
  url: string;
}

export interface ParseMetadataRequest {
  metadata: string;
}

export interface ValidateMappingRequest {
  sourceField: Field;
  targetField: Field;
}

export interface ApplyMappingRequest {
  metadata: string;
  rules: MappingRule[];
} 