import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const normalizeUser = (userData) => {
    if (!userData) return null;
    let role = userData.role;
    // Handle role object from backend: { name: 'ROLE_ADMIN' } or { name: 'ADMIN' }
    if (role && typeof role === 'object') {
      role = role.name || role.authority || 'STUDENT';
    }
    
    // Normalize string: ROLE_ADMIN -> ADMIN
    if (typeof role === 'string') {
      role = role.toUpperCase().replace('ROLE_', '');
    } else {
      role = 'STUDENT';
    }
    
    return { ...userData, role };
  };

  const login = (userData, token) => {
    const normalizedUser = normalizeUser(userData);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('token', token);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = (newData) => {
    const combinedData = { ...user, ...newData };
    const normalizedUser = normalizeUser(combinedData);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
