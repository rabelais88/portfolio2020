import { defaultStateArticle } from 'types/article';
import { ALL } from 'types/articleType';
import { INIT } from 'types/loadState';
import { AnyAction } from 'redux';
import { defaultStateRoot } from 'types/rootState';
import { SET_ARTICLES, SET_ARTICLE_PAGE, articleActionTypes } from './action';
// import { HYDRATE } from 'next-redux-wrapper';

export const getDefaultState = (): defaultStateArticle => ({
  articles: [],
  page: 1,
  count: 0,
  keyword: '',
  articleType: ALL,
  pages: [],
  loadState: INIT,
  tag: '',
});

function reducer(
  state: defaultStateArticle,
  action: articleActionTypes
): defaultStateArticle {
  if (!state) return getDefaultState();
  switch (action.type) {
    case SET_ARTICLES:
      return { ...state, articles: action.payload };
    case SET_ARTICLE_PAGE:
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

export default reducer;
