import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBun, addIngredient } from '../store/ingredientSlice';
import { v4 as uuid } from 'uuid';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { RootState } from '../store';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const count = useSelector((state: RootState) => {
      if (ingredient.type === 'bun') {
        return state.ingredients.constructorItems.bun?._id === ingredient._id
          ? 1
          : 0;
      }
      return state.ingredients.constructorItems.ingredients.filter(
        (i: TConstructorIngredient) => i._id === ingredient._id
      ).length;
    });

    const handleAdd = () => {
      const ingredientWithId = { ...ingredient, id: uuid() };

      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredientWithId));
      } else {
        dispatch(addIngredient(ingredientWithId));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
