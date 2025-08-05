// services/profile.service.ts
import api from './api';

export interface ProfileData {
  id?: string;
  username: string;
  name: string;
  email: string;
  title: string;
  phone: string;
  image?: string;
  about?: string;
  company?: {
    id: string;
    name: string;
  };
  rating?: number;
  experience?: number;
  languages?: string[];
  regions?: string[];
  specialties?: string[];
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  isAdmin?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

// profileService.ts içindeki API çağrılarında /api/ kısmını çıkarın
export async function getProfile() {
  try {
    console.log('Fetching profile from:', '/agents/profile');
    const response = await api.get('/agents/profile'); // /api/ kısmını çıkarın
    console.log('Profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    console.error('Response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Profil bilgileri yüklenirken bir hata oluştu');
  }
}
// Profil bilgilerini güncelle
// profile.service.ts
export async function updateProfile(data: Partial<ProfileData>, imageFile?: File) {
  try {
    // FormData oluştur
    const formData = new FormData();
    
    // Temel bilgileri ekle
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.title) formData.append('title', data.title);
    if (data.about) formData.append('about', data.about || '');
    if (data.experience !== undefined) formData.append('experience', String(data.experience));
    
    // Arrays ve objects için JSON string dönüşümü
    if (data.languages) {
      console.log('Languages sending:', data.languages);
      formData.append('languages', JSON.stringify(data.languages));
    }
    
    if (data.regions) {
      console.log('Regions sending:', data.regions);
      formData.append('regions', JSON.stringify(data.regions));
    }
    
    if (data.specialties) {
      console.log('Specialties sending:', data.specialties);
      formData.append('specialties', JSON.stringify(data.specialties));
    }
    
    if (data.social) {
      console.log('Social sending:', data.social);
      formData.append('social', JSON.stringify(data.social));
    }
    
    // Resim dosyası
    if (imageFile) {
      console.log('Resim yükleniyor:', imageFile.name);
      formData.append('image', imageFile);
    }
    
    // FormData debug
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    const response = await api.put('/agents/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(error.response?.data?.message || 'Profil bilgileri güncellenirken bir hata oluştu');
  }
}

// Şifre güncelle
export async function updatePassword(data: PasswordUpdateData) {
  try {
    const response = await api.put('/agents/profile/password', data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating password:', error);
    throw new Error(error.response?.data?.message || 'Şifre güncellenirken bir hata oluştu');
  }
}

const profileService = {
  getProfile,
  updateProfile,
  updatePassword
};

export default profileService;