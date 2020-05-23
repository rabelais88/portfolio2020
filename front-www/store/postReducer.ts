import { createSlice } from '@reduxjs/toolkit';
import getPosts from '../actions/getPosts';

export interface post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface postReducerDefaultState {
  posts: post[];
}

export const getDefaultState = (): postReducerDefaultState => ({
  posts: [],
});

const extraReducers = (builder) => {
  builder.addCase(getPosts.fulfilled, (state, { payload = [] }) => {
    return { posts: payload };
  });
};

const postSlice = createSlice({
  name: 'post',
  initialState: getDefaultState(),
  reducers: {},
  extraReducers,
});

export default postSlice.reducer;
