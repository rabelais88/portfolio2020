import { getArticles } from '@/api/article';

const getDefaultArticleState = () => ({
  articles: [],
  page: 1,
});

export const SET_ARTICLES = 'SET_ARTICLES';

const mutations = {
  [SET_ARTICLES]: (state, articles) => (state.articles = articles),
};

export const GET_ARTICLES = 'GET_ARTICLES';

const actions = {
  async [GET_ARTICLES]({ commit, state }) {
    const opt = { page: state.page };
    const req = await getArticles(opt);
    if (req.error) {
      return req;
    }
    commit(SET_ARTICLES, req.result.list);
    return req;
  },
};

export default {
  namespaced: true,
  state: getDefaultArticleState(),
  mutations,
  actions,
};
