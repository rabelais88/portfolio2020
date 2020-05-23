import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import postReducer, {
  getDefaultState as getDefaultPostState,
  postReducerDefaultState,
} from './postReducer';

export interface defaultState {
  post: postReducerDefaultState;
}

const getDefaultStates = () => ({
  post: getDefaultPostState(),
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['post'],
  blacklist: [],
};

const rootReducer = combineReducers({
  post: postReducer,
});

const middleware = getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
});

const initializeStore = (preloadedState) =>
  configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    preloadedState: preloadedState || getDefaultStates(),
    middleware,
  });

export const store = initializeStore(undefined);
export const persistor = persistStore(store);

export default {
  store,
  persistor,
};
