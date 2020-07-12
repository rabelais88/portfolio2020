import { defaultStateTag, tag } from 'types/tag';
import { defaultStateRoot } from 'types/rootState';
import Logger from 'lib/logger';
import action from 'types/action';
import thunkAction from 'types/thunkAction';
import { getTags as getTagsRequest } from 'services/tag';
import LOAD_STATE, { FAIL, SUCCESS, LOADING } from 'types/loadState';

const logger = new Logger('store/article/tag');

export const SET_TAGS = 'SET_TAGS';
export const SET_TAG_LOAD_STATE = 'SET_TAG_LOAD_STATE';

type setTagsType = action<typeof SET_TAGS, tag[]>;
export const setTags = (tags: tag[]): setTagsType => ({
  type: SET_TAGS,
  payload: tags,
});

type setTagLoadStateType = action<typeof SET_TAG_LOAD_STATE, LOAD_STATE>;
export const setTagLoadState = (
  loadState: LOAD_STATE
): setTagLoadStateType => ({
  type: SET_TAG_LOAD_STATE,
  payload: loadState,
});

export const getTags = (): thunkAction => async (
  dispatch,
  getState: () => defaultStateRoot
) => {
  const state = getState();
  const opts = { keyword: state.tag.keyword, limit: state.tag.limit };
  const req = await getTagsRequest(opts);
  await dispatch(setTagLoadState(LOADING));
  if (req.error) {
    await dispatch(setTagLoadState(FAIL));
    return null;
  }

  await dispatch(setTags(req.result.tags));
  await dispatch(setTagLoadState(SUCCESS));
  return null;
};

export type tagActionTypes = setTagsType | setTagLoadStateType;
