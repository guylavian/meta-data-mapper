import { configureStore } from '@reduxjs/toolkit';
import metadataReducer from './metadata/metadataSlice';

export const store = configureStore({
  reducer: {
    metadata: metadataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 