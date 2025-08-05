'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService, { User } from '../../services/auth.service';
import { useToast } from '../components/ui/toast-context';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast();

  // API URL'ini çevresel değişkenden al veya varsayılan değeri kullan
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı oturumunu kontrol et
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // localStorage'dan kullanıcıyı al
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // Token var, API'dan güncel kullanıcı bilgisini al
          const userProfile = await authService.getUserProfile();
          
          if (userProfile) {
            setUser(userProfile);
          } else {
            // Profil alınamadıysa, token geçersiz olabilir, logout
            authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Login attempt with:', { username });
      
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      
      if (!response.ok) {
        toast({
          title: 'Giriş Başarısız',
          description: data.message || `Hata kodu: ${response.status}`,
          variant: 'destructive',
        });
        return false;
      }
      
      if (data.token) {
        // Kullanıcı bilgilerini kaydet
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        
        toast({
          title: 'Giriş Başarılı',
          description: `Hoş geldiniz, ${data.user.name}!`,
          variant: 'success',
        });
        
        return true;
      } else {
        toast({
          title: 'Giriş Başarısız',
          description: 'Geçersiz yanıt formatı',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Giriş Başarısız',
        description: error.message || 'Bilinmeyen bir hata oluştu',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: 'Çıkış Yapıldı',
      description: 'Oturumunuz kapatıldı',
      variant: 'default',
    });
    router.push('/login');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};