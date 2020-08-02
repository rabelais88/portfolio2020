import action from 'types/action';

export const SET_VIEW_WIDTH = 'SET_VIEW_WIDTH';
export const SET_VIEW_HEIGHT = 'SET_VIEW_HEIGHT';
export const SET_MENU_OPEN = 'SET_MENU_OPEN';

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

export type uiActionTypes =
  | setViewWidthType
  | setViewHeightType
  | setMenuOpenType;
