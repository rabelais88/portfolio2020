import {
  createStore,
  applyMiddleware,
  combineReducers,
  AnyAction,
} from 'redux';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import { defaultStateRoot } from 'types/rootState';
import articleReducer from './article/reducer';
import tagReducer from './tag/reducer';
import uiReducer from './ui/reducer';
import postReducer from './post/reducer';

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const combinedReducer = combineReducers({
  article: articleReducer,
  tag: tagReducer,
  ui: uiReducer,
  post: postReducer,
});

const rootReducer = (state: defaultStateRoot, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    // if (state.count) nextState.count = state.count; // preserve count value on client side navigation
    return nextState;
  }
  return combinedReducer(state, action);
};

const makeStore: MakeStore<defaultStateRoot> = (context: Context) =>
  createStore(rootReducer, bindMiddleware([thunkMiddleware]));

export default createWrapper(makeStore);
