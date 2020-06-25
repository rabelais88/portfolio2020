import { addPost } from '@/api/post';
import asyncHandler from '@/utils/asyncHandler';
import { mapPost } from '@/vo/post.vo';
import { getArticle } from '@/api/article';

const getDefaultPostState = () => ({
  id: null,
  post: {},
  userTitle: '',
  userContent: '',
  userLink: '',
  userCoverImage: '',
  userDesc: '',
});

export const INIT = 'INIT';
export const SET_POST_ID = 'SET_POST_ID';
export const SET_POST = 'SET_POST';
export const SET_USER_TITLE = 'SET_USER_TITLE';
export const SET_USER_CONTENT = 'SET_USER_CONTENT';
export const SET_USER_LINK = 'SET_USER_LINK';
export const SET_USER_COVER_IMAGE = 'SET_USER_COVER_IMAGE';
export const SET_USER_DESC = 'SET_USER_DESC';

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
  [SET_POST]: (state, post) => (state.post = post),
  [SET_POST_ID]: (state, postId) => (state.id = postId),
  [SET_USER_TITLE]: (state, title) => (state.userTitle = title),
  [SET_USER_CONTENT]: (state, content) => (state.userContent = content),
  [SET_USER_LINK]: (state, link) => (state.userLink = link),
  [SET_USER_COVER_IMAGE]: (state, coverImage) =>
    (state.userCoverImage = coverImage),
  [SET_USER_DESC]: (state, desc) => (state.userDesc = desc),
};

const actions = {
  async [LOAD_POST]({ commit, state }, articleId) {
    const req = await asyncHandler(getArticle, { id: articleId });
    if (req.error) {
      return req;
    }
    const post = mapPost(req.result);
    commit(SET_POST_ID, post.articleId);
    commit(SET_POST, post);

    commit(SET_USER_TITLE, state.post._title);
    commit(SET_USER_CONTENT, state.post.content);
    commit(SET_USER_LINK, state.post._link);
    commit(SET_USER_COVER_IMAGE, state.post._coverImage);
    commit(SET_USER_DESC, state.post._desc);
    return req;
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
