import axios from 'axios';
import api from './api';

// API ile etkileşim için property servisi
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Property form veri tipi
export interface PropertyFormData {
  title: string;
  description: string;
  price: string ;  // Hem string hem number kabul eder
    currency: 'TRY' | 'USD' | 'EUR'; // Para birimi seçeneği ekle
  discountedPrice?: string ; 
  propertyType: string;
  category: string;

  type: 'sale' | 'rent';
  bedrooms: string;  
  bathrooms: string | number; 
  area: string | number;      // Hem string hem number kabul eder
  buildingAge: string | number; // Hem string hem number kabul eder
  floor: string | number;       // Hem string hem number kabul eder
  totalFloors: string | number; // Hem string hem number kabul eder
  furnished: boolean;
  balcony: boolean;
  parking: boolean;
  elevator: boolean;
  security: boolean;
  garden: boolean;
  address: string;
  district: string;
  city: string;
  location: {
    lat: string;
    lng: string;
  };
  features: string[];
  nearbyPlaces: string[];
}

// Slug'a göre ilan detaylarını getir
export async function getPropertyBySlug(slug: string) {
  try {
    const response = await fetch(`${API_URL}/properties/by-slug/${slug}`);
    
    if (!response.ok) {
      throw new Error('İlan bilgileri alınamadı');
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching property by slug:', error);
    throw new Error(error.message || 'İlan bilgileri alınamadı');
  }
}
// Bekleyen ilanları getir
// Bekleyen ilanları getir
export async function getPendingProperties() {
  try {
    console.log('Fetching pending properties...');
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');
    }
    
    console.log('Token found, making API request...');
    const response = await api.get('/properties/pending');
    console.log('API response received:', response.status);
    
    if (response.data && response.data.properties) {
      console.log(`Got ${response.data.properties.length} properties`);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching pending properties:', error);
    
    if (error.response) {
      console.error('Response error details:', error.response.status, error.response.data);
      throw new Error(error.response.data?.message || `Sunucu hatası: ${error.response.status}`);
    }
    
    throw new Error(error.message || 'Bekleyen ilanlar alınamadı');
  }
}
// ID'ye göre ilan detaylarını getir (gerekirse)
export async function getPropertyById(id: string | number) {
  try {
    const response = await fetch(`${API_URL}/properties/${id}`);
    
    if (!response.ok) {
      throw new Error('İlan bilgileri alınamadı');
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching property by id:', error);
    throw new Error(error.message || 'İlan bilgileri alınamadı');
  }
}

// Tüm ilanları getir
export async function getAllProperties(params = {}) {
  try {
    // Parametreleri URL'ye ekle
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
      
    const url = `${API_URL}/properties${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('İlanlar alınamadı');
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching all properties:', error);
    throw new Error(error.message || 'İlanlar alınamadı');
  }
}

// Danışmanın kendi ilanlarını getir
export async function getMyProperties() {
  try {
    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await api.get('/properties/my-properties', {
      headers
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching my properties:', error);
    
    if (error.response) {
      throw new Error(error.response.data?.message || `Sunucu hatası: ${error.response.status}`);
    }
    
    throw new Error(error.message || 'İlanlarınız alınamadı');
  }
}
export async function approveProperty(id: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');
    }
    
    const response = await api.put(`/properties/${id}/approve`);
    return response.data;
  } catch (error: any) {
    console.error('Error approving property:', error);
    
    if (error.response) {
      throw new Error(error.response.data?.message || `Sunucu hatası: ${error.response.status}`);
    }
    
    throw new Error(error.message || 'İlan onaylanırken bir hata oluştu');
  }
}

// İlan reddetme
export async function rejectProperty(id: string, reason: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');
    }
    
    const response = await api.put(`/properties/${id}/reject`, { reason });
    return response.data;
  } catch (error: any) {
    console.error('Error rejecting property:', error);
    
    if (error.response) {
      throw new Error(error.response.data?.message || `Sunucu hatası: ${error.response.status}`);
    }
    
    throw new Error(error.message || 'İlan reddedilirken bir hata oluştu');
  }
}

// property.service.ts

// property.service.ts
export async function createProperty(propertyData: PropertyFormData, imageFiles: File[]) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');
    }
    
    const formData = new FormData();
    formData.append('data', JSON.stringify(propertyData));
    
    // Resimleri ekle
    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        console.log(`Resim ekleniyor ${i+1}:`, file.name, file.size);
        formData.append('images', file);
      }
    }
    
    // console.log('Token:', token.substring(0, 10) + '...');
    
    // Basitleştirilmiş fetch API kullanımı
    const response = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: {
        // Content-Type EKLEME! FormData kendisi ekler
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token  // Eski format için de ekleyelim
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}
// İlan güncelleme
export async function updateProperty(id: string, propertyData: PropertyFormData) {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');

    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token
      },
      body: JSON.stringify(propertyData)
    });
    if (!response.ok) throw new Error('Güncelleme başarısız!');
    return await response.json();
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
}

// İlan silme
export async function deleteProperty(id: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');

    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token
      }
    });
    if (!response.ok) throw new Error('Silme başarısız!');
    return await response.json();
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
}
// Service nesnesini export et
const propertyService = {
  getPropertyBySlug,
  getPropertyById,
  getAllProperties,
  getMyProperties,
  createProperty,
   getPendingProperties, // Yeni fonksiyon eklendi
  approveProperty,      // Onaylama fonksiyonu ekleyin
  rejectProperty  ,      // Reddetme fonksiyonu ekleyin
  updateProperty,
  deleteProperty,
};

export default propertyService;