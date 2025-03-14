import { Entity, EntityField } from '../types/mapping';

export const extractEntities = (obj: any, prefix = ''): Entity[] => {
  const entities: Entity[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const sampleItem = value[0];
          const fields = extractFields(sampleItem);
          entities.push({
            path,
            name: key,
            fields
          });
        }
      } else {
        const fields = extractFields(value);
        entities.push({
          path,
          name: key,
          fields
        });
      }
    }
  }
  
  return entities;
};

export const extractFields = (obj: any, prefix = ''): EntityField[] => {
  const fields: EntityField[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      fields.push(...extractFields(value, path));
    } else {
      fields.push({
        path,
        type: typeof value,
        value
      });
    }
  }
  
  return fields;
}; 