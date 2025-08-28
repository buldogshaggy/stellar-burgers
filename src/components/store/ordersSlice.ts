import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type OrdersState = {
  orders: TOrder[];
  loading: boolean;
  error?: string;
};

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: undefined
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, thunkAPI) => {
    try {
      const orders: TOrder[] = await getOrdersApi(); // используем существующую функцию
      return orders;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка загрузки заказов'
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
      });
  }
});

export default ordersSlice.reducer;
