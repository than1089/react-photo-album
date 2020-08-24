import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../app/store';
import photoAPI from '../../api/photoAPI';

interface HealthState {
  ok: boolean;
  isChecking: boolean,
}

const initialState: HealthState = {
  ok: true,
  isChecking: false,
}

export const healCheckSlide = createSlice({
  name: 'health',
  initialState,
  reducers: {
    healthCheckStart: (state: HealthState) => {
      state.isChecking = true;
    },
    healthCheckSuccess: (state: HealthState) => {
      state.isChecking = false;
      state.ok = true;
    },
    healthCheckFailure: (state: HealthState, action: PayloadAction<string>) => {
      state.isChecking = false;
      state.ok = false;
    },
  },
});

export const {
  healthCheckStart,
  healthCheckSuccess,
  healthCheckFailure,
} = healCheckSlide.actions;

export const healCheck = (): AppThunk => async dispatch => {
  try {
    dispatch(healthCheckStart());
    const message = await photoAPI.healCheck();
    if (message === 'OK') {
      dispatch(healthCheckSuccess());
    } else {
      dispatch(healthCheckFailure(message));
    }
  } catch (err) {
    dispatch(healthCheckFailure(err.toString()));
  }
}

export default healCheckSlide.reducer;
