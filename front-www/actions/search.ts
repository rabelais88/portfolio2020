import { createAsyncThunk } from '@reduxjs/toolkit';

import { asyncResolver, api, joinUrl } from '../lib/api';
import listResponse from '../types/listResponse';
import article from '../types/article';

export interface searchArg {
  cursor: number;
  pageSize: number;
}

// https://redux-toolkit.js.org/usage/usage-with-typescript
const search = createAsyncThunk<listResponse<article>, searchArg>(
  'SEARCH',
  async (arg, thunkAPI) => {
    const url = joinUrl('...searchUrl', {
      cursor: arg.cursor,
      pageSize: arg.pageSize,
    });
    const opts = {
      methods: 'get',
      url,
    };
    const req = await asyncResolver<listResponse<article>>(api, opts);
    if (req.error) return thunkAPI.rejectWithValue(req);
    return req.result;
  }
);

export default search;
