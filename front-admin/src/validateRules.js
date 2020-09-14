import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';
import { extend } from 'vee-validate';

/* eslint-disable operator-linebreak */
function validURL(str) {
  if (!str || str === '') return false;
  return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
    str,
  );
}

function validArrayMinLength(ary, { length }) {
  return ary.length > length;
}

function setValidatorRules() {
  Object.keys(rules).forEach((rule) => {
    extend(rule, {
      ...rules[rule], // copies rule configuration
      message: messages[rule], // assign message
    });
  });
  extend('url', {
    validate: validURL,
    message: (fieldName, placeholders) => `${fieldName} must be a valid URL`,
  });
  extend('array_min', {
    validate: validArrayMinLength,
    message: (fieldName, placeholders) =>
      `${fieldName} must be longer than ${placeholders.length}`,
    params: ['length'],
  });
}

export default setValidatorRules;
