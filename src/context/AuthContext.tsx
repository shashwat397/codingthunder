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
  supabasePromoteToAdmin,
  supabaseSignInWithGoogle,
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
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => Promise<void>;
  claimAdminRole: () => Promise<void>;
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

  const sanitizeUserRole = (u: User | null): User | null => {
    if (!u) return null;
    const cleanEmail = u.email?.toLowerCase().trim();
    if (cleanEmail !== 'mishrashashwat90@gmail.com' && u.role === 'admin') {
      return { ...u, role: 'student' };
    }
    return u;
  };

  const refreshUser = async () => {
    try {
      if (isSupabaseActive) {
        const { user: sbUser } = await supabaseGetSession();
        setUser(sanitizeUserRole(sbUser));
      } else {
        const token = api.getToken();
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        const res = await api.getMe();
        setUser(sanitizeUserRole(res.user));
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
          setUser(sanitizeUserRole(sbUser));
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
      setUser(sanitizeUserRole(sbUser));
    } else {
      const res = await api.login(email, password);
      setUser(sanitizeUserRole(res.user));
    }
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string) => {
    if (isSupabaseActive) {
      const { user: sbUser, error } = await supabaseSignUp(name, email, password);
      if (error) throw new Error(error);
      setUser(sanitizeUserRole(sbUser));
    } else {
      const res = await api.register(name, email, password);
      setUser(sanitizeUserRole(res.user));
    }
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async (email?: string, name?: string, avatar?: string) => {
    setIsLoading(true);
    try {
      const emailToUse = email || 'mishrashashwat90@gmail.com';
      const nameToUse = name || emailToUse.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const avatarToUse = avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(emailToUse)}`;

      // If Supabase is active and user didn't specify a custom mock email, try OAuth
      if (isSupabaseActive && supabase && !email) {
        const { error } = await supabaseSignInWithGoogle();
        if (!error) return;
        console.warn('Supabase Google OAuth fallback to direct session:', error);
      }

      const res = await api.loginWithGoogle(emailToUse, nameToUse, avatarToUse);
      const safeUser = sanitizeUserRole(res.user);
      setUser(safeUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('codingthunder_user', JSON.stringify(safeUser));
      }
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const claimAdminRole = async () => {
    if (!user) return;
    const cleanEmail = user.email?.toLowerCase().trim();
    if (cleanEmail !== 'mishrashashwat90@gmail.com') {
      console.warn('Only mishrashashwat90@gmail.com can have administrator access.');
      return;
    }
    if (isSupabaseActive) {
      await supabasePromoteToAdmin(user.id);
    }
    setUser({ ...user, role: 'admin' });
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
        loginWithGoogle,
        claimAdminRole,
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
