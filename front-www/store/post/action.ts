import Logger from 'lib/logger';
import action from 'types/action';
import { post } from 'types/postStore';
import LOAD_STATE, { SUCCESS, LOADING, FAIL } from 'types/loadState';
import { getPost as getPostReq } from 'services/article';
import thunkAction from 'types/thunkAction';
import { defaultStateRoot } from 'types/rootState';
import { mapPost } from 'vo/post';

const logger = new Logger('store/post/action');

export const SET_POST = 'SET_POST';
export const SET_POST_LOAD_STATE = 'SET_POST_LOAD_STATE';

type setPostType = action<typeof SET_POST, post>;
export const setPost = (_post: post): setPostType => ({
  type: SET_POST,
  payload: _post,
});

type setPostLoadStateType = action<typeof SET_POST_LOAD_STATE, LOAD_STATE>;
export const setPostLoadState = (
  loadState: LOAD_STATE
): setPostLoadStateType => ({
  type: SET_POST_LOAD_STATE,
  payload: loadState,
});

export const getPost = (articleId: string): thunkAction => async (
  dispatch,
  getState: () => defaultStateRoot
) => {
  await dispatch(setPostLoadState(LOADING));
  const req = await getPostReq(articleId);
  if (req.error) {
    await dispatch(setPostLoadState(FAIL));
    return null;
  }
  logger.log(req.result)
  await dispatch(setPost(mapPost(req.result)));
  await dispatch(setPostLoadState(SUCCESS));
  return null;
};

export type postActionTypes = setPostType | setPostLoadStateType;
