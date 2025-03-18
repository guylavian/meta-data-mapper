import { Entity } from '../types/mapping';

export interface EMMField {
  name: string;
  type: string;
  path: string;
  description?: string;
  isRequired?: boolean;
  validation?: any;
}

export interface EMMEntity {
  name: string;
  fields: EMMField[];
}

export const emmService = {
  // Fetch EMM fields from the actual EMM system
  getEMMFields: async (): Promise<Entity[]> => {
    try {
      // TODO: Replace with actual EMM API endpoint
      const response = await fetch('/api/emm/fields');
      const emmData = await response.json();
      
      // Transform EMM data into our Entity format
      return emmData.map((emmEntity: EMMEntity) => ({
        id: emmEntity.name.toLowerCase().replace(/\s+/g, '_'),
        name: emmEntity.name,
        fields: emmEntity.fields.map((field, index) => ({
          id: `${emmEntity.name.toLowerCase()}_${field.name.toLowerCase()}`.replace(/\s+/g, '_'),
          name: field.name,
          type: field.type.toLowerCase(),
          path: field.path,
          description: field.description || `${field.name} field`,
          isRequired: field.isRequired,
          validation: field.validation
        }))
      }));
    } catch (error) {
      console.error('Error fetching EMM fields:', error);
      throw new Error('Failed to fetch EMM fields');
    }
  },

  // Get a specific EMM entity by name
  getEMMEntityByName: async (entityName: string): Promise<Entity | undefined> => {
    try {
      // TODO: Replace with actual EMM API endpoint
      const response = await fetch(`/api/emm/fields/${entityName}`);
      const emmEntity = await response.json();
      
      return {
        id: emmEntity.name.toLowerCase().replace(/\s+/g, '_'),
        name: emmEntity.name,
        fields: emmEntity.fields.map((field: EMMField, index: number) => ({
          id: `${emmEntity.name.toLowerCase()}_${field.name.toLowerCase()}`.replace(/\s+/g, '_'),
          name: field.name,
          type: field.type.toLowerCase(),
          path: field.path,
          description: field.description || `${field.name} field`,
          isRequired: field.isRequired,
          validation: field.validation
        }))
      };
    } catch (error) {
      console.error('Error fetching EMM entity:', error);
      return undefined;
    }
  }
}; 