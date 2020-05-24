import { createSlice, CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import search from '../actions/search';
import article from '../types/article';

export interface mainReducerDefaultState {
  articles: article[];
  pageSize: number;
  cursor: number;
}

export const getDefaultState = (): mainReducerDefaultState => ({
  articles: [],
  pageSize: 10,
  cursor: 0,
});

const extraReducers = (builder) => {
  builder.addCase(search.fulfilled, (state, { payload = [] }) => {
    return { ...state, articles: payload };
  });
};

const postSlice = createSlice({
  name: 'main',
  initialState: getDefaultState(),
  reducers: {},
  extraReducers,
});

export default postSlice.reducer;
