import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('usuarioLogado');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('usuarioLogado', JSON.stringify(user));
    } else {
      localStorage.removeItem('usuarioLogado');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  function login(dados) {
    setUser({ id: dados.id, email: dados.email, telefone: dados.telefone, id_tipo: dados.id_tipo });
    setToken(dados.token);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token');
    localStorage.removeItem('emailLembrado');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, logado: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
