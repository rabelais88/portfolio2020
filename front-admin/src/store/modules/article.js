const getDefaultArticleState = () => ({
  userTitle: '',
});

export const SET_USER_TITLE = 'SET_USER_TITLE';

const mutations = {
  [SET_USER_TITLE]: (state, title) => (state.userTitle = title),
};

const actions = {};

export default {
  namespaced: true,
  state: getDefaultArticleState(),
  mutations,
  actions,
};
