import reducer, {
  initialState,
  fetchUserOrders,
  fetchOrderByNumber,
} from '../components/store/ordersSlice';
import { TOrder } from '../utils/types';

describe('ordersSlice reducer', () => {
  it('возвращает initial state при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('fetchUserOrders.pending → loading=true и error сбрасывается', () => {
    const state = reducer(initialState, { type: fetchUserOrders.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('fetchUserOrders.fulfilled → сохраняет список заказов', () => {
    const orders = [
      { _id: '1', number: 101 } as unknown as TOrder,
      { _id: '2', number: 102 } as unknown as TOrder,
    ];
    const state = reducer(initialState, {
      type: fetchUserOrders.fulfilled.type,
      payload: orders,
    });
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(orders);
  });

  it('fetchUserOrders.rejected → loading=false и сохраняет ошибку', () => {
    const state = reducer(initialState, {
      type: fetchUserOrders.rejected.type,
      payload: 'Ошибка загрузки заказов',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
  });

  // ==== fetchOrderByNumber ====
  it('fetchOrderByNumber.pending → loading=true, currentOrder очищается', () => {
    const state = reducer(initialState, { type: fetchOrderByNumber.pending.type });
    expect(state.loading).toBe(true);
    expect(state.currentOrder).toBeUndefined();
  });

  it('fetchOrderByNumber.fulfilled → сохраняет текущий заказ', () => {
    const order = { _id: '1', number: 777 } as unknown as TOrder;
    const state = reducer(initialState, {
      type: fetchOrderByNumber.fulfilled.type,
      payload: order,
    });
    expect(state.loading).toBe(false);
    expect(state.currentOrder).toEqual(order);
  });

  it('fetchOrderByNumber.rejected → loading=false, currentOrder=undefined и ошибка сохраняется', () => {
    const state = reducer(initialState, {
      type: fetchOrderByNumber.rejected.type,
      payload: 'Ошибка загрузки заказа',
    });
    expect(state.loading).toBe(false);
    expect(state.currentOrder).toBeUndefined();
    expect(state.error).toBe('Ошибка загрузки заказа');
  });
});
