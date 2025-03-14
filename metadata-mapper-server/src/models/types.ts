export interface Field {
  path: string;
  type: string;
  name: string;
  isArray?: boolean;
  isObject?: boolean;
  description?: string;
}

export interface Entity {
  name: string;
  path: string;
  fields: Field[];
}

export interface MappingRule {
  sourceField: string;
  targetField: string;
  transformation?: {
    type: 'direct' | 'format' | 'convert';
    config?: Record<string, any>;
  };
}

export interface TransformationConfig {
  type: 'direct' | 'format' | 'convert';
  sourceType: string;
  targetType: string;
  formatString?: string;
  customFunction?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface MappingValidation {
  sourceField: string;
  targetField: string;
  result: ValidationResult;
}

// API Request/Response Types
export interface ParseMetadataRequest {
  metadata: string;
}

export interface ParseMetadataResponse {
  entities: Entity[];
  error?: string;
}

export interface ValidateMappingRequest {
  sourceField: Field;
  targetField: Field;
}

export interface ValidateMappingResponse {
  valid: boolean;
  error?: string;
}

export interface ApplyMappingRequest {
  metadata: string;
  rules: MappingRule[];
}

export interface ApplyMappingResponse {
  result: any;
  error?: string;
}

export interface FetchMetadataRequest {
  url: string;
}

export interface FetchMetadataResponse {
  metadata: string;
  entities: Entity[];
  error?: string;
} 