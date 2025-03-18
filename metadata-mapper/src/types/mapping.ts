export interface Field {
  id: string;
  name: string;
  type: string;
  path: string;
  description?: string;
  isRequired?: boolean;
  validation?: any;
}

export interface Entity {
  id: string;
  name: string;
  fields: Field[];
}

export interface MappingRule {
  id: string;
  sourceField: Field;
  targetField: Field;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface ParseMetadataRequest {
  metadata: string;
}

export interface ParseMetadataResponse {
  entities: Entity[];
  errors?: string[];
}

export interface ValidateMappingRequest {
  sourceField: Field;
  targetField: Field;
}

export interface ValidateMappingResponse {
  isValid: boolean;
  message?: string;
  errors?: string[];
}

export interface ApplyMappingRequest {
  metadata: string;
  rules: MappingRule[];
}

export interface ApplyMappingResponse {
  result: any;
  errors?: string[];
}

export interface FetchMetadataResponse {
  metadata: string;
}

export interface FetchMetadataRequest {
  url: string;
} 