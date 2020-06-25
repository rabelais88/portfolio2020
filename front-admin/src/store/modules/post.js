import { addPost } from '@/api/post';
import asyncHandler from '@/utils/asyncHandler';
import { mapArticle } from '@/vo/article.vo';

const getDefaultPostState = () => ({
  id: null,
  userTitle: '',
  userContent: '',
});

export const SET_POST_ID = 'SET_POST_ID';
export const SET_USER_TITLE = 'SET_USER_TITLE';
export const SET_USER_CONTENT = 'SET_USER_CONTENT';
export const INIT = 'INIT';

export const ADD_POST = 'ADD_POST';
export const MODIFY_POST = 'MODIFY_POST';
export const LOAD_POST = 'LOAD_POST';

const mutations = {
  [INIT](state) {
    const postDefaultState = getDefaultPostState();
    Object.entries(postDefaultState).forEach(
      ([key, value]) => (state[key] = value),
    );
  },
  [SET_POST_ID]: (state, postId) => (state.id = postId),
  [SET_USER_TITLE]: (state, title) => (state.userTitle = title),
  [SET_USER_CONTENT]: (state, content) => (state.userContent = content),
};

const actions = {
  [LOAD_POST]({ commit }, data) {
    console.log('loadPost', { data });
    commit(SET_POST_ID, data.articleId);
    commit(SET_USER_TITLE, data.article.title);
    commit(SET_USER_CONTENT, data.content);
  },
  async [ADD_POST]({ state }) {
    const data = {
      title: state.userTitle,
      content: state.userContent,
    };
    const req = await asyncHandler(addPost, data);
    if (req.error) {
      console.error(req.error);
      return req;
    }
    return req;
  },
  async [MODIFY_POST]({ state }) {
    const data = {
      id: state.id,
      title: state.userTitle,
      content: state.userContent,
    };
    //
  },
};

export default {
  namespaced: true,
  state: getDefaultPostState(),
  mutations,
  actions,
};
