import { shallowEqual, useSelector } from 'react-redux';
import { defaultRootState } from '../types/rootState';
import { articleReducerDefaultState } from '../types/article';

const getArticleReducer = (): articleReducerDefaultState =>
  useSelector<defaultRootState, articleReducerDefaultState>(
    (state) => state.article,
    shallowEqual
  );

export default getArticleReducer;
