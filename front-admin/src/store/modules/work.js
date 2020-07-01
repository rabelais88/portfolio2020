import { addWork, modifyWork } from '@/api/work';
import asyncHandler from '@/utils/asyncHandler';
import { mapWork } from '@/vo/work.vo';
import { getArticle } from '@/api/article';

const getDefaultPostState = () => ({
  id: null,
  work: {},
  userTitle: '',
  userLink: '',
  userCoverImage: '',
  userDesc: '',
  userTags: [],
});

export const INIT = 'INIT';
export const SET_WORK_ID = 'SET_WORK_ID';
export const SET_WORK = 'SET_WORK';
export const SET_USER_TITLE = 'SET_USER_TITLE';
export const SET_USER_LINK = 'SET_USER_LINK';
export const SET_USER_COVER_IMAGE = 'SET_USER_COVER_IMAGE';
export const SET_USER_DESC = 'SET_USER_DESC';
export const SET_USER_TAGS = 'SET_USER_TAGS';

export const ADD_WORK = 'ADD_WORK';
export const MODIFY_WORK = 'MODIFY_WORK';
export const LOAD_WORK = 'LOAD_WORK';

const mutations = {
  [INIT](state) {
    const postDefaultState = getDefaultPostState();
    Object.entries(postDefaultState).forEach(
      ([key, value]) => (state[key] = value),
    );
  },
  [SET_WORK]: (state, work) => (state.work = work),
  [SET_WORK_ID]: (state, workId) => (state.id = workId),
  [SET_USER_TITLE]: (state, title) => (state.userTitle = title),
  [SET_USER_LINK]: (state, link) => (state.userLink = link),
  [SET_USER_COVER_IMAGE]: (state, coverImage) =>
    (state.userCoverImage = coverImage),
  [SET_USER_DESC]: (state, desc) => (state.userDesc = desc),
  [SET_USER_TAGS]: (state, tags) => (state.userTags = tags),
};

const _getters = {
  userWork(state) {
    // user input transformed into request body
    const w = {
      title: state.userTitle,
      desc: state.userDesc,
      content: state.userContent,
      coverImage: state.userCoverImage,
      link: state.userLink,
      tags: state.userTags.join(','),
    };
    if (state.id) w.id = state.id;
    return w;
  },
};

const actions = {
  async [LOAD_WORK]({ commit, state }, articleId) {
    const req = await asyncHandler(getArticle, articleId);
    if (req.error) {
      return req;
    }
    const work = mapWork(req.result);
    console.log('mapped work', {work})
    commit(SET_WORK_ID, work.id);
    commit(SET_WORK, work);

    commit(SET_USER_TITLE, state.work.title);
    commit(SET_USER_LINK, state.work.link);
    commit(SET_USER_COVER_IMAGE, state.work.coverImage);
    commit(SET_USER_DESC, state.work.desc);
    commit(SET_USER_TAGS, state.work.tags);
    return req;
  },
  async [ADD_WORK]({ getters }) {
    const req = await asyncHandler(addWork, getters.userWork);
    if (req.error) {
      console.error(req.error);
      return req;
    }
    return req;
  },
  async [MODIFY_WORK]({ getters }) {
    const req = await asyncHandler(modifyWork, getters.userWork);
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
