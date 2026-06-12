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
  const id = localStorage.getItem('id');

  if (token && role && nombre && id) {
    const decoded = decodeToken(token);
    const email = decoded?.sub || '';
    return { token, role, nombre, email, id: parseInt(id, 10) };
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
      const { token, role, nombre, id } = action.payload;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('id', id);
      const decoded = decodeToken(token);
      const email = decoded?.sub || '';
      state.user = { token, role, nombre, email, id };
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('nombre');
      localStorage.removeItem('id');
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
