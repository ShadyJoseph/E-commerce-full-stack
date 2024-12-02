import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { setUser } from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import productReducer from './slices/productSlice';
import userProfileReducer from './slices/userProfileSlice';
import { getAuthToken, removeAuthToken } from '../api/auth';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import cartReducer from './slices/cartSlice'
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
  cart: cartReducer
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
export const syncAuthState = async () => {
  const token = getAuthToken();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (token && user) {
    try {
      console.log('[Sync] Syncing auth state. Token:', token, 'User:', user);
      await store.dispatch(setUser({ user, token })); // Wait for the state to update
    } catch (error) {
      console.warn('[Sync] Invalid or expired token:', error);
      removeAuthToken(); // Clear invalid token
    }
  } else {
    console.warn('[Sync] No valid auth state found. Clearing state.');
    removeAuthToken();
  }
};

syncAuthState();

export default store;
