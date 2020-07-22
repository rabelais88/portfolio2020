import { defaultStateArticle, article } from 'types/article';
import { ALL } from 'types/articleType';
import { INIT } from 'types/loadState';
import {
  SET_ARTICLES,
  SET_ARTICLE_PAGE,
  articleActionTypes,
  SET_ARTICLE_TYPE,
  SET_ARTICLE_LOAD_STATE,
  SET_ARTICLE_COUNT,
  SET_ARTICLE_KEYWORD,
  SET_ARTICLE_TAG,
} from './action';

export const getDefaultState = (): defaultStateArticle => ({
  articles: [],
  page: 1,
  count: 0,
  keyword: '',
  articleType: ALL,
  pages: [],
  loadState: INIT,
  tag: '',
  size: 10,
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
    case SET_ARTICLE_TYPE:
      return { ...state, articleType: action.payload };
    case SET_ARTICLE_LOAD_STATE:
      return { ...state, loadState: action.payload };
    case SET_ARTICLE_COUNT:
      return { ...state, count: action.payload };
    case SET_ARTICLE_KEYWORD:
      return { ...state, keyword: action.payload };
    case SET_ARTICLE_TAG:
      return { ...state, tag: action.payload };
    default:
      return state;
  }
}

export default reducer;
