import api from './api';

// Danışman tipi tanımı (backend model yapısına uygun)
export interface Consultant {
  _id: string;
  username: string;
  email: string;
  name: string;
  title: string;
  phone: string;
  image: string;
  about: string;
  company?: {
    _id: string;
    name: string;
  };
  rating: number;
  experience: number;
  languages: string[];
  regions: string[];
  specialties: string[];
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form verileri için tip tanımı
export interface ConsultantFormData {
  username: string;
  email: string;
  password?: string; // Güncelleme durumunda opsiyonel
  name: string;
  title: string;
  phone: string;
  about?: string;
  company?: string;
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
}

// Sayfalama tipi
export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

// Danışman listesi yanıt tipi
export interface ConsultantsResponse {
  consultants: any;
  agents: Consultant[];
  pagination: Pagination;
}

// Tüm danışmanları getir
export async function getAllConsultants(page = 1, limit = 10, sort = 'name',isActive?: boolean) {
  try {
    const response = await api.get(`/agents?page=${page}&limit=${limit}&sort=${sort}` + (isActive ? `&isActive=${isActive}` : ''));
    return response.data as ConsultantsResponse;
  } catch (error: any) {
    console.error('Error fetching consultants:', error);
    throw new Error(error.response?.data?.message || 'Danışmanlar getirilemedi');
  }
}

// Danışman detayını ID'ye göre getir
export async function getConsultantById(id: string) {
  try {
    const response = await api.get(`/agents/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching consultant ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Danışman bilgileri getirilemedi');
  }
}

// userService.ts içindeki createConsultant fonksiyonunu değiştirin
export async function createConsultant(data: ConsultantFormData, imageFile?: File) {
  try {
    // FormData yerine JSON verisi oluştur
    const jsonData = {
      username: data.username,
      email: data.email,
      password: data.password || '',
      name: data.name,
      phone: data.phone || '',
      title: data.title || 'Emlak Danışmanı',
      about: data.about || '',
      isAdmin: data.isAdmin === true,
      isActive: true
    };
    
    console.log("Gönderilecek JSON veri:", jsonData);
    
    // JSON verisiyle POST isteği yap
    const response = await api.post('/agents/register', jsonData);
    
    // Eğer resim varsa ve kayıt başarılıysa, ayrı bir istek gönder
    if (imageFile && response.data.agent && response.data.agent.id) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      await api.put(`/agents/${response.data.agent.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error creating consultant:', error);
    throw new Error(error.response?.data?.message || 'Danışman oluşturulamadı');
  }
}
// Danışman bilgilerini güncelle
export async function updateConsultant(id: string, data: Partial<ConsultantFormData>, imageFile?: File) {
  try {
    // FormData oluştur
    const formData = new FormData();
    
    // JSON verileri ekle
    Object.keys(data).forEach(key => {
      if (key === 'languages' || key === 'regions' || key === 'specialties' || key === 'social') {
        formData.append(key, JSON.stringify(data[key as keyof ConsultantFormData]));
      } else {
        if (data[key as keyof ConsultantFormData] !== undefined) {
          formData.append(key, String(data[key as keyof ConsultantFormData]));
        }
      }
    });
    
    // Resim ekle
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await api.put(`/agents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error(`Error updating consultant ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Danışman güncellenemedi');
  }
}

// Danışmanı sil (deaktif et)
export async function deleteConsultant(id: string) {
  try {
    const response = await api.delete(`/agents/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting consultant ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Danışman silinemedi');
  }
}

// Danışmanın ilanlarını getir
export async function getConsultantProperties(id: string, page = 1, limit = 10, sort = '-createdAt') {
  try {
    const response = await api.get(`/agents/${id}/properties?page=${page}&limit=${limit}&sort=${sort}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching consultant ${id} properties:`, error);
    throw new Error(error.response?.data?.message || 'Danışmanın ilanları getirilemedi');
  }
}

// Öne çıkan danışmanları getir
export async function getFeaturedConsultants() {
  try {
    const response = await api.get('/agents/featured');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching featured consultants:', error);
    throw new Error(error.response?.data?.message || 'Öne çıkan danışmanlar getirilemedi');
  }
}

// Service nesnesini export et
const userService = {
  getAllConsultants,
  getConsultantById,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  getConsultantProperties,
  getFeaturedConsultants
};

export default userService;