import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Entity, Field, MappingRule } from '../../types/mapping';
import { api } from '../../services/api';
import { RootState } from '../store';

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

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setEntities: (state, action: PayloadAction<Entity[]>) => {
      state.entities = action.payload;
    },
    setSelectedEntity: (state, action: PayloadAction<Entity>) => {
      state.selectedEntity = action.payload;
      state.selectedSourceFields = [];
      state.mappingPairs = [];
    },
    setSelectedSourceFields: (state, action: PayloadAction<Field[]>) => {
      state.selectedSourceFields = action.payload;
    },
    addMappingPair: (state, action: PayloadAction<{ source: Field; target: Field }>) => {
      state.mappingPairs.push(action.payload);
    },
    removeMappingPair: (state, action: PayloadAction<number>) => {
      state.mappingPairs = state.mappingPairs.filter((_, i) => i !== action.payload);
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setServerConnected: (state, action: PayloadAction<boolean>) => {
      state.serverConnected = action.payload;
    },
    setQueryName: (state, action: PayloadAction<string>) => {
      state.queryName = action.payload;
    },
    setQueryDescription: (state, action: PayloadAction<string>) => {
      state.queryDescription = action.payload;
    },
    resetMapping: (state) => {
      return { ...initialState, serverConnected: state.serverConnected };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkServerConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkServerConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.serverConnected = action.payload;
      })
      .addCase(checkServerConnection.rejected, (state, action) => {
        state.loading = false;
        state.serverConnected = false;
        state.error = action.error.message || 'Failed to check server connection';
      })
      .addCase(parseMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parseMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
      })
      .addCase(parseMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to parse metadata';
      })
      .addCase(validateMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateMapping.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(validateMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to validate mapping';
      })
      .addCase(applyMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyMapping.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to apply mapping';
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
  resetMapping
} = metadataSlice.actions;

// Selectors
export const selectMetadata = (state: RootState) => state.metadata;

export default metadataSlice.reducer; 