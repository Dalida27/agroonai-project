'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '../utils/axiosInstance';

interface User {
  name: string;
  email: string;
  region: string;
}

interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/users/me', {
            headers: {
              Authorization: token,
            },
          });
          console.log('User fetched', response.data);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
      <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
      </AuthContext.Provider>
  );
};
