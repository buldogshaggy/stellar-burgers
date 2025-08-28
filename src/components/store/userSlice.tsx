import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  updateUserApi,
  getUserApi,
  logoutApi
} from '../../utils/burger-api';
import { TUser, TRegisterData } from '../../utils/types';

type UserState = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};

// 🔹 Логин
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await loginUserApi(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Ошибка входа');
    }
  }
);

// 🔹 Регистрация
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, thunkAPI) => {
    try {
      const response = await registerUserApi(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Ошибка регистрации');
    }
  }
);

// 🔹 Получить данные пользователя (например, при загрузке приложения)
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, thunkAPI) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка получения пользователя'
      );
    }
  }
);

// 🔹 Обновить данные пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, thunkAPI) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка обновления профиля'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  extraReducers: (builder) => {
    builder
      // регистрация
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // логин
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // получение user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // обновление user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
