import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import settings from './modules/settings';
import user from './modules/user';
import article from './modules/article';
import post from './modules/post';
import work from './modules/work';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    article,
    post,
    work,
  },
  getters,
});

export default store;
