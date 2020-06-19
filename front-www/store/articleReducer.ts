/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Logger from '../lib/logger';
import queryPaging from '../types/queryPaging';
import LOAD_STATE, { INIT, LOADING, SUCCESS, FAIL } from '../types/loadState';
import ARTICLE_TYPE, { ALL } from '../types/articleType';
import {
  getArticles,
  setArticleCount,
  setArticlePage,
  setArticleLoadState,
  setArticles,
  setArticlePages,
} from '../actions/article';
import listResponse from '../types/listResponse';
import { resolvedResult } from '../lib/api';

const logger = new Logger('store/articleReducer.ts');

export interface article {
  id: string;
  title: string;
  type: string;
  content: string;
  desc: string;
  coverImage: string;
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface articleReducerDefaultState extends queryPaging {
  //   articleId?: string;
  articles: article[];
  articleType: ARTICLE_TYPE;
  count: number;
  next: number;
  prev: number;
  pages: number[];
  loadState: LOAD_STATE;
  //   article: Partial<article>;
}

export const getDefaultState = (): articleReducerDefaultState => ({
  articleType: ALL,
  //   articleId: null,
  //   article: {},
  articles: [],
  count: 0,
  next: 0,
  prev: 0,
  pages: [],
  loadState: INIT,
  page: 0,
});

const extraReducers = (builder) => {
  builder.addCase(
    setArticleCount,
    (state: articleReducerDefaultState, action: PayloadAction<number>) => {
      state.count = action.payload;
    }
  );
  builder.addCase(
    setArticleLoadState,
    (state: articleReducerDefaultState, action: PayloadAction<LOAD_STATE>) => {
      state.loadState = action.payload;
    }
  );
  builder.addCase(
    setArticlePage,
    (state: articleReducerDefaultState, action: PayloadAction<number>) => {
      state.page = action.payload;
    }
  );
  builder.addCase(
    getArticles.fulfilled,
    (
      state: articleReducerDefaultState,
      action: PayloadAction<resolvedResult<listResponse<ARTICLE_TYPE>>>
    ) => {
      logger.log('getArticles() finished');
      return state;
    }
  );
};

const articleSlice = createSlice({
  name: 'article',
  initialState: getDefaultState(),
  reducers: {},
  extraReducers,
});

export default articleSlice.reducer;
