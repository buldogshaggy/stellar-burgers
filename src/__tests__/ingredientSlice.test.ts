import reducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  closeOrderModal,
  fetchIngredients,
  orderBurger,
  initialState
} from '../components/store/ingredientSlice';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

describe('ingredientSlice reducer', () => {
  it('должен вернуть initial state при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('устанавливает булку (setBun)', () => {
    const bun = { _id: 'bun1', name: 'Булка', type: 'bun' } as TConstructorIngredient;
    const state = reducer(initialState, setBun(bun));
    expect(state.constructorItems.bun).toEqual(bun);
  });

  it('добавляет ингредиент (addIngredient)', () => {
    const ingredient = { _id: 'ing1', name: 'Котлета', type: 'main' } as TConstructorIngredient;
    const state = reducer(initialState, addIngredient(ingredient));
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual(ingredient);
  });

  it('удаляет ингредиент (removeIngredient)', () => {
    const ingredient = { _id: 'ing1', name: 'Котлета', type: 'main' } as TConstructorIngredient;
    const stateWithIngredient = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ingredient] }
    };
    const state = reducer(stateWithIngredient, removeIngredient(0));
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('перемещает ингредиент (moveIngredient)', () => {
    const ing1 = { _id: '1', name: 'Салат', type: 'main' } as TConstructorIngredient;
    const ing2 = { _id: '2', name: 'Сыр', type: 'main' } as TConstructorIngredient;
    const stateWithIngredients = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ing1, ing2] }
    };
    const state = reducer(stateWithIngredients, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    expect(state.constructorItems.ingredients[0]).toEqual(ing2);
    expect(state.constructorItems.ingredients[1]).toEqual(ing1);
  });

  it('закрывает модалку заказа (closeOrderModal)', () => {
    const order = { number: 123 } as TOrder;
    const stateWithOrder = { ...initialState, orderModalData: order };
    const state = reducer(stateWithOrder, closeOrderModal());
    expect(state.orderModalData).toBeNull();
  });

  //extraReducers

  it('fetchIngredients.pending → status=loading', () => {
    const state = reducer(initialState, { type: fetchIngredients.pending.type });
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.fulfilled → сохраняет ингредиенты', () => {
    const payload = [{ _id: 'ing1', name: 'Соус' }] as TIngredient[];
    const state = reducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload
    });
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(payload);
  });

  it('fetchIngredients.rejected → status=failed и ошибка', () => {
    const state = reducer(initialState, {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка сети'
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка сети');
  });

  it('orderBurger.pending → orderRequest=true', () => {
    const state = reducer(initialState, { type: orderBurger.pending.type });
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('orderBurger.fulfilled → сохраняет заказ и очищает конструктор', () => {
    const prevState = {
      ...initialState,
      constructorItems: {
        bun: { _id: 'bun1', name: 'Булка', type: 'bun' } as TConstructorIngredient,
        ingredients: [
          { _id: 'ing1', name: 'Котлета', type: 'main' } as TConstructorIngredient
        ]
      }
    };
    const order = { number: 42 } as TOrder;
    const state = reducer(prevState, {
      type: orderBurger.fulfilled.type,
      payload: order
    });
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(order);
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('orderBurger.rejected → orderRequest=false и ошибка', () => {
    const state = reducer(initialState, {
      type: orderBurger.rejected.type,
      payload: 'Ошибка сервера'
    });
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка сервера');
  });
});
