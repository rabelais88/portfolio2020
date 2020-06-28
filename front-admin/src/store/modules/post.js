import { addPost, modifyPost } from '@/api/post';
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
  userTags: [],
});

export const INIT = 'INIT';
export const SET_POST_ID = 'SET_POST_ID';
export const SET_POST = 'SET_POST';
export const SET_USER_TITLE = 'SET_USER_TITLE';
export const SET_USER_CONTENT = 'SET_USER_CONTENT';
export const SET_USER_LINK = 'SET_USER_LINK';
export const SET_USER_COVER_IMAGE = 'SET_USER_COVER_IMAGE';
export const SET_USER_DESC = 'SET_USER_DESC';
export const SET_USER_TAGS = 'SET_USER_TAGS';

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
  [SET_USER_TAGS]: (state, tags) => (state.userTags = tags),
};

const _getters = {
  userPost(state) {
    const p = {
      title: state.userTitle,
      desc: state.userDesc,
      content: state.userContent,
      coverImage: state.userCoverImage,
      link: state.userLink,
      tags: state.userTags.join(','),
    };
    if (state.id) p.id = state.id;
    return p;
  },
};

const actions = {
  async [LOAD_POST]({ commit, state }, articleId) {
    const req = await asyncHandler(getArticle, articleId);
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
    commit(SET_USER_TAGS, state.post._tags);
    return req;
  },
  async [ADD_POST]({ getters }) {
    const req = await asyncHandler(addPost, getters.userPost);
    if (req.error) {
      console.error(req.error);
      return req;
    }
    return req;
  },
  async [MODIFY_POST]({ getters }) {
    const req = await asyncHandler(modifyPost, getters.modifyPost);
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
  getters: _getters,
  actions,
};
