import { getArticles, getArticle } from '@/api/article';
import asyncHandler from '@/utils/asyncHandler';
import { mapArticle } from '@/vo/article.vo';

const getDefaultArticleState = () => ({
  // paged response
  articles: [],
  page: 1,
  // single response
  id: null,
  count: 0,
  article: {},
  pageSize: 10,
});

export const SET_ARTICLES = 'SET_ARTICLES';
export const SET_PAGE = 'SET_PAGE';
export const SET_ARTICLE_ID = 'SET_ARTICLE_ID';
export const SET_COUNT = 'SET_COUNT';
export const SET_PAGE_SIZE = 'SET_PAGE_SIZE';

const mutations = {
  [SET_ARTICLES]: (state, articles) => (state.articles = articles),
  [SET_PAGE]: (state, page) => (state.page = page),
  [SET_ARTICLE_ID]: (state, articleId) => (state.articleId = articleId),
  [SET_COUNT]: (state, count) => (state.count = count),
  [SET_PAGE_SIZE]: (state, pageSize) => (state.pageSize = pageSize),
};

export const GET_ARTICLES = 'GET_ARTICLES';
export const GET_ARTICLE = 'GET_ARTICLE';

const actions = {
  async [GET_ARTICLES]({ commit, state }) {
    const opt = { page: state.page, size: state.pageSize };
    const req = await asyncHandler(getArticles, opt);
    if (req.error) {
      return req;
    }
    commit(SET_PAGE_SIZE, req.result.size);
    commit(SET_ARTICLES, req.result.list.map(mapArticle));
    return req;
  },
  async [GET_ARTICLE]({ commit, state }, articleId) {
    commit(SET_ARTICLE_ID, articleId);
    const opt = { id: articleId };
    const req = await asyncHandler(getArticle, opt);
    if (req.error) {
      return req;
    }
    commit(SET_ARTICLE_ID, articleId);
    commit(SET_COUNT, req.result.count);
    return req;
  },
};

export default {
  namespaced: true,
  state: getDefaultArticleState(),
  mutations,
  actions,
};
