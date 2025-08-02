'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Building2, 
  Eye, 
  Plus,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

export default function ConsultantDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myProperties: 0,
    totalViews: 0,
    activeDays: 0,
    potentialRevenue: 0
  });

  useEffect(() => {
    // Mock data loading
    setStats({
      myProperties: 8,
      totalViews: 1240,
      activeDays: 45,
      potentialRevenue: 125000
    });
  }, []);

  const myProperties = [
    {
      id: 1,
      title: 'Modern 3+1 Daire Kadıköy',
      price: 2500000,
      location: 'Kadıköy, İstanbul',
      status: 'Aktif',
      views: 245,
      createdAt: '2024-01-18',
      type: 'Satılık'
    },
    {
      id: 2,
      title: '2+1 Kiralık Ofis Levent',
      price: 12000,
      location: 'Levent, İstanbul',
      status: 'Aktif',
      views: 189,
      createdAt: '2024-01-15',
      type: 'Kiralık'
    },
    {
      id: 3,
      title: 'Studio Daire Bağdat Caddesi',
      price: 1800000,
      location: 'Kadıköy, İstanbul',
      status: 'Beklemede',
      views: 67,
      createdAt: '2024-01-20',
      type: 'Satılık'
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{change}%</span>
              <span className="text-sm text-gray-500 ml-1">bu ay</span>
            </div>
          )}
        </div>
        <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hoş geldiniz, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">İlanlarınız ve performansınızın özeti</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Toplam İlanım"
            value={stats.myProperties}
            icon={Building2}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            change={25}
          />
          <StatCard
            title="Toplam Görüntüleme"
            value={stats.totalViews.toLocaleString()}
            icon={Eye}
            color="bg-gradient-to-br from-green-500 to-green-600"
            change={18}
          />
          <StatCard
            title="Aktif Gün"
            value={stats.activeDays}
            icon={Calendar}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
          <StatCard
            title="Potansiyel Gelir"
            value={`₺${stats.potentialRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            change={12}
          />
        </div>

        {/* My Properties */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">İlanlarım</h2>
              <div className="flex space-x-3">
                <a 
                     href="/admin/dashboard/admin/add-property"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni İlan
                </a>
                <a 
                  href="/admin/dashboard/consultant/my-properties" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  Tümünü Gör
                </a>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İlan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
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
                {myProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.type === 'Satılık' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {property.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₺{property.price.toLocaleString()}
                        {property.type === 'Kiralık' && <span className="text-gray-500">/ay</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'Aktif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <Plus className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Yeni İlan Ekle</h3>
            <p className="text-blue-100 text-sm mb-4">Hızlıca yeni bir emlak ilanı oluşturun</p>
            <a 
              href="/admin/dashboard/admin/add-property"
              className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              İlan Ekle
            </a>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <Building2 className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">İlanlarımı Yönet</h3>
            <p className="text-green-100 text-sm mb-4">Mevcut ilanlarınızı düzenleyin</p>
            <a 
              href="/dashboard/consultant/my-properties"
              className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              İlanlarım
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}