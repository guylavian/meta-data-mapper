import { Entity } from '../types/mapping';

// Mock system entities that represent complete JSON objects with their nested structure
export const mockSystemEntities: Entity[] = [
  {
    id: 'pokemon',
    name: 'Pokemon Data',
    fields: [
      {
        id: 'id',
        name: 'ID',
        type: 'number',
        path: 'id',
        description: 'Pokemon ID'
      },
      {
        id: 'name',
        name: 'Name',
        type: 'string',
        path: 'name',
        description: 'Pokemon name'
      },
      {
        id: 'base_experience',
        name: 'Base Experience',
        type: 'number',
        path: 'base_experience',
        description: 'Base experience gained'
      },
      {
        id: 'height',
        name: 'Height',
        type: 'number',
        path: 'height',
        description: 'Height in decimeters'
      },
      {
        id: 'weight',
        name: 'Weight',
        type: 'number',
        path: 'weight',
        description: 'Weight in hectograms'
      },
      {
        id: 'types',
        name: 'Types',
        type: 'array',
        path: 'types',
        description: 'Pokemon types'
      },
      {
        id: 'types.slot',
        name: 'Type Slot',
        type: 'number',
        path: 'types[].slot',
        description: 'Type slot number'
      },
      {
        id: 'types.type',
        name: 'Type Info',
        type: 'object',
        path: 'types[].type',
        description: 'Type information'
      },
      {
        id: 'types.type.name',
        name: 'Type Name',
        type: 'string',
        path: 'types[].type.name',
        description: 'Type name'
      },
      {
        id: 'abilities',
        name: 'Abilities',
        type: 'array',
        path: 'abilities',
        description: 'Pokemon abilities'
      },
      {
        id: 'abilities.ability',
        name: 'Ability Info',
        type: 'object',
        path: 'abilities[].ability',
        description: 'Ability information'
      },
      {
        id: 'abilities.ability.name',
        name: 'Ability Name',
        type: 'string',
        path: 'abilities[].ability.name',
        description: 'Ability name'
      },
      {
        id: 'abilities.is_hidden',
        name: 'Is Hidden Ability',
        type: 'boolean',
        path: 'abilities[].is_hidden',
        description: 'Whether this is a hidden ability'
      }
    ]
  },
  {
    id: 'weather',
    name: 'Weather Data',
    fields: [
      {
        id: 'coord',
        name: 'Coordinates',
        type: 'object',
        path: 'coord',
        description: 'Location coordinates'
      },
      {
        id: 'coord.lat',
        name: 'Latitude',
        type: 'number',
        path: 'coord.lat',
        description: 'Location latitude'
      },
      {
        id: 'coord.lon',
        name: 'Longitude',
        type: 'number',
        path: 'coord.lon',
        description: 'Location longitude'
      },
      {
        id: 'weather',
        name: 'Weather',
        type: 'array',
        path: 'weather',
        description: 'Weather conditions'
      },
      {
        id: 'weather.main',
        name: 'Main Weather',
        type: 'string',
        path: 'weather[].main',
        description: 'Main weather condition'
      },
      {
        id: 'weather.description',
        name: 'Weather Description',
        type: 'string',
        path: 'weather[].description',
        description: 'Detailed weather description'
      },
      {
        id: 'main.temp',
        name: 'Temperature',
        type: 'number',
        path: 'main.temp',
        description: 'Current temperature'
      },
      {
        id: 'main.feels_like',
        name: 'Feels Like',
        type: 'number',
        path: 'main.feels_like',
        description: 'Feels like temperature'
      },
      {
        id: 'main.humidity',
        name: 'Humidity',
        type: 'number',
        path: 'main.humidity',
        description: 'Humidity percentage'
      }
    ]
  }
];

export const systemEntitiesService = {
  // Get all available system entities
  getEntities: async (): Promise<Entity[]> => {
    // In a real implementation, this would fetch from your actual system
    return mockSystemEntities;
  },

  // Get a specific entity by ID
  getEntityById: async (entityId: string): Promise<Entity | undefined> => {
    return mockSystemEntities.find(entity => entity.id === entityId);
  }
}; 