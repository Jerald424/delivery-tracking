import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './slice';
import { fetchActiveTrip } from './api';

export const fetchLastActiveTrip = createAsyncThunk(
  'get/active-trip',
  async (payload, { getState }) => {
    const token = getState().auth?.token;
    return await fetchActiveTrip({ token });
  },
);

export default function lastTripThunk(
  builder: ActionReducerMapBuilder<typeof initialState>,
) {
  builder
    .addCase(fetchLastActiveTrip.pending, state => {
      state.isLoading = true;
    })
    .addCase(fetchLastActiveTrip.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.isLoading = false;
    })
    .addCase(fetchLastActiveTrip.rejected, state => {
      state.isLoading = false;
    });
}
