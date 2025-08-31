import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '../../utils/burger-api';
import { logout } from '../store/userSlice';
import { setCookie } from '../../utils/cookie';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');
      dispatch(logout());
      navigate('/login');
    } catch (err) {}
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
