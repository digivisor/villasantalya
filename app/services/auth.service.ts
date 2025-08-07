// src/services/auth.service.ts
import api from './api';

export interface User {
  profile: string;
  role: string;
  id: string;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  image: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

class AuthService {
  async login(username: string, password: string): Promise<User | null> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        username,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  async getUserProfile(): Promise<User | null> {
    try {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }
}

export default new AuthService();