import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Entity, Field, MappingRule } from '../../types/mapping';
import { api } from '../../services/api';
import { RootState } from '../store';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';

interface MetadataState {
  entities: Entity[];
  selectedEntity: Entity | null;
  selectedSourceFields: Field[];
  mappingPairs: { source: Field; target: Field }[];
  step: number;
  loading: boolean;
  error: string | null;
  serverConnected: boolean;
  queryName: string;
  queryDescription: string;
  mappingsList: any[];
  selectedMapping: any | null;
  mappingsLoading: boolean;
  mappingsError: string | null;
}

const initialState: MetadataState = {
  entities: [],
  selectedEntity: null,
  selectedSourceFields: [],
  mappingPairs: [],
  step: 1,
  loading: false,
  error: null,
  serverConnected: false,
  queryName: '',
  queryDescription: '',
  mappingsList: [],
  selectedMapping: null,
  mappingsLoading: false,
  mappingsError: null,
};

export const checkServerConnection = createAsyncThunk(
  'metadata/checkServerConnection',
  async () => {
    return await api.checkConnection();
  }
);

export const parseMetadata = createAsyncThunk(
  'metadata/parseMetadata',
  async (metadata: string) => {
    return await api.parseMetadata(metadata);
  }
);

export const validateMapping = createAsyncThunk(
  'metadata/validateMapping',
  async ({ sourceField, targetField }: { sourceField: Field; targetField: Field }) => {
    return await api.validateMapping(sourceField, targetField);
  }
);

export const applyMapping = createAsyncThunk(
  'metadata/applyMapping',
  async ({ metadata, rules }: { metadata: string; rules: MappingRule[] }) => {
    return await api.applyMapping(metadata, rules);
  }
);

// --- Mapping Management Thunks ---
export const fetchMappings = createAsyncThunk(
  'metadata/fetchMappings',
  async () => {
    return await api.getMappings();
  }
);

export const fetchMapping = createAsyncThunk(
  'metadata/fetchMapping',
  async (id: string) => {
    return await api.getMapping(id);
  }
);

export const createMapping = createAsyncThunk(
  'metadata/createMapping',
  async (mapping: any) => {
    return await api.createMapping(mapping);
  }
);

export const updateMapping = createAsyncThunk(
  'metadata/updateMapping',
  async ({ id, mapping }: { id: string; mapping: any }) => {
    return await api.updateMapping(id, mapping);
  }
);

export const deleteMapping = createAsyncThunk(
  'metadata/deleteMapping',
  async (id: string) => {
    await api.deleteMapping(id);
    return id;
  }
);

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setEntities: (state: MetadataState, action: PayloadAction<Entity[]>) => {
      state.entities = action.payload;
    },
    setSelectedEntity: (state: MetadataState, action: PayloadAction<Entity>) => {
      state.selectedEntity = action.payload;
      state.selectedSourceFields = [];
      state.mappingPairs = [];
    },
    setSelectedSourceFields: (state: MetadataState, action: PayloadAction<Field[]>) => {
      state.selectedSourceFields = action.payload;
    },
    addMappingPair: (state: MetadataState, action: PayloadAction<{ source: Field; target: Field }>) => {
      state.mappingPairs.push(action.payload);
    },
    removeMappingPair: (state: MetadataState, action: PayloadAction<number>) => {
      state.mappingPairs = state.mappingPairs.filter((_, i: number) => i !== action.payload);
    },
    setStep: (state: MetadataState, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setLoading: (state: MetadataState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: MetadataState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setServerConnected: (state: MetadataState, action: PayloadAction<boolean>) => {
      state.serverConnected = action.payload;
    },
    setQueryName: (state: MetadataState, action: PayloadAction<string>) => {
      state.queryName = action.payload;
    },
    setQueryDescription: (state: MetadataState, action: PayloadAction<string>) => {
      state.queryDescription = action.payload;
    },
    resetMapping: (state: MetadataState) => {
      return { ...initialState, serverConnected: state.serverConnected };
    },
    setMappingsList: (state: MetadataState, action: PayloadAction<any[]>) => {
      state.mappingsList = action.payload;
    },
    setSelectedMapping: (state: MetadataState, action: PayloadAction<any | null>) => {
      state.selectedMapping = action.payload;
    },
    resetMappingManagement: (state: MetadataState) => {
      state.mappingsList = [];
      state.selectedMapping = null;
      state.mappingsLoading = false;
      state.mappingsError = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<MetadataState>) => {
    builder
      .addCase(checkServerConnection.pending, (state: MetadataState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkServerConnection.fulfilled, (state: MetadataState, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.serverConnected = action.payload;
      })
      .addCase(checkServerConnection.rejected, (state: MetadataState, action: any) => {
        state.loading = false;
        state.serverConnected = false;
        state.error = action.error.message || 'Failed to check server connection';
      })
      .addCase(parseMetadata.pending, (state: MetadataState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parseMetadata.fulfilled, (state: MetadataState, action: PayloadAction<Entity[]>) => {
        state.loading = false;
        state.entities = action.payload;
      })
      .addCase(parseMetadata.rejected, (state: MetadataState, action: any) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to parse metadata';
      })
      .addCase(validateMapping.pending, (state: MetadataState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateMapping.fulfilled, (state: MetadataState) => {
        state.loading = false;
      })
      .addCase(validateMapping.rejected, (state: MetadataState, action: any) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to validate mapping';
      })
      .addCase(applyMapping.pending, (state: MetadataState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyMapping.fulfilled, (state: MetadataState) => {
        state.loading = false;
      })
      .addCase(applyMapping.rejected, (state: MetadataState, action: any) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to apply mapping';
      })
      // --- Mapping Management ---
      .addCase(fetchMappings.pending, (state: MetadataState) => {
        state.mappingsLoading = true;
        state.mappingsError = null;
      })
      .addCase(fetchMappings.fulfilled, (state: MetadataState, action: PayloadAction<any[]>) => {
        state.mappingsLoading = false;
        state.mappingsList = action.payload;
      })
      .addCase(fetchMappings.rejected, (state: MetadataState, action: any) => {
        state.mappingsLoading = false;
        state.mappingsError = action.error.message || 'Failed to fetch mappings';
      })
      .addCase(fetchMapping.pending, (state: MetadataState) => {
        state.mappingsLoading = true;
        state.mappingsError = null;
      })
      .addCase(fetchMapping.fulfilled, (state: MetadataState, action: PayloadAction<any>) => {
        state.mappingsLoading = false;
        state.selectedMapping = action.payload;
      })
      .addCase(fetchMapping.rejected, (state: MetadataState, action: any) => {
        state.mappingsLoading = false;
        state.mappingsError = action.error.message || 'Failed to fetch mapping';
      })
      .addCase(createMapping.pending, (state: MetadataState) => {
        state.mappingsLoading = true;
        state.mappingsError = null;
      })
      .addCase(createMapping.fulfilled, (state: MetadataState, action: PayloadAction<any>) => {
        state.mappingsLoading = false;
        state.mappingsList.push(action.payload);
      })
      .addCase(createMapping.rejected, (state: MetadataState, action: any) => {
        state.mappingsLoading = false;
        state.mappingsError = action.error.message || 'Failed to create mapping';
      })
      .addCase(updateMapping.pending, (state: MetadataState) => {
        state.mappingsLoading = true;
        state.mappingsError = null;
      })
      .addCase(updateMapping.fulfilled, (state: MetadataState, action: PayloadAction<any>) => {
        state.mappingsLoading = false;
        const idx = state.mappingsList.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) {
          state.mappingsList[idx] = action.payload;
        }
        if (state.selectedMapping && state.selectedMapping._id === action.payload._id) {
          state.selectedMapping = action.payload;
        }
      })
      .addCase(updateMapping.rejected, (state: MetadataState, action: any) => {
        state.mappingsLoading = false;
        state.mappingsError = action.error.message || 'Failed to update mapping';
      })
      .addCase(deleteMapping.pending, (state: MetadataState) => {
        state.mappingsLoading = true;
        state.mappingsError = null;
      })
      .addCase(deleteMapping.fulfilled, (state: MetadataState, action: PayloadAction<string>) => {
        state.mappingsLoading = false;
        state.mappingsList = state.mappingsList.filter(m => m._id !== action.payload);
        if (state.selectedMapping && state.selectedMapping._id === action.payload) {
          state.selectedMapping = null;
        }
      })
      .addCase(deleteMapping.rejected, (state: MetadataState, action: any) => {
        state.mappingsLoading = false;
        state.mappingsError = action.error.message || 'Failed to delete mapping';
      });
  },
});

export const {
  setEntities,
  setSelectedEntity,
  setSelectedSourceFields,
  addMappingPair,
  removeMappingPair,
  setStep,
  setLoading,
  setError,
  setServerConnected,
  setQueryName,
  setQueryDescription,
  resetMapping,
  setMappingsList,
  setSelectedMapping,
  resetMappingManagement
} = metadataSlice.actions;

// Selectors
export const selectMetadata = (state: RootState) => state.metadata;

export default metadataSlice.reducer; 