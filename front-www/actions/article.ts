/* eslint-disable import/prefer-default-export */

import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
// import article from '../types/article';
import { article, articleResponse } from '../types/article';
import listResponse from '../types/listResponse';
import { resolvedResult } from '../lib/api';
import LOAD_STATE, { LOADING, SUCCESS, FAIL } from '../types/loadState';
import Logger from '../lib/logger';
import {
  getArticles as getArticlesRequest,
  getArticlesRequestArg,
} from '../services/article';
import { defaultRootState } from '../types/rootState';

const logger = new Logger('actions/getArticles.ts');

// eslint-disable-next-line

export const setArticleCount = createAction<number>('SET_ARTICLE_COUNT');
export const setArticlePage = createAction<number>('SET_ARTICLE_PAGE');
export const setArticleLoadState = createAction<LOAD_STATE>(
  'SET_ARTICLE_LOAD_STATE'
);

export const setArticles = createAction<articleResponse[]>('SET_ARTICLES');
export const setArticlePages = createAction<number[]>('SET_PAGES');

export const getArticles = createAsyncThunk<
  // Return type of the payload creator
  resolvedResult<listResponse<articleResponse>>,
  // First argument to the payload creator
  getArticlesRequestArg,
  // thunkAPI
  { state: defaultRootState }
>('GET_ARTICLES', async (arg, thunkAPI) => {
  thunkAPI.dispatch(setArticleLoadState(LOADING));
  let req = null;
  const state = thunkAPI.getState();
  const articleStore = state.article;
  const opts = arg || {
    type: '',
    page: articleStore.page,
    size: articleStore.size,
    keyword: '',
    tag: '',
  };
  if (articleStore.keyword !== '') opts.keyword = articleStore.keyword;
  if (articleStore.tag !== '') opts.tag = articleStore.tag;
  req = await getArticlesRequest(opts);

  if (req.error) {
    logger.err(req.error);
    thunkAPI.dispatch(setArticleLoadState(FAIL));
    thunkAPI.rejectWithValue(req.errorCode);
    return req;
  }
  thunkAPI.dispatch(setArticleCount(req.result.count));
  thunkAPI.dispatch(setArticlePage(req.result.page));
  thunkAPI.dispatch(setArticlePages(req.result.pages));
  thunkAPI.dispatch(setArticles(req.result.list));
  thunkAPI.dispatch(setArticleLoadState(SUCCESS));
  return req;
});
