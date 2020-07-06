import { article } from 'types/article';
import { ThunkAction } from 'redux-thunk';
import queryPaging from 'types/queryPaging';
import { defaultStateRoot } from 'types/rootState';
import { Action } from 'redux';
import { mapArticle } from 'vo/article';
import { getArticles as getArticlesRequest } from '../../services/article';

import Logger from '../../lib/logger';

const logger = new Logger('store/article/action');

export const SET_ARTICLES = 'SET_ARTICLES';

export const GET_ARTICLES = 'GET_ARTICLES';

interface setArticlesType {
  type: typeof SET_ARTICLES;
  payload: article[];
}

export const setArticles = (_articles: article[]): setArticlesType => ({
  type: SET_ARTICLES,
  payload: _articles,
});

interface getArticlesArg extends queryPaging {}

export const getArticles = (
  arg: getArticlesArg
): ThunkAction<void, defaultStateRoot, unknown, Action<unknown>> => async (
  dispatch,
  getState
) => {
  const req = await getArticlesRequest(arg);
  if (req.error) {
    return null;
  }
  logger.log(req.result.list);
  dispatch(setArticles(req.result.list.map(mapArticle)));
};
