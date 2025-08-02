'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Users, 
  Search, 
  Plus,
  Edit, 
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building2,
  Eye,
  UserPlus,
  ExternalLink
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
};

export default function AdminConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setConsultants([
        {
          id: 2,
          name: 'Ahmet Yılmaz',
          email: 'ahmet@emlak.com',
          phone: '+90 555 234 5678',
          propertiesCount: 12,
          totalViews: 2456,
          joinDate: '2024-01-16',
          status: 'Aktif',
          avatar: null
        },
        {
          id: 3,
          name: 'Ayşe Kaya',
          email: 'ayse@emlak.com',
          phone: '+90 555 345 6789',
          propertiesCount: 8,
          totalViews: 1823,
          joinDate: '2024-01-17',
          status: 'Aktif',
          avatar: null
        },
        {
          id: 4,
          name: 'Mehmet Öz',
          email: 'mehmet@emlak.com',
          phone: '+90 555 456 7890',
          propertiesCount: 15,
          totalViews: 3421,
          joinDate: '2024-01-10',
          status: 'Aktif',
          avatar: null
        },
        {
          id: 5,
          name: 'Fatma Demir',
          email: 'fatma@emlak.com',
          phone: '+90 555 567 8901',
          propertiesCount: 3,
          totalViews: 789,
          joinDate: '2024-01-22',
          status: 'Beklemede',
          avatar: null
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredConsultants = consultants.filter(consultant =>
    consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('Bu danışmanı silmek istediğinize emin misiniz?')) {
      setConsultants(consultants.filter(c => c.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'bg-green-100 text-green-800';
      case 'beklemede':
        return 'bg-yellow-100 text-yellow-800';
      case 'pasif':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AddConsultantModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newConsultant = {
        id: Date.now(),
        ...formData,
        propertiesCount: 0,
        totalViews: 0,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Aktif',
        avatar: null
      };
      setConsultants([...consultants, newConsultant]);
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', password: '' });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Danışman Ekle</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ekle
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
            <h1 className="text-3xl font-bold text-gray-900">Danışmanlar</h1>
            <p className="text-gray-600 mt-1">Sistem danışmanlarını yönetin</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Yeni Danışman
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-900">{consultants.length}</div>
            <div className="text-sm text-gray-600">Toplam Danışman</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">{consultants.filter(c => c.status === 'Aktif').length}</div>
            <div className="text-sm text-gray-600">Aktif Danışman</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{consultants.reduce((sum, c) => sum + c.propertiesCount, 0)}</div>
            <div className="text-sm text-gray-600">Toplam İlan</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Danışman ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Consultants Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredConsultants.map((consultant) => (
            <div key={consultant.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">
                      {consultant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{consultant.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultant.status)}`}>
                      {consultant.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/admin/dashboard/admin/consultants/${consultant.id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Profili Görüntüle"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(consultant.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{consultant.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{consultant.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {new Date(consultant.joinDate).toLocaleDateString('tr-TR')} tarihinde katıldı
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-blue-600 mb-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{consultant.propertiesCount}</span>
                    </div>
                    <div className="text-xs text-gray-500">İlan</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-green-600 mb-1">
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{consultant.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">Görüntüleme</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/admin/dashboard/admin/consultants/${consultant.id}`}
                  className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Profili Görüntüle
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredConsultants.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Danışman bulunamadı</h3>
            <p className="text-gray-600">Arama kriterleriyle eşleşen danışman bulunamadı.</p>
          </div>
        )}

        <AddConsultantModal />
      </div>
    </DashboardLayout>
  );
}