import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import photosReducer from '../features/photos/photosSlide';
import uploadReducer from '../features/photos/uploadSlide';
import healthReducer from '../features/healthcheck/healcheckSlide';

export const store = configureStore({
  reducer: {
    photos: photosReducer,
    upload: uploadReducer,
    health: healthReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
