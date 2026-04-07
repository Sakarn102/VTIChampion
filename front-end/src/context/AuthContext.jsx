import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (userData) => {
    if (!userData) return null;
    let role = userData.role;

    // Handle role as object from backend: { name: 'Admin' } or { name: 'ROLE_ADMIN' }
    if (role && typeof role === 'object') {
      role = role.name || role.authority || 'STUDENT';
    }
    
    // Normalize string: 'ROLE_ADMIN' -> 'ADMIN', 'Admin' -> 'ADMIN'
    if (typeof role === 'string' && role.trim() !== '') {
      role = role.toUpperCase().trim().replace('ROLE_', '');
    } else {
      role = 'STUDENT';
    }
    
    return { ...userData, role };
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      // QUAN TRỌNG: Luôn normalize lại khi đọc từ localStorage
      // để đảm bảo role luôn là string chuẩn (VD: "ADMIN" không phải {name: "Admin"})
      const parsed = JSON.parse(storedUser);
      const normalized = normalizeUser(parsed);
      setUser(normalized);
      // Cập nhật lại localStorage với data đã normalize
      localStorage.setItem('user', JSON.stringify(normalized));
    }
    setLoading(false);
  }, []);

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
