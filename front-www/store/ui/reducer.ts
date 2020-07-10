import { INIT } from 'types/loadState';

import { defaultStateUi } from 'types/ui';
import { uiActionTypes, SET_VIEW_HEIGHT, SET_VIEW_WIDTH } from './action';

export const getDefaultState = (): defaultStateUi => ({
  viewWidth: 0,
  viewHeight: 0,
});

function reducer(state: defaultStateUi, action: uiActionTypes): defaultStateUi {
  if (!state) return getDefaultState();
  switch (action.type) {
    case SET_VIEW_WIDTH:
      return { ...state, viewWidth: action.payload };
    case SET_VIEW_HEIGHT:
      return { ...state, viewHeight: action.payload };
    default:
      return state;
  }
}

export default reducer;
