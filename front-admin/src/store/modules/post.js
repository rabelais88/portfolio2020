import { addPost } from '@/api/post';
import asyncHandler from '@/utils/asyncHandler';

const getDefaultPostState = () => ({
  userTitle: '',
  userContent: '',
});

export const SET_USER_TITLE = 'SET_USER_TITLE';
export const SET_USER_CONTENT = 'SET_USER_CONTENT';
export const INIT = 'INIT';

export const ADD_POST = 'ADD_POST';

const mutations = {
  [INIT](state) {
    const postDefaultState = getDefaultPostState();
    Object.entries(postDefaultState).forEach(
      ([key, value]) => (state[key] = value),
    );
  },
  [SET_USER_TITLE]: (state, title) => (state.userTitle = title),
  [SET_USER_CONTENT]: (state, content) => (state.userContent = content),
};

const actions = {
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
};

export default {
  namespaced: true,
  state: getDefaultPostState(),
  mutations,
  actions,
};
