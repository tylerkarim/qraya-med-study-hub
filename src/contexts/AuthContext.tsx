
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  year: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, year: number) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('qraya_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('qraya_users') || '[]');
    const foundUser = users.find((u: any) => u.username === username && u.password === password);
    
    if (foundUser) {
      const userProfile = { id: foundUser.id, username: foundUser.username, year: foundUser.year };
      setUser(userProfile);
      localStorage.setItem('qraya_user', JSON.stringify(userProfile));
      return true;
    }
    return false;
  };

  const signup = async (username: string, password: string, year: number): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('qraya_users') || '[]');
    
    if (users.find((u: any) => u.username === username)) {
      return false; // Username already exists
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      year
    };

    users.push(newUser);
    localStorage.setItem('qraya_users', JSON.stringify(users));
    
    const userProfile = { id: newUser.id, username: newUser.username, year: newUser.year };
    setUser(userProfile);
    localStorage.setItem('qraya_user', JSON.stringify(userProfile));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qraya_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
