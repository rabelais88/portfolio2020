import { shallowEqual, useSelector } from 'react-redux';
import { defaultState } from '../store/index';
import { postReducerDefaultState } from '../store/postReducer';

const getPostReducer = (): postReducerDefaultState =>
  useSelector<defaultState, postReducerDefaultState>(
    (state) => state.post,
    shallowEqual
  );

export default getPostReducer;
