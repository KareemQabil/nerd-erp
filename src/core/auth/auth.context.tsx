import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  pin: string;
  avatar?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userId: string, pin: string) => Promise<boolean>;
  logout: () => void;
  selectedUser: User | null;
  selectUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'أحمد محمد العصر',
    nameEn: 'Ahmed Mohammed Al-Asr',
    role: 'مدير النظام',
    pin: '1234',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    isActive: true,
  },
  {
    id: '2',
    name: 'سارة عبدالله الزهراني',
    nameEn: 'Sara Abdullah Al-Zahrani',
    role: 'موظف مبيعات',
    pin: '5678',
    isActive: false,
  },
  {
    id: '3',
    name: 'محمد خالد السعيد',
    nameEn: 'Mohammed Khaled Al-Saeed',
    role: 'موظف مبيعات',
    pin: '9012',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    isActive: false,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  };

  const login = async (userId: string, pin: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(u => u.id === userId && u.pin === pin);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setSelectedUser(null);
    localStorage.removeItem('auth_user');
  };

  const selectUser = (selectedUser: User | null) => {
    setSelectedUser(selectedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, selectedUser, selectUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { MOCK_USERS };
