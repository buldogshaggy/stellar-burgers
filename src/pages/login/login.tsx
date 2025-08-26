import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUI } from '@ui-pages';
import { loginUser } from '../../components/store/userSlice';
import { RootState, AppDispatch } from '../../components/store';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // Редирект после успешного логина
  useEffect(() => {
    console.log('user state changed:', user);
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <LoginUI
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={error || ''}
    />
  );
};
