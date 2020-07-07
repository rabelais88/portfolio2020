import _pickBy from 'lodash/pickBy';

// types
import ARTICLE_TYPE, { ALL } from 'types/articleType';
import { article } from 'types/article';
import LOAD_STATE, { SUCCESS, LOADING } from 'types/loadState';
import { defaultStateRoot } from 'types/rootState';
import action from 'types/action';
import thunkAction from 'types/thunkAction';

import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction, ActionCreator } from 'redux';
import { mapArticle } from 'vo/article';
import { getArticles as getArticlesRequest } from '../../services/article';

import Logger from '../../lib/logger';

const logger = new Logger('store/article/action');

export const SET_ARTICLES = 'SET_ARTICLES';
export const SET_ARTICLE_PAGE = 'SET_ARTICLE_PAGE';
export const SET_ARTICLE_TYPE = 'SET_ARTICLE_TYPE';
export const SET_ARTICLE_LOAD_STATE = 'SET_ARTICLE_LOAD_STATE';
export const SET_ARTICLE_COUNT = 'SET_ARTICLE_COUNT';

export const GET_ARTICLES = 'GET_ARTICLES';

type setArticlesType = action<typeof SET_ARTICLES, article[]>;
export const setArticles = (_articles: article[]): setArticlesType => ({
  type: SET_ARTICLES,
  payload: _articles,
});

type setArticlePageType = action<typeof SET_ARTICLE_PAGE, number>;
export const setArticlePage = (page: number): setArticlePageType => ({
  type: SET_ARTICLE_PAGE,
  payload: page,
});

type setArticleTypeType = action<typeof SET_ARTICLE_TYPE, ARTICLE_TYPE>;
export const setArticleType = (
  articleType: ARTICLE_TYPE
): setArticleTypeType => ({
  type: SET_ARTICLE_TYPE,
  payload: articleType,
});

type setArticleLoadStateType = action<
  typeof SET_ARTICLE_LOAD_STATE,
  LOAD_STATE
>;
export const setArticleLoadState = (
  loadState: LOAD_STATE
): setArticleLoadStateType => ({
  type: SET_ARTICLE_LOAD_STATE,
  payload: loadState,
});

type setArticleCountType = action<typeof SET_ARTICLE_COUNT, number>;
export const setArticleCount = (count: number): setArticleCountType => ({
  type: SET_ARTICLE_COUNT,
  payload: count,
});

export const getArticles = (): thunkAction => async (
  dispatch,
  getState: () => defaultStateRoot
) => {
  await dispatch(setArticleLoadState(LOADING));
  const state = getState();
  const targetKeys = ['tag', 'size', 'page', 'keyword'];
  const _arg = _pickBy(state.article, (v, k) => targetKeys.includes(k));
  if (state.article.articleType !== ALL) _arg.type = state.article.articleType;
  const req = await getArticlesRequest(_arg);
  if (req.error) {
    return null;
  }
  logger.log(req.result.list);
  await dispatch(setArticles(req.result.list.map(mapArticle)));
  await dispatch(setArticleCount(req.result.count));
  await dispatch(setArticleLoadState(SUCCESS));
  return null;
};

export type articleActionTypes =
  | setArticlesType
  | setArticlePageType
  | setArticleTypeType
  | setArticleLoadStateType
  | setArticleCountType;
