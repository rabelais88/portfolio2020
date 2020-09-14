import thunkAction from 'types/thunkAction';
import action from 'types/action';
import { defaultStateRoot } from 'types/rootState';
import {
  getArticles,
  getArticlesDebounced,
  setArticleKeyword,
  setArticleType,
} from 'store/article/action';
import {
  SEARCH_TAG,
  SEARCH_ALL,
  SEARCH_WORK,
  SEARCH_ARTICLE,
} from 'constants/searchMode';
import { getTags, getTagsDebounced, setTagKeyword } from 'store/tag/action';
import { ALL, POST, WORK } from 'types/articleType';

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

const searchTypes = {
  [SEARCH_ALL]: ALL,
  [SEARCH_WORK]: WORK,
  [SEARCH_ARTICLE]: POST,
  // [SEARCH_TAG]: ALL,
};

export const changeSearchMode = (searchMode): thunkAction => async (
  dispatch,
  getState: () => defaultStateRoot
) => {
  const aType = searchTypes[searchMode];
  await dispatch(setSearchMode(searchMode));
  if (searchMode === SEARCH_TAG) await dispatch(getTags());
  else {
    await dispatch(setArticleType(aType));
    await dispatch(getArticles());
  }
};

export const changeMenuOpen = (menuOpen: boolean): thunkAction => async (
  dispatch,
  getState: () => defaultStateRoot
) => {
  await dispatch(setMenuOpen(menuOpen));
  if (menuOpen) {
    const state = getState();
    if (state.ui.searchMode === SEARCH_TAG) await dispatch(getTags());
    else await dispatch(getArticles());
  }
};

export const changeSearchKeyword = (keyword: string): thunkAction => async (
  dispatch,
  getState: () => defaultStateRoot
) => {
  await dispatch(setArticleKeyword(keyword));
  await dispatch(setTagKeyword(keyword));
  const state = getState();
  if (state.ui.searchMode === SEARCH_TAG) getTagsDebounced(dispatch);
  else getArticlesDebounced(dispatch);
};

export type uiActionTypes =
  | setViewWidthType
  | setViewHeightType
  | setMenuOpenType
  | setMobileType
  | setSearchModeType;
