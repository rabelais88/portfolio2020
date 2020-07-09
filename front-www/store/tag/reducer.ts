import { defaultStateTag } from 'types/tag';
import { INIT } from 'types/loadState';

import { tagActionTypes, SET_TAGS } from './action';

export const getDefaultState = (): defaultStateTag => ({
  tags: [],
  keyword: '',
  limit: 10,
  loadState: INIT,
});

function reducer(
  state: defaultStateTag,
  action: tagActionTypes
): defaultStateTag {
  if (!state) return getDefaultState();
  switch (action.type) {
    case SET_TAGS:
      return { ...state, tags: action.payload };
    default:
      return state;
  }
}

export default reducer;
