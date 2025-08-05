'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../../../components/dashboard/DashboardLayout';
import { 
  ArrowLeft,
  User,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../../../../components/ui/toast-context';
import userService, { Consultant } from '../../../../../../services/user.service';

export default function EditConsultantPage() {
  const params = useParams();
  const router = useRouter();
  const consultantId = params.id as string;
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  type FormDataType = {
    username: string;
    email: string;
    name: string;
    phone: string;
    title: string;
    about: string;
    password?: string;
    isAdmin: boolean;
    isActive: boolean;
  };

  const [formData, setFormData] = useState<FormDataType>({
    username: '',
    email: '',
    name: '',
    phone: '',
    title: '',
    about: '',
    password: '',
    isAdmin: false,
    isActive: true
  });

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
    async function fetchConsultant() {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await userService.getConsultantById(consultantId);
        const consultant = data.agent;
        
        if (consultant) {
          setFormData({
            username: consultant.username || '',
            email: consultant.email || '',
            name: consultant.name || '',
            phone: consultant.phone || '',
            title: consultant.title || '',
            about: consultant.about || '',
            password: '',
            isAdmin: consultant.isAdmin || false,
            isActive: consultant.isActive !== false
          });
          
          if (consultant.image) {
            setImagePreview(formatImageUrl(consultant.image));
          }
        }
      } catch (error: any) {
        console.error('Error fetching consultant:', error);
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
      fetchConsultant();
    }
  }, [consultantId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Form doğrulama
      if (!formData.username || !formData.email || !formData.name || !formData.phone) {
        setError('Kullanıcı adı, e-posta, ad soyad ve telefon alanları zorunludur');
        setIsSubmitting(false);
        return;
      }
      
      // Email doğrulama
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(formData.email)) {
        setError('Geçerli bir e-posta adresi girin');
        setIsSubmitting(false);
        return;
      }
      
      // Şifre boş ise gönderme
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }
      
      // API'ye güncelleme isteği gönder
      await userService.updateConsultant(consultantId, dataToSend, imageFile || undefined);
      
      toast({
        title: "Başarılı!",
        description: "Danışman bilgileri güncellendi.",
        variant: "success",
      });
      
      router.push(`/admin/dashboard/admin/consultants/${consultantId}`);
      
    } catch (error: any) {
      console.error('Error updating consultant:', error);
      setError(error.message || 'Danışman güncellenirken bir hata oluştu');
      toast({
        title: "Hata!",
        description: error.message || 'Danışman güncellenirken bir hata oluştu',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link 
            href={`/admin/dashboard/admin/consultants/${consultantId}`}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danışman Düzenle</h1>
            <p className="text-gray-600 mt-1">{formData.name}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <div className="mb-3 h-32 w-32 rounded-full bg-gray-200 overflow-hidden">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profil Resmi" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <User className="h-16 w-16" />
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
              Resim Seç
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kullanıcı Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ünvan
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Örn: Emlak Danışmanı"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre (Değiştirmek istemiyorsanız boş bırakın)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hakkında
              </label>
              <textarea
                name="about"
                rows={4}
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Danışman hakkında kısa bilgi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-6 pt-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
                  Admin yetkisi
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Aktif
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <Link
                href={`/admin/dashboard/admin/consultants/${consultantId}`}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}