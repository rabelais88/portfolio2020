import { SEARCH_ARTICLE } from 'constants/searchMode';
import { INIT } from 'types/loadState';

import { defaultStateUi } from 'types/ui';
import {
  uiActionTypes,
  SET_VIEW_HEIGHT,
  SET_VIEW_WIDTH,
  SET_MENU_OPEN,
  SET_MOBILE,
  SET_SEARCH_MODE,
} from './action';

export const getDefaultState = (): defaultStateUi => ({
  viewWidth: 0,
  viewHeight: 0,
  menuOpen: false,
  isMobile: false,
  searchMode: SEARCH_ARTICLE,
});

function reducer(state: defaultStateUi, action: uiActionTypes): defaultStateUi {
  if (!state) return getDefaultState();
  switch (action.type) {
    case SET_VIEW_WIDTH:
      return { ...state, viewWidth: action.payload };
    case SET_VIEW_HEIGHT:
      return { ...state, viewHeight: action.payload };
    case SET_MENU_OPEN:
      return { ...state, menuOpen: action.payload };
    case SET_MOBILE:
      return { ...state, isMobile: action.payload };
    case SET_SEARCH_MODE:
      return { ...state, searchMode: action.payload };
    default:
      return state;
  }
}

export default reducer;
