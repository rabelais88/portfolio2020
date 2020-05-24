import { createAsyncThunk } from '@reduxjs/toolkit';
import { asyncResolver, api, resolvedResult } from '../lib/api';
import post from '../types/post';
import setPosts from './setPosts';
import Logger from '../lib/logger';

const logger = new Logger('actions/getPosts');

export interface getPostsArg {
  page: number;
}

export async function getPostsRequest({
  page,
}: getPostsArg): Promise<resolvedResult<post[]>> {
  const opts = {
    methods: 'get',
    url: `https://jsonplaceholder.typicode.com/posts/`,
  };
  const req = await asyncResolver(api, opts);
  return req;
}

// https://redux-toolkit.js.org/usage/usage-with-typescript
const getPosts = createAsyncThunk<post[], getPostsArg>(
  'GET_POSTS',
  async (arg, thunkAPI) => {
    const req = await getPostsRequest({ page: arg.page });
    if (req.error) {
      thunkAPI.rejectWithValue(req.errorCode);
      return null;
    }
    thunkAPI.dispatch(setPosts(req.result));
    return req.result;
  }
);

export default getPosts;
