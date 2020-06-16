import { createAction, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import LOAD_STATE from '../types/loadState';

const setArticlesLoadState = createAction<LOAD_STATE, 'setArticlesLoadState'>(
  'setArticlesLoadState'
);

export default setArticlesLoadState;
