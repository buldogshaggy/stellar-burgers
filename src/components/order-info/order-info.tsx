import { FC, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { TIngredient, TOrderInfo, TOrder } from '../../utils/types';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { fetchOrderByNumber } from '../store/ordersSlice';

export const OrderInfo: FC<{ orderNumber?: number }> = ({ orderNumber }) => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const userOrders = useSelector((state: RootState) => state.orders.orders);
  const currentOrder = useSelector(
    (state: RootState) => state.orders.currentOrder
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  const targetNumber = orderNumber ?? Number(number);

  //ищем в сторе
  const orderData: TOrder | undefined =
    feedOrders.find((o) => o.number === targetNumber) ||
    userOrders.find((o) => o.number === targetNumber) ||
    currentOrder;

  //если заказа нет — загружаем отдельно
  useEffect(() => {
    if (!orderData && targetNumber) {
      dispatch(fetchOrderByNumber(targetNumber));
    }
  }, [orderData, targetNumber, dispatch]);

  const orderInfo: TOrderInfo | null = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc, id) => {
        const ing = ingredients.find((i) => i._id === id);
        if (!ing) return acc;

        if (!acc[id]) acc[id] = { ...ing, count: 1 };
        else acc[id].count++;
        return acc;
      },
      {} as Record<string, TIngredient & { count: number }>
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, ing) => acc + ing.price * ing.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
