import _pickBy from 'lodash/pickBy';
import _debounce from 'lodash/debounce';

// types
import ARTICLE_TYPE, { ALL } from 'types/articleType';
import { article } from 'types/article';
import LOAD_STATE, { SUCCESS, LOADING, FAIL } from 'types/loadState';
import { defaultStateRoot } from 'types/rootState';
import action from 'types/action';
import thunkAction from 'types/thunkAction';

import { mapArticle } from 'vo/article';
import { getArticles as getArticlesRequest } from '../../services/article';

import Logger from '../../lib/logger';

const logger = new Logger('store/article/action');

export const SET_ARTICLES = 'SET_ARTICLES';
export const SET_ARTICLE_PAGE = 'SET_ARTICLE_PAGE';
export const SET_ARTICLE_TYPE = 'SET_ARTICLE_TYPE';
export const SET_ARTICLE_LOAD_STATE = 'SET_ARTICLE_LOAD_STATE';
export const SET_ARTICLE_COUNT = 'SET_ARTICLE_COUNT';
export const SET_ARTICLE_KEYWORD = 'SET_ARTICLE_KEYWORD';
export const GET_ARTICLES = 'GET_ARTICLES';
export const SET_ARTICLE_TAG = 'SET_ARTICLE_TAG';

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

type setArticleKeywordType = action<typeof SET_ARTICLE_KEYWORD, string>;
export const setArticleKeyword = (keyword: string): setArticleKeywordType => ({
  type: SET_ARTICLE_KEYWORD,
  payload: keyword,
});

type setArticleTagType = action<typeof SET_ARTICLE_TAG, string>;
export const setArticleTag = (tag: string): setArticleTagType => ({
  type: SET_ARTICLE_TAG,
  payload: tag,
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
    await dispatch(setArticleLoadState(FAIL));
    return null;
  }
  // logger.log(req.result.list);
  await dispatch(setArticles(req.result.list.map(mapArticle)));
  await dispatch(setArticleCount(req.result.count));
  await dispatch(setArticleLoadState(SUCCESS));
  return null;
};

const getArticlesDebounced = _debounce(
  function (dispatch) {
    dispatch(getArticles());
  },
  200,
  { trailing: true }
);

export const changeKeyword = (keyword: string): thunkAction => async (
  dispatch,
  getState: () => defaultStateRoot
) => {
  const state = getState();
  await dispatch(setArticleKeyword(keyword));
  getArticlesDebounced(dispatch);
};

export type articleActionTypes =
  | setArticlesType
  | setArticlePageType
  | setArticleTypeType
  | setArticleLoadStateType
  | setArticleCountType
  | setArticleKeywordType
  | setArticleTagType;
