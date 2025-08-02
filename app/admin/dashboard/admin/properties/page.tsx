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
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import PropertyDetailsModal from '../../../components/admin/PropertyDetailModal';
import PropertyEditModal from '../../../components/admin/PropertyEditModal';
import DeleteConfirmationModal from '../../../components/admin/DeleteConfirmationModal';
import StatusChangeModal from '../../../components/admin/StatusChangeModal';
import Toggle from '../../../components/ui/toggle';
import Toast from '../../../components/ui/toast';
import { Property } from '../../../types/property';

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
  const [newStatus, setNewStatus] = useState(false);
  
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
  }, []);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setProperties([
        {
          id: 1,
          title: 'Modern 3+1 Daire Kadıköy',
          price: 2500000,
          location: 'Kadıköy, İstanbul',
          consultant: 'Ahmet Yılmaz',
          status: 'Aktif',
          type: 'Satılık',
          views: 245,
          createdAt: '2024-01-18',
          image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
          isActive: true
        },
        {
          id: 2,
          title: 'Lüks Villa Beşiktaş',
          price: 8500000,
          location: 'Beşiktaş, İstanbul',
          consultant: 'Ayşe Kaya',
          status: 'Aktif',
          type: 'Satılık',
          views: 189,
          createdAt: '2024-01-19',
          image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
          isActive: true
        },
        {
          id: 3,
          title: '2+1 Kiralık Ofis Levent',
          price: 12000,
          location: 'Levent, İstanbul',
          consultant: 'Mehmet Öz',
          status: 'Beklemede',
          type: 'Kiralık',
          views: 67,
          createdAt: '2024-01-20',
          image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
          isActive: false
        },
        {
          id: 4,
          title: 'Ticari Alan Taksim',
          price: 5200000,
          location: 'Taksim, İstanbul',
          consultant: 'Ahmet Yılmaz',
          status: 'Satıldı',
          type: 'Satılık',
          views: 423,
          createdAt: '2024-01-10',
          image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
          isActive: false
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.consultant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         property.status.toLowerCase() === filterStatus.toLowerCase();
    
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
  
  const handleSaveProperty = (updatedProperty: Property) => {
    setProperties(properties.map(p => 
      p.id === updatedProperty.id ? updatedProperty : p
    ));
    setIsEditModalOpen(false);
    showToast('İlan başarıyla güncellendi.', 'success');
  };
  
  const confirmDeleteProperty = () => {
    if (selectedProperty) {
      setProperties(properties.filter(p => p.id !== selectedProperty.id));
      setIsDeleteModalOpen(false);
      showToast('İlan başarıyla silindi.', 'success');
    }
  };
  
  // Durum değiştirme işlevi
  const handleToggleStatus = (property: Property) => {
    setSelectedProperty(property);
    setNewStatus(!property.isActive);
    setIsStatusModalOpen(true);
  };
  
  const confirmStatusChange = () => {
    if (selectedProperty) {
      setProperties(properties.map(p => 
        p.id === selectedProperty.id 
          ? {
              ...p,
              isActive: newStatus,
              status: newStatus ? 'Aktif' : 'Beklemede'
            }
          : p
      ));
      setIsStatusModalOpen(false);
      showToast(
        `İlan başarıyla ${newStatus ? 'aktif' : 'pasif'} duruma getirildi.`,
        'success'
      );
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'bg-green-100 text-green-800';
      case 'beklemede':
        return 'bg-yellow-100 text-yellow-800';
      case 'satıldı':
        return 'bg-red-100 text-red-800';
      case 'kiralandı':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Satılık' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center" onClick={() => router.push('/admin/dashboard/admin/add-property')}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni İlan
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-900">{properties.length}</div>
            <div className="text-sm text-gray-600">Toplam İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">{properties.filter(p => p.isActive).length}</div>
            <div className="text-sm text-gray-600">Aktif İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">{properties.filter(p => !p.isActive).length}</div>
            <div className="text-sm text-gray-600">Pasif İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-red-600">{properties.filter(p => p.status === 'Satıldı').length}</div>
            <div className="text-sm text-gray-600">Satılan İlan</div>
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
                  <option value="aktif">Aktif</option>
                  <option value="beklemede">Beklemede</option>
                  <option value="satıldı">Satıldı</option>
                  <option value="kiralandı">Kiralandı</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(property.type)}`}>
                    {property.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                    {property.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.consultant}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.views} görüntüleme</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-900">
                    ₺{property.price.toLocaleString()}
                    {property.type === 'Kiralık' && <span className="text-sm text-gray-500">/ay</span>}
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
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(property.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {property.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                    <Toggle
                      checked={property.isActive}
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
        newStatus={newStatus}
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