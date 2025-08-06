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
  DollarSign,
  Loader
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../../components/ui/toast-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import propertyService from '../../../../services/property.service';

// PropertyType, backend'den dönen property tipine göre tanımlanmıştır
type PropertyType = {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number;
  description: string;
  status: 'active' | 'pending' | 'rejected' | 'sold';
  isApproved: boolean;
  propertyType: string;
  type: 'sale' | 'rent';
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  district: string;
  address: string;
  mainImage: string;
  images: string[];
  agent: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
  slug: string;
  features: string[];
  nearbyPlaces: string[];
  views?: number;
  currency?: string;
};

export default function MyPropertiesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // API URL'si - resimler için
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.includes('/api')
      ? process.env.NEXT_PUBLIC_API_URL.split('/api')[0]
      : process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:5000';
  
  // Resim URL'si formatlama
  const formatImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/placeholder-property.jpg";
    if (imagePath.startsWith('http')) return imagePath;
     return `https://api.villasantalya.com${imagePath}`;
  };

  useEffect(() => {
    // Backend'den danışmanın kendi ilanlarını getir
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const response = await propertyService.getMyProperties();
        
        if (response && response.properties) {
          setProperties(response.properties);
        } else {
          setProperties([]);
        }
      } catch (error: any) {
        console.error('İlanlar yüklenirken hata oluştu:', error);
        toast({
          title: "Hata",
          description: error.message || "İlanlar yüklenemedi.",
          variant: "destructive"
        });
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      property.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewProperty = (slug: string) => {
    // Eğer slug varsa detay sayfasına yönlendir
    if (slug) {
      window.open(`/properties/${slug}`, '_blank');
    }
  };

  const handleEditProperty = (id: string) => {
    router.push(`/admin/dashboard/properties/edit/${id}`);
  };

  const handleDeleteProperty = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProperty = async () => {
    if (deleteId) {
      try {
        await propertyService.deleteProperty(deleteId);
        
        setProperties(properties.filter(p => p._id !== deleteId));
        toast({
          title: "Başarılı",
          description: "İlan başarıyla silindi.",
        });
        
      } catch (error: any) {
        toast({
          title: "Hata",
          description: error.message || "İlan silinirken bir hata oluştu.",
          variant: "destructive"
        });
      } finally {
        setIsDeleteModalOpen(false);
        setDeleteId(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'sold':
        return 'Satıldı';
      case 'pending':
        return 'Onay Bekliyor';
      case 'rejected':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin h-12 w-12 text-orange-500" />
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
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
            <div className="text-2xl font-bold text-green-600">
              {properties.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Aktif İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {properties.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Bekleyen İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">
              {properties.filter(p => p.status === 'sold').length}
            </div>
            <div className="text-sm text-gray-600">Satılan İlan</div>
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="pending">Onay Bekliyor</option>
                <option value="sold">Satıldı</option>
                <option value="rejected">Reddedildi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-48 relative">
                  <Image
                    src={formatImageUrl(property.mainImage)}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                    {getStatusText(property.status)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{property.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.district}, {property.city}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-orange-500">
            
                    <span className="font-semibold">
                      {property.price.toLocaleString()} {property.currency || 'TRY'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.propertyType} • {property.area}m²
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    {property.type === 'sale' ? 'Satılık' : 'Kiralık'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(property.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditProperty(property._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProperty(property._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => handleViewProperty(property.slug)}
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
            href="/admin/dashboard/admin/add-property"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk İlanınızı Ekleyin
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">İlanı Sil</h3>
            <p className="text-gray-600 mb-6">Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                İptal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteProperty}
              >
                Sil
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}