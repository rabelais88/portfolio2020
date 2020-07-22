import { shallowEqual, useSelector } from 'react-redux';
import { defaultStateRoot } from '../types/rootState';
import { defaultStatePost } from '../types/postStore';

const getPostReducer = (): defaultStatePost =>
  useSelector<defaultStateRoot, defaultStatePost>(
    (state) => state.post,
    shallowEqual
  );

export default getPostReducer;
