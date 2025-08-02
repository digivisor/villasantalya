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
import { PendingProperty } from '../../../types/property';

export default function PendingPropertiesPage() {
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConsultant, setFilterConsultant] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [consultants, setConsultants] = useState<string[]>([]);
  
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
    // Mock data loading
    setIsLoading(true);
    setTimeout(() => {
      const mockData: PendingProperty[] = [
        {
          id: 101,
          title: 'Deniz Manzaralı 2+1 Daire',
          price: 1850000,
          location: 'Konyaaltı, Antalya',
          consultant: 'Mehmet Aydın',
          consultantAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          status: 'İncelemede',
          type: 'Satılık',
          submittedAt: '2025-08-01T08:30:00Z',
          image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
          description: 'Konyaaltı sahilinde deniz manzaralı, yeni yapılmış lüks daire. Site içerisinde, havuzlu, spor salonlu ve güvenlikli.',
          features: ['2+1', '110m²', 'Deniz Manzaralı', 'Havuzlu', 'Güvenlikli'],
          notes: 'Danışman, müşterinin hızlı satış istediğini belirtti.'
        },
        {
          id: 102,
          title: 'Merkezi Konumda 3+1 Daire',
          price: 2250000,
          location: 'Muratpaşa, Antalya',
          consultant: 'Ayşe Demir',
          consultantAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          status: 'İncelemede',
          type: 'Satılık',
          submittedAt: '2025-07-31T15:45:00Z',
          image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
          description: 'Şehir merkezinde, toplu taşımaya yakın, yeni yapılmış 3+1 daire. Okullara, hastanelere ve alışveriş merkezlerine yürüme mesafesinde.',
          features: ['3+1', '145m²', 'Merkezi Konum', 'Asansörlü', 'Otoparklı'],
          notes: ''
        },
        {
          id: 103,
          title: 'Lüks Villa Lara',
          price: 5500000,
          location: 'Lara, Antalya',
          consultant: 'Ali Yıldız',
          consultantAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          status: 'İncelemede',
          type: 'Satılık',
          submittedAt: '2025-07-30T11:20:00Z',
          image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
          description: 'Lara bölgesinde müstakil bahçeli, özel havuzlu, 4+1 lüks villa. Denize 1km mesafede, tam donanımlı.',
          features: ['4+1', '250m²', 'Müstakil', 'Özel Havuz', '500m² Bahçe'],
          notes: 'Müşteri taksit imkanı sunuyor.'
        },
        {
          id: 104,
          title: 'Yatırımlık 1+1 Daire',
          price: 890000,
          location: 'Kepez, Antalya',
          consultant: 'Mehmet Aydın',
          consultantAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          status: 'İncelemede',
          type: 'Satılık',
          submittedAt: '2025-07-29T09:15:00Z',
          image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
          description: 'Üniversiteye yakın konumda, yatırım amaçlı ideal 1+1 daire. Yeni yapılmış, eşyalı olarak satılıktır.',
          features: ['1+1', '55m²', 'Eşyalı', 'Üniversiteye Yakın'],
          notes: 'Kiracı mevcut, aylık 3500₺ kira getirisi var.'
        },
        {
          id: 105,
          title: 'Kiralık Ofis Merkez',
          price: 8500,
          location: 'Muratpaşa, Antalya',
          consultant: 'Ayşe Demir',
          consultantAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          status: 'İncelemede',
          type: 'Kiralık',
          submittedAt: '2025-07-28T14:30:00Z',
          image: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
          description: 'Şehir merkezinde, iş hanında 120m² ofis. Asansörlü binada, otoparklı, güvenlikli.',
          features: ['120m²', 'Asansörlü', 'Güvenlikli', 'Otoparklı'],
          notes: 'Minimum 2 yıl kira sözleşmesi istiyor.'
        }
      ];

      // Danışmanları çıkar
      const uniqueConsultants = Array.from(new Set(mockData.map(p => p.consultant)));
      setConsultants(uniqueConsultants);
      
      setPendingProperties(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredProperties = pendingProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesConsultant = filterConsultant === 'all' || 
                             property.consultant === filterConsultant;
    
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
  
  const confirmApproveProperty = () => {
    if (selectedProperty) {
      // Gerçek uygulamada burada API çağrısı yapılacaktır
      setPendingProperties(pendingProperties.filter(p => p.id !== selectedProperty.id));
      setIsApproveModalOpen(false);
      showToast('İlan başarıyla onaylandı ve yayınlandı.', 'success');
    }
  };
  
  const confirmRejectProperty = (reason: string) => {
    if (selectedProperty) {
      // Gerçek uygulamada burada API çağrısı yapılacaktır
      setPendingProperties(pendingProperties.filter(p => p.id !== selectedProperty.id));
      setIsRejectModalOpen(false);
      showToast('İlan reddedildi ve danışmana bildirildi.', 'info');
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

  // İlanın incelemede olduğu süreyi hesaplama
  const getTimeAgo = (dateString: string) => {
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
              {pendingProperties.filter(p => new Date(p.submittedAt).toDateString() === new Date().toDateString()).length}
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
                    <option key={index} value={consultant}>{consultant}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row">
                {/* İlan Görseli */}
                <div className="md:w-64 h-48 md:h-auto">
                  <img
                    src={property.image}
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
                        <span className="text-sm">{property.location}</span>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                          {property.type}
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          ₺{property.price.toLocaleString()}
                          {property.type === 'Kiralık' && <span className="text-sm text-gray-500">/ay</span>}
                        </span>
                      </div>
                      
                      <div className="flex items-start space-x-3 mb-4">
                        <img 
                          src={property.consultantAvatar} 
                          alt={property.consultant} 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium">{property.consultant}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {getTimeAgo(property.submittedAt)} gönderildi
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Özellikler */}
                    <div className="mt-4 md:mt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.features.map((feature, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
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