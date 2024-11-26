import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice'
import productReducer from './slices/productSlice'
import userProfileReducer from './slices/userProfileSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    products: productReducer,
    userProfile: userProfileReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
