import { createAction } from '@reduxjs/toolkit';
import post from '../types/post';

export const SET_POSTS = 'SET_POSTS';

function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}

const setPosts = createAction(SET_POSTS, withPayloadType<post[]>());
export default setPosts;
