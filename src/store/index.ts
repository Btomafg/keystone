import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  auth: authSlice,
});

const appReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    state = undefined;
    localStorage.clear();
  }
  return rootReducer(state, action);
};

const persistedReducer = persistReducer<RootStateType>(persistConfig, appReducer);

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;

export type RootStateType = ReturnType<typeof rootReducer>;
export type StoreStateType = ReturnType<typeof store.getState>;
export type StoreType = typeof store;
export type ThunkType = ThunkAction<void, RootStateType, unknown, Action>;
