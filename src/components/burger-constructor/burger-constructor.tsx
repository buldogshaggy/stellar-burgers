import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, AppDispatch } from '../store';
import { orderBurger, closeOrderModal } from '../store/ingredientSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(
    (state: RootState) => state.ingredients.constructorItems
  );
  const orderRequest = useSelector(
    (state: RootState) => state.ingredients.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.ingredients.orderModalData
  );

  const user = useSelector((state: RootState) => state.user.user);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = constructorItems.ingredients.map(
      (i: TConstructorIngredient) => i._id
    );

    if (constructorItems.bun) {
      ingredientIds.unshift(constructorItems.bun._id);
      ingredientIds.push(constructorItems.bun._id);
    }

    dispatch(orderBurger(ingredientIds));
  };

  const handleCloseModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
