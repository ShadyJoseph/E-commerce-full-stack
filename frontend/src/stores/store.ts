import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { setUser } from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import productReducer from './slices/productSlice';
import userProfileReducer from './slices/userProfileSlice';
import { getAuthToken, removeAuthToken } from '../api/auth';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  products: productReducer,
  userProfile: userProfileReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const syncAuthState = () => {
  const token = getAuthToken();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (token && user) {
    try {
      // Validate token (optional: add API call or decoding logic if required)
      store.dispatch(setUser({ user, token }));
    } catch (error) {
      console.warn('[Sync] Invalid or expired token:', error);
      removeAuthToken(); // Clear invalid token
    }
  }
};


syncAuthState();

export default store;
