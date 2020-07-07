import {
  createStore,
  applyMiddleware,
  combineReducers,
  AnyAction,
} from 'redux';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { defaultStateRoot } from 'types/rootState';
import articleReducer from './article/reducer';

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
