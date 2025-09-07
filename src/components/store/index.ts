import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientSlice';
import userReducer from './userSlice';
import ordersReducer from '../../components/store/ordersSlice';
import feedReducer from '../../components/store/feedSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  orders: ordersReducer,
  feed: feedReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
