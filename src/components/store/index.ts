import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
