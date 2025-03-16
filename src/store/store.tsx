import { configureStore } from '@reduxjs/toolkit';
import dataSlice from '../features/dataSlice';

export const store = configureStore({
  reducer: {
    data: dataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['data.image'],
        ignoredActions: ['data/addData'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
