import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { AppDispatch, RootState } from '../../components/store';
import { fetchFeedOrders } from '../../components/store/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.feed);

  useEffect(() => {
    dispatch(fetchFeedOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeedOrders())}
    />
  );
};
