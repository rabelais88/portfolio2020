import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'; // lang i18n
import { ValidationProvider, ValidationObserver } from 'vee-validate';

import '@/styles/index.scss'; // global css

import '@/icons'; // icon
import '@/permission'; // permission control
import FormMargin from '@/components/FormMargin';

import App from './App.vue';
import store from './store';
import router from './router';

import setValidateRules from './validateRules';

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock');
  mockXHR();
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });

setValidateRules();
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('FormMargin', FormMargin);
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

const app = new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
