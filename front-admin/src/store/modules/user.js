import { login, logout, getInfo, getLoginUrl, getLoginToken } from '@/api/user';
import asyncHandler from '@/utils/asyncHandler';
import {
  getToken,
  setToken,
  removeToken,
  setUserUpdatedAt,
  getUserUpdatedAt,
  removeUserUpdatedAt,
} from '@/utils/auth';
import { resetRouter } from '@/router';

const getDefaultState = () => ({
  token: getToken(),
  name: '',
  avatar: '',
  email: '',
});

const _state = getDefaultState();

export const RESET_STATE = 'RESET_STATE';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_AVATAR = 'SET_AVATAR';
export const SET_NAME = 'SET_NAME';

const mutations = {
  [RESET_STATE]: (state) => {
    Object.entries(getDefaultState()).forEach(([key, value]) => {
      state[key] = value;
    });
  },
  [SET_TOKEN]: (state, token) => (state.token = token),
  [SET_NAME]: (state, name) => (state.name = name),
  [SET_AVATAR]: (state, avatar) => (state.avatar = avatar),
  [SET_EMAIL]: (state, email) => (state.email = email),
};

export const GET_LOGIN_URL = 'GET_LOGIN_URL';
export const GET_LOGIN_TOKEN = 'GET_LOGIN_TOKEN';

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password })
        .then((response) => {
          const { data } = response;
          commit('SET_TOKEN', data.token);
          setToken(data.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  async getInfo({ commit, state }) {
    const req = await asyncHandler(getInfo, state.token);
    console.log('getInfo', req);
    if (req.error) {
      throw Error('Verification failed, please login again');
    }
    commit('SET_EMAIL', req.result.email);
    commit('SET_NAME', req.result.name);
    commit('SET_AVATAR', req.result.picture);
    return req;
  },

  // user logout
  async logout({ commit, state }) {
    // await logout(state.token);
    removeToken(); // must remove  token  first
    removeUserUpdatedAt();
    resetRouter();
    commit('RESET_STATE');
  },

  // remove token
  async resetToken({ commit }) {
    removeToken(); // must remove  token  first
    commit('RESET_STATE');
  },

  async [GET_LOGIN_URL]({}) {
    const req = await asyncHandler(getLoginUrl, '');
    if (req.error) {
      console.error(req.error);
      return req;
    }
    return req;
  },

  async [GET_LOGIN_TOKEN]({ commit }, query) {
    /**
     * result: { accessToken: string, email: string }
     */
    const req = await asyncHandler(getLoginToken, query);
    if (req.error) {
      console.error(req.error);
      return req;
    }
    commit(SET_TOKEN, req.result.token);
    commit(SET_EMAIL, req.result.email);
    commit(SET_NAME, 'admin');
    commit(SET_AVATAR, req.result.picture);
    setToken(req.result.token);
    setUserUpdatedAt(req.result.updatedAt);
    return req;
  },
};

export default {
  namespaced: true,
  state: _state,
  mutations,
  actions,
};
