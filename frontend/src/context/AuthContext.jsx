import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Intentar recuperar la sesión guardada al iniciar
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const nombre = localStorage.getItem('nombre');
    
    if (token && role && nombre) {
      return { token, role, nombre };
    }
    return null;
  });

  const login = (token, role, nombre) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('nombre', nombre);
    setUser({ token, role, nombre });
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
