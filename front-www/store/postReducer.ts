import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import setPosts, { SET_POSTS } from '../actions/setPosts';
// import getPosts from '../actions/getPosts';
import Logger from '../lib/logger';

const logger = new Logger('store/postReducer');

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
  // builder.addCase(getPosts.fulfilled, (state, { payload = [] }) => {
  //   return { posts: payload };
  // });
  builder.addCase(
    setPosts,
    (state: postReducerDefaultState, action: PayloadAction<post[]>) => {
      logger.log('setPosts!', { action, state });
      return { ...state, posts: action.payload };
    }
  );
};

const postSlice = createSlice({
  name: 'post',
  initialState: getDefaultState(),
  reducers: {},
  extraReducers,
});

export default postSlice.reducer;
