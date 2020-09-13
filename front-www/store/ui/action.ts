import action from 'types/action';

export const SET_VIEW_WIDTH = 'SET_VIEW_WIDTH';
export const SET_VIEW_HEIGHT = 'SET_VIEW_HEIGHT';
export const SET_MENU_OPEN = 'SET_MENU_OPEN';
export const SET_MOBILE = 'SET_MOBILE';
export const SET_SEARCH_MODE = 'SET_SEARCH_MODE';

type setViewWidthType = action<typeof SET_VIEW_WIDTH, number>;
export const setViewWidth = (viewWidth: number): setViewWidthType => ({
  type: SET_VIEW_WIDTH,
  payload: viewWidth,
});

type setViewHeightType = action<typeof SET_VIEW_HEIGHT, number>;
export const setViewHeight = (viewHeight: number): setViewHeightType => ({
  type: SET_VIEW_HEIGHT,
  payload: viewHeight,
});

type setMenuOpenType = action<typeof SET_MENU_OPEN, boolean>;
export const setMenuOpen = (menuOpen: boolean): setMenuOpenType => ({
  type: SET_MENU_OPEN,
  payload: menuOpen,
});

type setMobileType = action<typeof SET_MOBILE, boolean>;
export const setMobile = (isMobile: boolean): setMobileType => ({
  type: SET_MOBILE,
  payload: isMobile,
});

type setSearchModeType = action<typeof SET_SEARCH_MODE, string>;
export const setSearchMode = (searchMode: string) => ({
  type: SET_SEARCH_MODE,
  payload: searchMode,
});

export type uiActionTypes =
  | setViewWidthType
  | setViewHeightType
  | setMenuOpenType
  | setMobileType
  | setSearchModeType;
