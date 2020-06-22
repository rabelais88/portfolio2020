import { shallowEqual, useSelector } from 'react-redux';
import { defaultState } from '../store/index';
import { articleReducerDefaultState } from '../store/articleReducer';

const getArticleReducer = (): articleReducerDefaultState =>
  useSelector<defaultState, articleReducerDefaultState>(
    (state) => state.article,
    shallowEqual
  );

export default getArticleReducer;
