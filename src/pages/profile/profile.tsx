import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../components/store';
import { ProfileUI } from '@ui-pages';
import { updateUser } from '../../components/store/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  //когда user обновляется — заполняем форму
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const payload: { name: string; email: string; password?: string } = {
      name: formValue.name,
      email: formValue.email
    };
    if (formValue.password) payload.password = formValue.password;

    dispatch(updateUser(payload))
      .unwrap()
      .then((user) => {
        console.log('Профиль обновлён', user);
      })
      .catch((err) => {
        console.error('Ошибка обновления профиля', err);
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
