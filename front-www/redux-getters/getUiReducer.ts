import { shallowEqual, useSelector } from 'react-redux';
import { defaultStateRoot } from 'types/rootState';
import { defaultStateUi } from 'types/ui';

const getArticleReducer = (): defaultStateUi =>
  useSelector<defaultStateRoot, defaultStateUi>(
    (state) => state.ui,
    shallowEqual
  );

export default getArticleReducer;
