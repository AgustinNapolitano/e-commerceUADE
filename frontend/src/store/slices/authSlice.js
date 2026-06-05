import { createSlice } from '@reduxjs/toolkit';

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const getInitialUser = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const nombre = localStorage.getItem('nombre');

  if (token && role && nombre) {
    const decoded = decodeToken(token);
    const email = decoded?.sub || '';
    return { token, role, nombre, email };
  }
  return null;
};

const initialState = {
  user: getInitialUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, role, nombre } = action.payload;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('nombre', nombre);
      const decoded = decodeToken(token);
      const email = decoded?.sub || '';
      state.user = { token, role, nombre, email };
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('nombre');
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
