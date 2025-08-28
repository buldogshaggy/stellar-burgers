import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileOrdersUI } from '@ui-pages';
import { RootState, AppDispatch } from '../../components/store';
import { fetchUserOrders } from '../../components/store/ordersSlice';
import { Preloader } from '@ui';
import { fetchIngredients } from '../../components/store/ingredientSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) return <Preloader />;
  return <ProfileOrdersUI orders={orders} />;
};
