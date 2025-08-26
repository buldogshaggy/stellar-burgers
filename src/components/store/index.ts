import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientSlice';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
