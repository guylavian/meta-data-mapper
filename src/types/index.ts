export interface MetadataField {
  name: string;
  type: string;
  description?: string;
  required: boolean;
}

export interface EntityField {
  name: string;
  type: string;
  description?: string;
  required: boolean;
  mappedFrom?: string;
}

export interface Entity {
  name: string;
  fields: EntityField[];
}

export interface ApiMetadata {
  endpoint: string;
  method: string;
  fields: MetadataField[];
}

export interface Mapping {
  entityName: string;
  apiEndpoint: string;
  fieldMappings: {
    [key: string]: string; // entityField -> apiField
  };
} 