'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Building2, 
  Search, 
  Plus,
  Edit, 
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Filter,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import PropertyDetailsModal from '../../../components/admin/PropertyDetailModal';
import DeleteConfirmationModal from '../../../components/admin/DeleteConfirmationModal';
import PropertyEditModal from '../../../components/admin/PropertyEditModal';
import Toast from '../../../components/ui/toast';
import { useRouter } from 'next/navigation';

type Property = {
  id: number;
  title: string;
  price: number;
  location: string;
  status: string;
  views: number;
  createdAt: string;
  type: string;
  area: number;
  image: string;
  consultant: string; // Özellik detayları modalı için eklendi
};

export default function MyPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    isVisible: false
  });

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setProperties([
        {
          id: 1,
          title: 'Modern 3+1 Daire Kadıköy',
          price: 2500000,
          location: 'Kadıköy, İstanbul',
          status: 'Aktif',
          views: 245,
          createdAt: '2024-01-20',
          type: 'Daire',
          area: 120,
          image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600',
          consultant: 'Fazıl Can Akbaş'
        },
        {
          id: 2,
          title: 'Lüks Villa Beşiktaş',
          price: 8500000,
          location: 'Beşiktaş, İstanbul',
          status: 'Aktif',
          views: 189,
          createdAt: '2024-01-18',
          type: 'Villa',
          area: 250,
          image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
          consultant: 'Fazıl Can Akbaş'
        },
        {
          id: 3,
          title: 'Ofis Alanı Şişli',
          price: 3200000,
          location: 'Şişli, İstanbul',
          status: 'Satıldı',
          views: 67,
          createdAt: '2024-01-15',
          type: 'Ofis',
          area: 85,
          image: 'https://images.pexels.com/photos/273209/pexels-photo-273209.jpeg?auto=compress&cs=tinysrgb&w=600',
          consultant: 'Fazıl Can Akbaş'
        },
        {
          id: 4,
          title: '2+1 Daire Üsküdar',
          price: 1800000,
          location: 'Üsküdar, İstanbul',
          status: 'Beklemede',
          views: 123,
          createdAt: '2024-01-12',
          type: 'Daire',
          area: 90,
          image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
          consultant: 'Fazıl Can Akbaş'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         property.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
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

  const handleSaveProperty = (updatedProperty: any) => {
    setProperties(properties.map(p => 
      p.id === updatedProperty.id ? {...p, ...updatedProperty} : p
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
      case 'satıldı':
        return 'bg-blue-100 text-blue-800';
      case 'beklemede':
        return 'bg-yellow-100 text-yellow-800';
      case 'pasif':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900">İlanlarım</h1>
            <p className="text-gray-600 mt-1">Emlak ilanlarınızı yönetin</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              href="/admin/dashboard/admin/add-property"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni İlan
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-900">{properties.length}</div>
            <div className="text-sm text-gray-600">Toplam İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">{properties.filter(p => p.status === 'Aktif').length}</div>
            <div className="text-sm text-gray-600">Aktif İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{properties.filter(p => p.status === 'Satıldı').length}</div>
            <div className="text-sm text-gray-600">Satılan İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-purple-600">{properties.reduce((sum, p) => sum + p.views, 0)}</div>
            <div className="text-sm text-gray-600">Toplam Görüntüleme</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
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
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="aktif">Aktif</option>
                <option value="beklemede">Beklemede</option>
                <option value="satıldı">Satıldı</option>
                <option value="pasif">Pasif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                    {property.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-blue-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-semibold">₺{property.price.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.type} • {property.area}m²
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{property.views} görüntüleme</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(property.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditProperty(property)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProperty(property)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => handleViewProperty(property)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detayları Gör
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">İlan bulunamadı</h3>
            <p className="text-gray-600 mb-4">Arama kriterleriyle eşleşen ilan bulunamadı.</p>
            <Link
              href="/admin/dashboard/consultant/add-property"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk İlanınızı Ekleyin
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      <PropertyDetailsModal 
        property={selectedProperty as any} 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
      />

      <PropertyEditModal
        property={selectedProperty as any}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProperty}
      />
      
      <DeleteConfirmationModal 
        property={selectedProperty as any}
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProperty}
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