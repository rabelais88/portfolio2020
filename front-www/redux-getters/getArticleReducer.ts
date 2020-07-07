import { shallowEqual, useSelector } from 'react-redux';
import { defaultStateRoot } from '../types/rootState';
import { defaultStateArticle } from '../types/article';

const getArticleReducer = (): defaultStateArticle =>
  useSelector<defaultStateRoot, defaultStateArticle>(
    (state) => state.article,
    shallowEqual
  );

export default getArticleReducer;
