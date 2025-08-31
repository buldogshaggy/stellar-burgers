import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  getOrderByNumberApi,
  TOrdersResponse
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type OrdersState = {
  orders: TOrder[];
  loading: boolean;
  error?: string;
  currentOrder?: TOrder;
};

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: undefined,
  currentOrder: undefined
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, thunkAPI) => {
    try {
      const orders: TOrder[] = await getOrdersApi();
      return orders;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка загрузки заказов'
      );
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number, thunkAPI) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.order;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка загрузки заказа'
      );
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Для загрузки всех заказов (истории)
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //Для загрузки одного заказа
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.currentOrder = undefined;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentOrder = undefined;
      });
  }
});

export default ordersSlice.reducer;
