import { fullDate } from './index';

const AddFilters = {};

AddFilters.install = function (Vue, options) {
  Vue.filter('fullDate', fullDate);
};

export default AddFilters;
