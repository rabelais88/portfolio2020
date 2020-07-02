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
import { articleResponse, article, postResponse } from '../types/article';
import { mapArticle } from '../vo/article';

const logger = new Logger('store/articleReducer.ts');

export interface articleReducerDefaultState extends queryPaging {
  articles: article[];
  articleType: ARTICLE_TYPE;
  count: number;
  pages: number[];
  loadState: LOAD_STATE;
  tag: string;
  keyword: string;
}

export const getDefaultState = (): articleReducerDefaultState => ({
  articleType: ALL,
  articles: [],
  count: 0,
  pages: [],
  loadState: INIT,
  page: 0,
  tag: '',
  keyword: '',
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
    setArticles,
    (
      state: articleReducerDefaultState,
      action: PayloadAction<articleResponse[]>
    ) => {
      state.articles = action.payload.map(mapArticle);
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
