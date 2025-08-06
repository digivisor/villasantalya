'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  Calendar,
  User,
  Plus,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import PropertyDetailsModal from '../../../components/admin/PropertyDetailModal';
import PropertyEditModal from '../../../components/admin/PropertyEditModal';
import DeleteConfirmationModal from '../../../components/admin/DeleteConfirmationModal';
import StatusChangeModal from '../../../components/admin/StatusChangeModal';
import Toggle from '../../../components/ui/toggle';
import Toast from '../../../components/ui/toast';
import api from '../../../../services/api';

// Tip tanımlamaları
interface Property {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number;
  location?: {
    lat?: string | number;
    lng?: string | number;
  };
  address?: string;
  district?: string;
  city?: string;
  agent: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
  };
  status: string; // 'pending', 'active', 'rejected' gibi
  propertyType: string;
  type?: string; // 'sale' veya 'rent'
  isApproved: boolean;
  mainImage?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  views?: number;
  area?: number;
  bedrooms?: string;
  bathrooms?: number;
  features?: string[] | string;
  nearbyPlaces?: string[] | string;
  slug?: string;
  description?: string;
  currency?: string;
  category?: string;
  buildingAge?: number;
  floor?: number;
  totalFloors?: number;
  furnished?: boolean;
  balcony?: boolean;
  parking?: boolean;
  elevator?: boolean;
  security?: boolean;
  garden?: boolean;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newIsApproved, setNewIsApproved] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    isVisible: false
  });

  const [statsData, setStatsData] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
    sold: 0
  });
  
  const router = useRouter();
  
  // API'den tüm ilanları çek
  useEffect(() => {
    fetchProperties();
  }, []);

  // İlanları API'den çekme fonksiyonu
  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');
      }
      
      const response = await api.get('/properties', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });
      
      if (response.data && response.data.properties) {
        setProperties(response.data.properties);
        
        // İstatistikleri hesapla
        const stats = {
          total: response.data.properties.length,
          active: response.data.properties.filter((p: Property) => p.status === 'active').length,
          pending: response.data.properties.filter((p: Property) => p.status === 'pending').length,
          rejected: response.data.properties.filter((p: Property) => p.status === 'rejected').length,
          sold: response.data.properties.filter((p: Property) => p.status === 'sold').length
        };
        
        setStatsData(stats);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      showToast('İlanlar yüklenirken bir hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filtreleme işlemleri
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.district && property.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (property.city && property.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (property.agent?.name && property.agent.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Modal handlers
  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };
  
  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };
  
  const handleSaveProperty = async (updatedProperty: Property) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');
      }
      
      await api.put(`/properties/${updatedProperty._id}`, updatedProperty, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });
      
      setProperties(properties.map(p => 
        p._id === updatedProperty._id ? updatedProperty : p
      ));
      
      setIsEditModalOpen(false);
      showToast('İlan başarıyla güncellendi.', 'success');
      
      // İlanları yeniden çekmek için (olası yeni değişiklikleri almak için)
      await fetchProperties();
      
    } catch (error) {
      console.error('Error updating property:', error);
      showToast('İlan güncellenirken bir hata oluştu.', 'error');
    }
  };
  
  const confirmDeleteProperty = async () => {
    if (selectedProperty) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');
        }
        
        await api.delete(`/properties/${selectedProperty._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });
        
        setProperties(properties.filter(p => p._id !== selectedProperty._id));
        setIsDeleteModalOpen(false);
        showToast('İlan başarıyla silindi.', 'success');
        
        // İstatistikleri güncelle
        setStatsData({
          ...statsData,
          total: statsData.total - 1,
          active: selectedProperty.status === 'active' ? statsData.active - 1 : statsData.active,
          pending: selectedProperty.status === 'pending' ? statsData.pending - 1 : statsData.pending,
          rejected: selectedProperty.status === 'rejected' ? statsData.rejected - 1 : statsData.rejected,
          sold: selectedProperty.status === 'sold' ? statsData.sold - 1 : statsData.sold
        });
        
      } catch (error) {
        console.error('Error deleting property:', error);
        showToast('İlan silinirken bir hata oluştu.', 'error');
      }
    }
  };
  
  // Durum değiştirme işlevi
  const handleToggleStatus = (property: Property) => {
    setSelectedProperty(property);
    
    // Mevcut duruma göre yeni durum ve onay bilgisi ayarla
    if (property.status === 'active') {
      setNewStatus('pending');
      setNewIsApproved(false);
    } else {
      setNewStatus('active');
      setNewIsApproved(true);
    }
    
    setIsStatusModalOpen(true);
  };
  
  const confirmStatusChange = async () => {
    if (selectedProperty) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Oturum bilginiz bulunamadı. Lütfen tekrar giriş yapın.');
        }
        
        const updatedData = {
          status: newStatus,
          isApproved: newIsApproved
        };
        
        await api.put(`/properties/${selectedProperty._id}`, updatedData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });
        
        setProperties(properties.map(p => 
          p._id === selectedProperty._id 
            ? {
                ...p,
                status: newStatus,
                isApproved: newIsApproved
              }
            : p
        ));
        
        setIsStatusModalOpen(false);
        showToast(
          `İlan başarıyla ${newStatus === 'active' ? 'aktif' : 'pasif'} duruma getirildi.`,
          'success'
        );
        
        // İstatistikleri güncelle
        if (newStatus === 'active' && selectedProperty.status !== 'active') {
          setStatsData({
            ...statsData,
            active: statsData.active + 1,
            pending: selectedProperty.status === 'pending' ? statsData.pending - 1 : statsData.pending,
            rejected: selectedProperty.status === 'rejected' ? statsData.rejected - 1 : statsData.rejected
          });
        } else if (newStatus !== 'active' && selectedProperty.status === 'active') {
          setStatsData({
            ...statsData,
            active: statsData.active - 1,
            pending: newStatus === 'pending' ? statsData.pending + 1 : statsData.pending,
            rejected: newStatus === 'rejected' ? statsData.rejected + 1 : statsData.rejected
          });
        }
        
      } catch (error) {
        console.error('Error changing property status:', error);
        showToast('İlan durumu değiştirilirken bir hata oluştu.', 'error');
      }
    }
  };
  
  // Toast gösterme işlevi
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  // Durum bilgisi için renk belirleme
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Türe göre renk belirleme
  const getTypeColor = (type: string) => {
    return type === 'sale' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  // Durum metinleri
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Beklemede';
      case 'rejected': return 'Reddedildi';
      case 'sold': return 'Satıldı';
      default: return status;
    }
  };

  // Tür metinleri
  const getTypeText = (type: string) => {
    switch (type) {
      case 'sale': return 'Satılık';
      case 'rent': return 'Kiralık';
      default: return type;
    }
  };

  // API URL bilgisi
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Resim URL'sini formatlama
  const formatImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://api.villasantalya.com${imagePath}`;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emlak İlanları</h1>
            <p className="text-gray-600 mt-1">Tüm emlak ilanlarını yönetin</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center" 
              onClick={() => router.push('/admin/dashboard/admin/add-property')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni İlan
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-900">{statsData.total}</div>
            <div className="text-sm text-gray-600">Toplam İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">{statsData.active}</div>
            <div className="text-sm text-gray-600">Aktif İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">{statsData.pending}</div>
            <div className="text-sm text-gray-600">Beklemede</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-red-600">{statsData.rejected}</div>
            <div className="text-sm text-gray-600">Reddedilen</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{statsData.sold}</div>
            <div className="text-sm text-gray-600">Satılan/Kiralanan</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="İlan ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="pending">Beklemede</option>
                  <option value="rejected">Reddedildi</option>
                  <option value="sold">Satıldı</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img
                  src={formatImageUrl(property.mainImage)}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(property.type || 'sale')}`}>
                    {getTypeText(property.type || 'sale')}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                    {getStatusText(property.status)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {property.district && property.city 
                      ? `${property.district}, ${property.city}`
                      : property.address || 'Adres belirtilmedi'}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.agent?.name || 'Danışman belirtilmedi'}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{new Date(property.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-900">
                    {property.discountedPrice 
                      ? <span>
                          <span className="line-through text-gray-500 text-base mr-1">
                            {property.price.toLocaleString()} {property.currency || '₺'}
                          </span>
                          {property.discountedPrice.toLocaleString()} {property.currency || '₺'}
                        </span>
                      : <span>{property.price.toLocaleString()} {property.currency || '₺'}</span>
                    }
                    {property.type === 'rent' && <span className="text-sm text-gray-500">/ay</span>}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewProperty(property)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="İlan detaylarını görüntüle"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditProperty(property)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      aria-label="İlanı düzenle"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProperty(property)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="İlanı sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {property.propertyType} • {property.area} m²
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {property.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                    <Toggle
                      checked={property.status === 'active'}
                      onChange={() => handleToggleStatus(property)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">İlan bulunamadı</h3>
            <p className="text-gray-600">Arama kriterleriyle eşleşen ilan bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <PropertyDetailsModal 
        property={selectedProperty} 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
      />
      
      <PropertyEditModal 
        property={selectedProperty} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProperty}
      />
      
      <DeleteConfirmationModal 
        property={selectedProperty} 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProperty}
      />
      
      <StatusChangeModal
        property={selectedProperty}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmStatusChange}
        newStatus={newStatus === 'active'}
      />
      
      {/* Toast bildirimleri */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </DashboardLayout>
  );
}