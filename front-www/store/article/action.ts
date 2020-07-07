import { article } from 'types/article';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import queryPaging from 'types/queryPaging';
import { defaultStateRoot } from 'types/rootState';
import action from 'types/action';
import { AnyAction, ActionCreator } from 'redux';
import { mapArticle } from 'vo/article';
import { getArticles as getArticlesRequest } from '../../services/article';

import Logger from '../../lib/logger';

const logger = new Logger('store/article/action');

export const SET_ARTICLES = 'SET_ARTICLES';
export const SET_ARTICLE_PAGE = 'SET_ARTICLE_PAGE';

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

interface getArticlesArg extends queryPaging {
  tag?: string;
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  defaultStateRoot,
  unknown,
  AnyAction
>;

export const getArticles = (arg: getArticlesArg): AppThunk => async (
  dispatch
  // getState: () => defaultStateRoot
) => {
  const req = await getArticlesRequest(arg);
  if (req.error) {
    return null;
  }
  logger.log(req.result.list);
  dispatch(setArticles(req.result.list.map(mapArticle)));
  return null;
};

export type articleActionTypes = setArticlesType | setArticlePageType;
