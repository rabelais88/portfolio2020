import { LOADING, SUCCESS, FAIL } from '@/constants/loadState';
import { getDashboard } from '@/api/dashboard';
import asyncHandler from '@/utils/asyncHandler';

export const getDefaultState = () => ({
  loadState: LOADING,
  tags: [],
  dashboard: {},
});

export const SET_TAGS = 'SET_TAGS';
export const SET_LOAD_STATE = 'SET_LOAD_STATE';
export const SET_DASHBOARD = 'SET_DASHBOARD';

const mutations = {
  [SET_TAGS]: (state, tags) => (state.tags = tags),
  [SET_LOAD_STATE]: (state, loadState) => (state.loadState = loadState),
  [SET_DASHBOARD]: (state, dashboard) => (state.dashboard = dashboard),
};

export const LOAD_DASHBOARD = 'LOAD_DASHBOARD';

const actions = {
  // internal action, this gets reused externally but never
  async [LOAD_DASHBOARD]({ dispatch, commit }) {
    commit(SET_LOAD_STATE, LOADING);
    const reqTags = await dispatch('article/GET_TAGS', null, { root: true });
    // if (reqTags.error) {
    //   commit(SET_LOAD_STATE, FAIL);
    //   return reqTags;
    // }
    // console.log({ reqTags });
    commit(SET_TAGS, reqTags);
    const reqDashboard = await asyncHandler(getDashboard, '');
    if (reqDashboard.error) {
      commit(SET_LOAD_STATE, FAIL);
      return reqDashboard;
    }
    commit(SET_DASHBOARD, reqDashboard.result);
    commit(SET_LOAD_STATE, SUCCESS);
    return reqDashboard;
  },
};

export default {
  namespaced: true,
  state: getDefaultState(),
  actions,
  mutations,
};
