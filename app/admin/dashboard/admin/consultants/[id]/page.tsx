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
  Star
} from 'lucide-react';
import Link from 'next/link';

type Consultant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  propertiesCount: number;
  totalViews: number;
  joinDate: string;
  status: string;
  avatar: null;
  bio: string;
  totalSales: number;
  averageRating: number;
  totalComments: number;
};

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
};

export default function ConsultantProfilePage() {
  const params = useParams();
  const router = useRouter();
  const consultantId = parseInt(params.id as string);
  
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockConsultant: Consultant = {
        id: consultantId,
        name: 'Ahmet Yılmaz',
        email: 'ahmet@emlak.com',
        phone: '+90 555 234 5678',
        propertiesCount: 12,
        totalViews: 2456,
        joinDate: '2024-01-16',
        status: 'Aktif',
        avatar: null,
        bio: 'Emlak sektöründe 8 yıllık deneyime sahip uzman danışman. Özellikle İstanbul Anadolu yakasında konut projeleri konusunda uzmanlaşmıştır.',
        totalSales: 15,
        averageRating: 4.8,
        totalComments: 28
      };

      const mockProperties: Property[] = [
        {
          id: 1,
          title: 'Modern 3+1 Daire Kadıköy',
          price: 2500000,
          location: 'Kadıköy, İstanbul',
          status: 'Aktif',
          views: 245,
          createdAt: '2024-01-20',
          type: 'Daire',
          area: 120
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
          area: 250
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
          area: 85
        }
      ];

      setConsultant(mockConsultant);
      setProperties(mockProperties);
      setIsLoading(false);
    }, 1000);
  }, [consultantId]);

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

  if (!consultant) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Danışman bulunamadı</h3>
          <Link
            href="/admin/dashboard/admin/consultants"
            className="text-blue-600 hover:text-blue-700"
          >
            Danışmanlar listesine dön
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
            <button className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </button>
            <button className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start space-x-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-3xl font-semibold text-white">
                {consultant.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{consultant.name}</h2>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(consultant.status)}`}>
                  {consultant.status}
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
                  <span>{new Date(consultant.joinDate).toLocaleDateString('tr-TR')} tarihinde katıldı</span>
                </div>
              </div>
              {consultant.bio && (
                <p className="text-gray-700">{consultant.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam İlan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{consultant.propertiesCount}</p>
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
                <p className="text-2xl font-bold text-gray-900 mt-1">{consultant.totalViews.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Satış</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{consultant.totalSales}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
                <div className="flex items-center mt-1">
                  <p className="text-2xl font-bold text-gray-900 mr-2">{consultant.averageRating}</p>
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
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
                { id: 'properties', label: 'İlanlar' },
                { id: 'performance', label: 'Performans' }
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Yeni ilan ekledi</p>
                          <p className="text-xs text-gray-500">Modern 3+1 Daire - 2 saat önce</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">İlan satışı tamamlandı</p>
                          <p className="text-xs text-gray-500">Ofis Alanı Şişli - 1 gün önce</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
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
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">
                          {new Date(consultant.joinDate).toLocaleDateString('tr-TR')} tarihinde katıldı
                        </span>
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
                
                <div className="overflow-hidden">
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
                        <tr key={property.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{property.title}</div>
                              <div className="text-sm text-gray-500">{property.type} • {property.area}m²</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₺{property.price.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {property.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                              {property.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <Eye className="h-4 w-4 mr-1" />
                              {property.views}
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
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <TrendingUp className="h-8 w-8 mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Aylık Performans</h3>
                    <p className="text-blue-100 text-sm mb-4">Bu ay {consultant.propertiesCount - 8} yeni ilan eklendi</p>
                    <div className="text-2xl font-bold">+15%</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <Award className="h-8 w-8 mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Satış Başarısı</h3>
                    <p className="text-green-100 text-sm mb-4">Bu ay {consultant.totalSales - 12} satış gerçekleşti</p>
                    <div className="text-2xl font-bold">%80</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <Star className="h-8 w-8 mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Müşteri Memnuniyeti</h3>
                    <p className="text-purple-100 text-sm mb-4">{consultant.totalComments} değerlendirme</p>
                    <div className="text-2xl font-bold">{consultant.averageRating}/5</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}