'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  MapPin,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Toast from '../../../components/ui/toast';
import PropertyApprovalModal from '../../../components/admin/PropertyApprovalModal';
import PropertyRejectModal from '../../../components/admin/PropertyRejectModal';
import PropertyDetailsModal from '../../../components/admin/PropertyDetailModal';
import { Property } from '../../../types/property';
import api from '../../../../services/api';
import propertyService from '../../../../services/property.service';

// Pending Property type (eğer farklı alanlar gerekiyorsa)
interface PendingProperty extends Property {
  submittedAt?: string;
  notes?: string;
}

export default function PendingPropertiesPage() {
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConsultant, setFilterConsultant] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [consultants, setConsultants] = useState<{id: string, name: string}[]>([]);
  
  // Modal states
  const [selectedProperty, setSelectedProperty] = useState<PendingProperty | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    isVisible: false
  });
  
  const router = useRouter();
  
  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    setIsLoading(true);
    try {
      const data = await propertyService.getPendingProperties();
      
      if (data && data.properties) {
        setPendingProperties(data.properties);
        
        // Danışmanları topla
        const uniqueAgents = Array.from(
          new Map(
            data.properties.map((p: { agent: { _id: any; name: any; }; }) => p.agent ? [p.agent._id, {id: p.agent._id, name: p.agent.name}] : ['unknown', {id: 'unknown', name: 'Bilinmeyen'}])
          ).values()
        );
        
        setConsultants(uniqueAgents as {id: string, name: string}[]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching pending properties:', error);
      showToast('Bekleyen ilanlar yüklenirken bir hata oluştu.', 'error');
      setIsLoading(false);
      
      // Hata durumunda boş array ile devam et
      setPendingProperties([]);
      setConsultants([]);
    }
  };
  
  // Onaylama işlemi
  const confirmApproveProperty = async () => {
    if (selectedProperty) {
      try {
        await propertyService.approveProperty(selectedProperty._id);
        
        setPendingProperties(pendingProperties.filter(p => p._id !== selectedProperty._id));
        setIsApproveModalOpen(false);
        showToast('İlan başarıyla onaylandı ve yayınlandı.', 'success');
      } catch (error) {
        console.error('Error approving property:', error);
        showToast('İlan onaylanırken bir hata oluştu.', 'error');
      }
    }
  };
  
  // Reddetme işlemi
  const confirmRejectProperty = async (reason: string) => {
    if (selectedProperty) {
      try {
        await propertyService.rejectProperty(selectedProperty._id, reason);
        
        setPendingProperties(pendingProperties.filter(p => p._id !== selectedProperty._id));
        setIsRejectModalOpen(false);
        showToast('İlan reddedildi ve danışmana bildirildi.', 'info');
      } catch (error) {
        console.error('Error rejecting property:', error);
        showToast('İlan reddedilirken bir hata oluştu.', 'error');
      }
    }
  };
  

  // Filtreleme
  const filteredProperties = pendingProperties.filter(property => {
    const matchesSearch = 
      (property.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (property.district && property.city && 
        `${property.district}, ${property.city}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesConsultant = 
      filterConsultant === 'all' || 
      (property.agent && property.agent._id === filterConsultant);
    
    return matchesSearch && matchesConsultant;
  });

  // Modal handlers
  const handleViewProperty = (property: PendingProperty) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };
  
  const handleApproveProperty = (property: PendingProperty) => {
    setSelectedProperty(property);
    setIsApproveModalOpen(true);
  };
  
  const handleRejectProperty = (property: PendingProperty) => {
    setSelectedProperty(property);
    setIsRejectModalOpen(true);
  };
  
  // Onaylama işlemi
  
  
  // Toast gösterme işlevi
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  // API URL'si
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  // Resim URL'sini formatlama
  const formatImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiBaseUrl.replace('/api', '')}${imagePath}`;
  };

  // İlanın incelemede olduğu süreyi hesaplama
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "Bilinmiyor";
    
    const now = new Date();
    const submittedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - submittedDate.getTime()) / (1000 * 60));
      return `${diffInMinutes} dakika önce`;
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} gün önce`;
    }
  };

  // Para birimi ile fiyat formatla
  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return "Belirtilmemiş";
    return `${price.toLocaleString()} ${currency || '₺'}`;
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Onay Bekleyen İlanlar</h1>
            <p className="text-gray-600 mt-1">Danışmanlardan gelen ilanları inceleyip onaylayın veya reddedin</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{pendingProperties.length}</div>
            <div className="text-sm text-gray-600">İnceleme Bekleyen İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">{consultants.length}</div>
            <div className="text-sm text-gray-600">Danışman Sayısı</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">
              {pendingProperties.filter(p => 
                p.createdAt && new Date(p.createdAt).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-sm text-gray-600">Bugün Gelen İlan</div>
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
                  value={filterConsultant}
                  onChange={(e) => setFilterConsultant(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tüm Danışmanlar</option>
                  {consultants.map((consultant, index) => (
                    <option key={consultant.id} value={consultant.id}>{consultant.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row">
                {/* İlan Görseli */}
                <div className="md:w-64 h-48 md:h-auto">
                  <img
                    src={formatImageUrl(property.mainImage)}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* İlan İçeriği */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {property.district && property.city 
                            ? `${property.district}, ${property.city}`
                            : property.address || 'Konum belirtilmedi'}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                          {property.status === 'sale' ? 'Satılık' : 'Kiralık'}
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(property.price, property.currency)}
                          {property.status === 'rent' && <span className="text-sm text-gray-500">/ay</span>}
                        </span>
                      </div>
                      
                      <div className="flex items-start space-x-3 mb-4">
                        {property.agent && (
                          <>
                            <img 
                              src={formatImageUrl(property.agent.image)}
                              alt={property.agent.name} 
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium">{property.agent.name}</p>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {getTimeAgo(property.createdAt)} gönderildi
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Özellikler */}
                    <div className="mt-4 md:mt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.propertyType && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {property.propertyType}
                          </span>
                        )}
                        {property.area && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {property.area} m²
                          </span>
                        )}
                        {property.bedrooms && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {property.bedrooms}
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {property.bathrooms} Banyo
                          </span>
                        )}
                        {/* Diğer özellikler, örn. furnished, balcony, vs. */}
                        {property.furnished && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            Eşyalı
                          </span>
                        )}
                        {property.balcony && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            Balkon
                          </span>
                        )}
                        {property.parking && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            Otopark
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Butonlar */}
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => handleViewProperty(property)}
                      className="px-3 py-2 flex items-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detayları Gör
                    </button>
                    <button
                      onClick={() => handleRejectProperty(property)}
                      className="px-3 py-2 flex items-center text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-sm"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reddet
                    </button>
                    <button
                      onClick={() => handleApproveProperty(property)}
                      className="px-3 py-2 flex items-center text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Onayla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredProperties.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">İnceleme bekleyen ilan bulunamadı</h3>
              <p className="text-gray-600">Şu anda incelemeniz gereken ilan bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PropertyDetailsModal 
        property={selectedProperty as any} 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
      />
      
      <PropertyApprovalModal 
        property={selectedProperty} 
        isOpen={isApproveModalOpen} 
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={confirmApproveProperty}
      />
      
      <PropertyRejectModal 
        property={selectedProperty} 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={confirmRejectProperty}
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