'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { 
  ArrowLeft,
  User, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  Eye,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  MessageSquare,
  TrendingUp,
  Award,
  Star,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../../../components/ui/toast-context';
import userService, { Consultant } from '../../../../../services/user.service';
import Image from 'next/image';

// Özellik tipi tanımı
interface Property {
  _id: string;
  title: string;
  price: string;
  discountedPrice?: string;
  location?: {
    lat: string;
    lng: string;
  };
  address: string;
  district: string;
  city: string;
  status: string;
  type: string;
  propertyType: string;
  category: string;
  area: number;
  bedrooms: string;
  bathrooms: number;
  mainImage: string;
  images: string[];
  features: string[];
  nearbyPlaces: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  agent: string;
  views: number;
}

export default function ConsultantProfilePage() {
  const params = useParams();
  const router = useRouter();
  const consultantId = params.id as string;
  const { toast } = useToast();
  
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // API URL'si
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.includes('/api')
      ? process.env.NEXT_PUBLIC_API_URL.split('/api')[0]
      : process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:5000';

  // Resim URL'si formatlama
  const formatImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/placeholder-agent.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiBaseUrl}${imagePath}`;
  };

  useEffect(() => {
    async function fetchConsultantData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Danışman bilgilerini getir
        const consultantData = await userService.getConsultantById(consultantId);
        setConsultant(consultantData.agent);
        
        // Danışmanın ilanlarını getir
        const propertiesData = await userService.getConsultantProperties(consultantId);
        setProperties(propertiesData.properties || []);
        
      } catch (error: any) {
        console.error('Error fetching consultant details:', error);
        setError(error.message || 'Danışman bilgileri yüklenirken bir hata oluştu');
        toast({
          title: "Hata!",
          description: error.message || 'Danışman bilgileri yüklenirken bir hata oluştu',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    if (consultantId) {
      fetchConsultantData();
    }
  }, [consultantId, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'aktif':
        return 'bg-green-100 text-green-800';
      case 'sold':
      case 'satıldı':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'beklemede':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'pasif':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Durum metnini Türkçeleştir
  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'Aktif';
      case 'sold': return 'Satıldı';
      case 'pending': return 'Beklemede';
      case 'inactive': return 'Pasif';
      case 'rejected': return 'Reddedildi';
      default: return status;
    }
  };

  // İlan türünü Türkçeleştir
  const translatePropertyType = (type: string) => {
    return type === 'sale' ? 'Satılık' : type === 'rent' ? 'Kiralık' : type;
  };
  
  // Fiyat formatlama
  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return price.toLocaleString('tr-TR') + ' ₺';
    }
    return parseFloat(price).toLocaleString('tr-TR') + ' ₺';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin rounded-full h-12 w-12 text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !consultant) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Danışman bulunamadı'}
          </h2>
          <Link
            href="/admin/dashboard/admin/consultants"
            className="px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg mt-4"
          >
            Danışmanlar Listesine Dön
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/dashboard/admin/consultants"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Danışman Profili</h1>
              <p className="text-gray-600 mt-1">Danışman detayları ve performans bilgileri</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/admin/dashboard/admin/consultants/edit/${consultant._id}`}
              className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Link>
            <button 
              onClick={() => {
                if (window.confirm('Bu danışmanı silmek istediğinize emin misiniz?')) {
                  userService.deleteConsultant(consultant._id)
                    .then(() => {
                      toast({
                        title: "Başarılı!",
                        description: "Danışman başarıyla silindi.",
                        variant: "success",
                      });
                      router.push('/admin/dashboard/admin/consultants');
                    })
                    .catch(error => {
                      toast({
                        title: "Hata!",
                        description: error.message || "Danışman silinirken bir hata oluştu.",
                        variant: "destructive",
                      });
                    });
                }
              }}
              className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start space-x-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
              {consultant.image ? (
                <img 
                  src={formatImageUrl(consultant.image)} 
                  alt={consultant.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-white">
                  {consultant.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{consultant.name}</h2>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(consultant.isActive ? 'active' : 'inactive')}`}>
                  {consultant.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{consultant.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{consultant.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(consultant.createdAt).toLocaleDateString('tr-TR')} tarihinde katıldı</span>
                </div>
              </div>
              {consultant.about && (
                <p className="text-gray-700">{consultant.about}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam İlan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{properties.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Görüntüleme</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {properties.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif İlanlar</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {properties.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Genel Bakış' },
                { id: 'properties', label: 'İlanlar' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Danışman Bilgileri</h3>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">{consultant.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">{consultant.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">{consultant.username}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">
                            {new Date(consultant.createdAt).toLocaleDateString('tr-TR')} tarihinde katıldı
                          </span>
                        </div>
                      </div>
                      
                      {consultant.title && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="font-medium text-gray-700">Ünvan</p>
                          <p className="text-gray-600">{consultant.title}</p>
                        </div>
                      )}
                      
                      {consultant.about && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="font-medium text-gray-700">Hakkında</p>
                          <p className="text-gray-600">{consultant.about}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">İlan Dağılımı</p>
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Aktif</span>
                            <span className="font-semibold text-green-600">
                              {properties.filter(p => p.status === 'active').length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Beklemede</span>
                            <span className="font-semibold text-yellow-600">
                              {properties.filter(p => p.status === 'pending').length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Satıldı/Kiralandı</span>
                            <span className="font-semibold text-blue-600">
                              {properties.filter(p => ['sold', 'rented'].includes(p.status)).length}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Emlak Türleri</p>
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Konut</span>
                            <span className="font-semibold">
                              {properties.filter(p => p.category === 'Konut').length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">İşyeri</span>
                            <span className="font-semibold">
                              {properties.filter(p => p.category === 'İşyeri').length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Arsa</span>
                            <span className="font-semibold">
                              {properties.filter(p => p.category === 'Arsa').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">İlanlar ({properties.length})</h3>
                </div>
                
                {properties.length === 0 ? (
                  <div className="text-center py-10">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Henüz ilan bulunamadı</h3>
                    <p className="text-gray-500">Bu danışmanın hiç ilanı bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İlan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fiyat
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Konum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Görüntüleme
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {properties.map((property) => (
                          <tr key={property._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden">
                                  {property.mainImage ? (
                                    <img
                                      src={formatImageUrl(property.mainImage)}
                                      alt={property.title}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Building2 className="h-full w-full p-2 text-gray-500" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{property.title}</div>
                                  <div className="text-sm text-gray-500">
                                    {property.propertyType} • {property.area}m²
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatPrice(property.price)}</div>
                              {property.discountedPrice && (
                                <div className="text-xs text-red-500 line-through">
                                  {formatPrice(property.discountedPrice)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                {property.district}, {property.city}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                                {translateStatus(property.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500">
                                <Eye className="h-4 w-4 mr-1" />
                                {property.views || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(property.createdAt).toLocaleDateString('tr-TR')}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}