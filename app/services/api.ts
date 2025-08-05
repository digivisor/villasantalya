import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Her iki header formatını da ekle (hangisinin çalıştığından emin olmak için)
      config.headers['Authorization'] = `Bearer ${token}`;  // Standart Bearer token formatı
      config.headers['x-auth-token'] = token;  // Özel x-auth-token header'ı
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Hata detaylarını yazdır
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Request error (no response):', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    // Oturum süresi bitmiş olabilir (401)
    if (error.response && error.response.status === 401) {
      // Kullanıcıyı logout yapmak için global bir fonksiyon çağrılabilir
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;