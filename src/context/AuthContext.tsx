import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  isSupabaseConfigured,
  supabase,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  supabaseGetSession,
} from '../services/supabase.ts';

interface CheckoutItem {
  itemType: 'course' | 'ebook';
  itemId: string;
  itemTitle: string;
  price: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSupabaseActive: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  checkoutItem: CheckoutItem | null;
  openCheckout: (item: CheckoutItem) => void;
  closeCheckout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);

  const isSupabaseActive = isSupabaseConfigured();

  const refreshUser = async () => {
    try {
      if (isSupabaseActive) {
        const { user: sbUser } = await supabaseGetSession();
        setUser(sbUser);
      } else {
        const token = api.getToken();
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        const res = await api.getMe();
        setUser(res.user);
      }
    } catch {
      api.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    // If Supabase is active, listen to auth state changes
    if (isSupabaseActive && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { user: sbUser } = await supabaseGetSession();
          setUser(sbUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [isSupabaseActive]);

  const login = async (email: string, password: string) => {
    if (isSupabaseActive) {
      const { user: sbUser, error } = await supabaseSignIn(email, password);
      if (error) throw new Error(error);
      setUser(sbUser);
    } else {
      const res = await api.login(email, password);
      setUser(res.user);
    }
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string) => {
    if (isSupabaseActive) {
      const { user: sbUser, error } = await supabaseSignUp(name, email, password);
      if (error) throw new Error(error);
      setUser(sbUser);
    } else {
      const res = await api.register(name, email, password);
      setUser(res.user);
    }
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    if (isSupabaseActive) {
      await supabaseSignOut();
    }
    api.logout();
    setUser(null);
  };

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openCheckout = (item: CheckoutItem) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setCheckoutItem(item);
  };

  const closeCheckout = () => {
    setCheckoutItem(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseActive,
        login,
        register,
        logout,
        refreshUser,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        checkoutItem,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
