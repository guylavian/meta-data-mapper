import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { api } from '../../services/api';
import * as MetadataActions from './metadata.actions';

@Injectable()
export class MetadataEffects {
  parseMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.parseMetadata),
      mergeMap(({ metadata }) =>
        api.parseMetadata(metadata).then(
          entities => MetadataActions.parseMetadataSuccess({ entities }),
          error => MetadataActions.parseMetadataFailure({ error: error.message })
        )
      )
    )
  );

  validateMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.validateMapping),
      mergeMap(({ sourceField, targetField }) =>
        api.validateMapping(sourceField, targetField).then(
          result => MetadataActions.validateMappingSuccess({ result }),
          error => MetadataActions.validateMappingFailure({ error: error.message })
        )
      )
    )
  );

  applyMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.applyMapping),
      mergeMap(({ metadata, rules }) =>
        api.applyMapping(metadata, rules).then(
          result => MetadataActions.applyMappingSuccess({ result }),
          error => MetadataActions.applyMappingFailure({ error: error.message })
        )
      )
    )
  );

  constructor(private actions$: Actions) {}
} 