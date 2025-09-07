import reducer, {
  initialState,
  logout,
  loginUser,
  registerUser,
  fetchUser,
  updateUser,
  autoLogin,
} from '../components/store/userSlice';

describe('userSlice reducer', () => {
  //Мокаем localStorage перед каждым тестом
  beforeEach(() => {
    let store: Record<string, string> = {};

    const localStorageMock = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });
  });

  it('возвращает initial state при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('logout очищает пользователя и токены', () => {
    localStorage.setItem('accessToken', 'token');
    localStorage.setItem('refreshToken', 'refresh');

    const stateWithUser = {
      ...initialState,
      user: { email: 'test@test.com', name: 'User' },
    };

    const state = reducer(stateWithUser, logout());

    expect(state.user).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  //registerUser
  it('registerUser.pending → loading=true, error=null', () => {
    const state = reducer(initialState, { type: registerUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('registerUser.fulfilled → сохраняет user', () => {
    const payload = { email: 'test@example.com', name: 'Test' };
    const state = reducer(initialState, {
      type: registerUser.fulfilled.type,
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(payload);
  });

  it('registerUser.rejected → error сохраняется', () => {
    const state = reducer(initialState, {
      type: registerUser.rejected.type,
      payload: 'Ошибка регистрации',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка регистрации');
  });

  //loginUser
  it('loginUser.pending → loading=true', () => {
    const state = reducer(initialState, { type: loginUser.pending.type });
    expect(state.loading).toBe(true);
  });

  it('loginUser.fulfilled → сохраняет user', () => {
    const payload = { email: 'login@test.com', name: 'Login' };
    const state = reducer(initialState, {
      type: loginUser.fulfilled.type,
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(payload);
  });

  it('loginUser.rejected → error сохраняется', () => {
    const state = reducer(initialState, {
      type: loginUser.rejected.type,
      payload: 'Ошибка входа',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка входа');
  });

  //fetchUser
  it('fetchUser.fulfilled → сохраняет user', () => {
    const payload = { email: 'fetch@test.com', name: 'Fetch' };
    const state = reducer(initialState, {
      type: fetchUser.fulfilled.type,
      payload,
    });
    expect(state.user).toEqual(payload);
  });

  //updateUser
  it('updateUser.fulfilled → обновляет user', () => {
    const prev = {
      ...initialState,
      user: { email: 'old@test.com', name: 'Old' },
    };
    const payload = { email: 'new@test.com', name: 'New' };
    const state = reducer(prev, {
      type: updateUser.fulfilled.type,
      payload,
    });
    expect(state.user).toEqual(payload);
  });

  //autoLogin
  it('autoLogin.fulfilled → сохраняет user', () => {
    const payload = { email: 'auto@test.com', name: 'Auto' };
    const state = reducer(initialState, {
      type: autoLogin.fulfilled.type,
      payload,
    });
    expect(state.user).toEqual(payload);
  });

  it('autoLogin.rejected → user=null и error сохраняется', () => {
    const state = reducer(initialState, {
      type: autoLogin.rejected.type,
      payload: 'Ошибка автологина',
    });
    expect(state.user).toBeNull();
    expect(state.error).toBe('Ошибка автологина');
  });
});
