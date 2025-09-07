import reducer, {
  initialState,
  fetchFeedOrders,
} from '../components/store/feedSlice';
import { TOrder } from '../utils/types';

describe('feedSlice reducer', () => {
  it('возвращает initial state при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('fetchFeedOrders.pending → loading=true и error сбрасывается', () => {
    const state = reducer(initialState, { type: fetchFeedOrders.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('fetchFeedOrders.fulfilled → сохраняет заказы и статистику', () => {
    const orders = [
      { _id: '1', number: 1 } as unknown as TOrder,
      { _id: '2', number: 2 } as unknown as TOrder,
    ];
    const payload = { orders, total: 100, totalToday: 10 };

    const state = reducer(initialState, {
      type: fetchFeedOrders.fulfilled.type,
      payload,
    });

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(orders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
  });

  it('fetchFeedOrders.rejected → loading=false и ошибка сохраняется', () => {
    const state = reducer(initialState, {
      type: fetchFeedOrders.rejected.type,
      payload: 'Ошибка загрузки',
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
