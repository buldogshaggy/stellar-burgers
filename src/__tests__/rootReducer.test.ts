import { rootReducer } from '../components/store/index';
import { configureStore } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const store = configureStore({ reducer: rootReducer });
    const initialState = store.getState();

    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(newState).toEqual(initialState);
  });
});
