import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchIngredients } from '../store/ingredientSlice';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Получаем ингредиенты и статус из Redux
  const { items, status, error } = useSelector(
    (state: RootState) => state.ingredients
  );

  // Делим ингредиенты на категории
  const buns = items.filter((i) => i.type === 'bun');
  const mains = items.filter((i) => i.type === 'main');
  const sauces = items.filter((i) => i.type === 'sauce');

  // Табы
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Refs для скролла
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Запрашиваем ингредиенты с сервера при монтировании
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [dispatch, status]);

  // Автоматическое переключение таба при скролле
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewFilling) {
      setCurrentTab('main');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик клика по табу
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Лоадер или ошибка
  if (status === 'loading') return <p>Загрузка ингредиентов...</p>;
  if (status === 'failed') return <p>Ошибка загрузки: {error}</p>;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
