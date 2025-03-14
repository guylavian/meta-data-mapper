import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MetadataState } from './metadata.reducer';

export const selectMetadataState = createFeatureSelector<MetadataState>('metadata');

export const selectEntities = createSelector(
  selectMetadataState,
  (state: MetadataState) => state.entities
);

export const selectSelectedEntity = createSelector(
  selectMetadataState,
  (state: MetadataState) => state.selectedEntity
);

export const selectSelectedSourceFields = createSelector(
  selectMetadataState,
  (state: MetadataState) => state.selectedSourceFields
);

export const selectMappingPairs = createSelector(
  selectMetadataState,
  (state: MetadataState) => state.mappingPairs
);

export const selectStep = createSelector(
  selectMetadataState,
  (state: MetadataState) => state.step
);

export const selectValidationErrors = createSelector(
  selectMetadataState,
  (state: MetadataState) => state.validationErrors
);

export const selectIsLoading = createSelector(
  selectMetadataState,
  (state: MetadataState) => state.isLoading
);

export const selectError = createSelector(
  selectMetadataState,
  (state: MetadataState) => state.error
); 