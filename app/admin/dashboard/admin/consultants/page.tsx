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
  ExternalLink,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../../components/ui/toast-context';
import userService, { 
  Consultant, 
  ConsultantFormData,
  Pagination
} from '../../../../services/user.service';
import Image from 'next/image';

export default function AdminConsultantsPage() {
  const { toast } = useToast();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pageSize: 10,
    pageCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Danışmanları API'den getir
  useEffect(() => {
    async function fetchConsultants() {
      try {
        setIsLoading(true);
        setError(null);
        
        // API'den danışmanları getir
        const data = await userService.getAllConsultants(
          pagination.page,
          pagination.pageSize,
          sortBy
        );
        
        setConsultants(data.agents || []);
        setPagination(data.pagination);
      } catch (error: any) {
        console.error('Error fetching consultants:', error);
        setError(error.message || 'Danışmanlar yüklenirken bir hata oluştu');
        toast({
          title: "Hata!",
          description: error.message || 'Danışmanlar yüklenirken bir hata oluştu',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchConsultants();
  }, [pagination.page, pagination.pageSize, sortBy, toast]);

  // Arama ve filtrele
  const filteredConsultants = consultants.filter(consultant => {
    // Arama filtresi
    const matchesSearch = 
      consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (consultant.username && consultant.username.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Durum filtresi
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && consultant.isActive) ||
      (filterStatus === 'inactive' && !consultant.isActive);
      
    return matchesSearch && matchesStatus;
  });

  // Sayfa değiştirme işlevi
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pageCount) {
      setPagination(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  // Danışman silme işlemi
  const handleDelete = async (id: string) => {
    if (window.confirm('Bu danışmanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        await userService.deleteConsultant(id);
        
        // Danışmanları güncelle
        const updatedConsultants = consultants.filter(c => c._id !== id);
        setConsultants(updatedConsultants);
        
        toast({
          title: "Başarılı!",
          description: "Danışman başarıyla silindi.",
          variant: "success",
        });
      } catch (error: any) {
        console.error(`Error deleting consultant ${id}:`, error);
        toast({
          title: "Hata!",
          description: error.message || 'Danışman silinirken bir hata oluştu',
          variant: "destructive",
        });
      }
    }
  };

  // Durum rengini belirle
  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  // Durum metnini belirle
  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Aktif' : 'Pasif';
  };
  
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

  // Danışman ekleme modalı
  const AddConsultantModal = () => {
    const [formData, setFormData] = useState<ConsultantFormData>({
      username: '',
      email: '',
      password: '',
      name: '',
      title: 'Emlak Danışmanı',
      phone: ''
    });
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Form gönderme
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setIsSubmitting(true);
        setFormError(null);
        
        // Form doğrulama
        if (!formData.username || !formData.email || !formData.password || !formData.name || !formData.phone) {
          setFormError('Lütfen zorunlu alanları doldurun (kullanıcı adı, e-posta, şifre, ad soyad, telefon)');
          setIsSubmitting(false);
          return;
        }

        // Email doğrulama
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(formData.email)) {
          setFormError('Geçerli bir e-posta adresi girin');
          setIsSubmitting(false);
          return;
        }

        // Şifre uzunluğu kontrolü
        if (formData.password && formData.password.length < 6) {
          setFormError('Şifre en az 6 karakter olmalıdır');
          setIsSubmitting(false);
          return;
        }
        
        // API'ye gönder
        const response = await userService.createConsultant(formData, imageFile || undefined);
        
        // Başarılı ise danışmanları yeniden yükle
        toast({
          title: "Başarılı!",
          description: "Danışman başarıyla eklendi.",
          variant: "success",
        });
        
        // Modalı kapat ve formu sıfırla
        setShowAddModal(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          name: '',
          title: 'Emlak Danışmanı',
          phone: ''
        });
        setImageFile(null);
        setImagePreview('');
        
        // Danışmanları yeniden yükle
        const refreshedData = await userService.getAllConsultants(
          pagination.page, 
          pagination.pageSize,
          sortBy
        );
        setConsultants(refreshedData.agents || []);
        setPagination(refreshedData.pagination);
        
      } catch (error: any) {
        console.error('Error creating consultant:', error);
        setFormError(error.message || 'Danışman oluşturulurken bir hata oluştu');
      } finally {
        setIsSubmitting(false);
      }
    };
    
    // Resim yükleme
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Yeni Danışman Ekle</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          
          {formError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profil Resmi */}
            <div className="flex flex-col items-center mb-4">
              <div className="mb-2 h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profil Önizleme" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                    <Users className="h-12 w-12" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                Resim Seç
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kullanıcı Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ünvan
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Örn: Emlak Danışmanı"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hakkında
              </label>
              <textarea
                rows={3}
                value={formData.about || ''}
                onChange={(e) => setFormData({...formData, about: e.target.value})}
                placeholder="Danışman hakkında kısa bilgi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={formData.isAdmin || false}
                onChange={(e) => setFormData({...formData, isAdmin: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
                Admin yetkisi ver
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ekle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Yükleniyor durumu
  if (isLoading && consultants.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Hata durumu
  if (error && consultants.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
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
            <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
            <div className="text-sm text-gray-600">Toplam Danışman</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">
              {consultants.filter(c => c.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Aktif Danışman</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {consultants.filter(c => !c.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Pasif Danışman</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Danışman ara..."
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
                  <option value="all">Tüm Danışmanlar</option>
                  <option value="active">Aktif Danışmanlar</option>
                  <option value="inactive">Pasif Danışmanlar</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Ada Göre (A-Z)</option>
                  <option value="-name">Ada Göre (Z-A)</option>
                  <option value="createdAt">Eskiden Yeniye</option>
                  <option value="-createdAt">Yeniden Eskiye</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Consultants Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredConsultants.map((consultant) => (
            <div key={consultant._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                    {consultant.image ? (
                      <img 
                        src={formatImageUrl(consultant.image)} 
                        alt={consultant.name} 
                        className="h-12 w-12 object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-white">
                        {consultant.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{consultant.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultant.isActive)}`}>
                        {getStatusText(consultant.isActive)}
                      </span>
                      {consultant.isAdmin && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/admin/dashboard/admin/consultants/${consultant._id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Profili Görüntüle"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/dashboard/admin/consultants/edit/${consultant._id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(consultant._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
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
                    {new Date(consultant.createdAt).toLocaleDateString('tr-TR')} tarihinde katıldı
                  </span>
                </div>
                {consultant.title && (
                  <div className="mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {consultant.title}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/admin/dashboard/admin/consultants/${consultant._id}`}
                  className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Profili Görüntüle
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredConsultants.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Danışman bulunamadı</h3>
            <p className="text-gray-600">Arama kriterleriyle eşleşen danışman bulunamadı.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pageCount > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-2 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg ${
                    page === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pageCount}
                className="px-2 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}

        <AddConsultantModal />
      </div>
    </DashboardLayout>
  );
}