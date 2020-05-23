import { createAsyncThunk } from '@reduxjs/toolkit';
import { asyncResolver, api } from '../lib/api';

export interface postsResult {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface getPostsArg {
  page: number;
}

// https://redux-toolkit.js.org/usage/usage-with-typescript
const getPosts = createAsyncThunk<postsResult, getPostsArg>(
  'GET_POSTS',
  async (arg, thunkAPI) => {
    const opts = {
      methods: 'get',
      url: 'https://jsonplaceholder.typicode.com/posts',
    };
    const req = await asyncResolver(api, opts);
    if (req.error) return thunkAPI.rejectWithValue(req);
    return req.result;
  }
);

export default getPosts;
