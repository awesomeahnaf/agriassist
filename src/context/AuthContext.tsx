/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, identifier: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('agri_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (role: UserRole, identifier: string) => {
    let name = 'ব্যবহারকারী';
    if (role === 'farmer') name = 'আব্দুর রহমান';
    else if (role === 'field_officer') name = 'করিম উদ্দিন';
    else if (role === 'expert') name = 'ডঃ শফিকুল ইসলাম';

    const newUser: User = {
      id: role.charAt(0) + '1',
      name,
      role,
      phone: identifier.includes('@') ? undefined : identifier,
      email: identifier.includes('@') ? identifier : undefined,
    };

    setUser(newUser);
    localStorage.setItem('agri_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agri_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
