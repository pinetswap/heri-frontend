import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { API_URL } from '../config/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      } else {
        // Token might be invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    
    // Polling every 5 seconds to get balance updates
    const interval = setInterval(() => {
      if (localStorage.getItem('token')) {
        fetchUser();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
