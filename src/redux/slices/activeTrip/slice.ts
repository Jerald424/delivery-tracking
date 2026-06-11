import { createSlice } from '@reduxjs/toolkit';
import activeTripThunk from './thunk';

export const initialState = {
  isLoading: false,
  data: undefined,
};

const activeTrip = createSlice({
  name: 'activeTrip',
  initialState,
  reducers: {},
  extraReducers: activeTripThunk,
});

export default activeTrip.reducer;
