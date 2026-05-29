import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Intentar recuperar la sesión guardada al iniciar
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const nombre = localStorage.getItem('nombre');
    
    if (token && role && nombre) {
      const decoded = decodeToken(token);
      const email = decoded?.sub || '';
      return { token, role, nombre, email };
    }
    return null;
  });

  const login = (token, role, nombre) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('nombre', nombre);
    const decoded = decodeToken(token);
    const email = decoded?.sub || '';
    setUser({ token, role, nombre, email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nombre');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
