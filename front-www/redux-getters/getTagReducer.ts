import { shallowEqual, useSelector } from 'react-redux';
import { defaultStateRoot } from 'types/rootState';
import { defaultStateTag } from 'types/tag';

const getArticleReducer = (): defaultStateTag =>
  useSelector<defaultStateRoot, defaultStateTag>(
    (state) => state.tag,
    shallowEqual
  );

export default getArticleReducer;
