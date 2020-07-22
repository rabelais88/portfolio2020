import { post, defaultStatePost } from 'types/postStore';
import { POST } from 'types/articleType';
import { INIT } from 'types/loadState';
import { postActionTypes, SET_POST, SET_POST_LOAD_STATE } from './action';

export const getDefaultPost = (): post => ({
  content: '',
  id: '', // articleId
  type: POST,
  title: '',
  desc: '',
  coverImage: '',
  link: '',
  createdAt: -1,
  updatedAt: -1,
  deletedAt: -1,
  tags: [],
});

export const getDefaultState = (): defaultStatePost => ({
  post: getDefaultPost(),
  loadState: INIT,
});

function reducer(
  state: defaultStatePost,
  action: postActionTypes
): defaultStatePost {
  if (!state) return getDefaultState();
  switch (action.type) {
    case SET_POST:
      return { ...state, post: action.payload };
    case SET_POST_LOAD_STATE:
      return { ...state, loadState: action.payload };
    default:
      return state;
  }
}

export default reducer;
