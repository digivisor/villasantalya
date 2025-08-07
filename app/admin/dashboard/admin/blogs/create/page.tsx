'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { ArrowLeft, Upload, Save, Plus, X, User, Calendar, Tag as TagIcon } from 'lucide-react';
import Link from 'next/link';
import Toast from '../../../../components/ui/toast';
import Image from 'next/image';
import { createBlog } from '../../../../../services/blog.service'; // <-- kendi servis dosyanın yolu


const predefinedCategories = [
  'Tasarım İpuçları',
  'Emlak Rehberi',
  'Başlangıç Rehberi',
  'Piyasa Analizi',
  'Yasal Süreçler',
  'Trend Analizi',
  'Finansal Rehber',
  'Yaşam Tarzı',
  'Mimari',
  'Gayrimenkul Teknolojileri'
];

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  isActive: boolean;
  image: File | null;
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    author: 'Fazıl Can Akbaş',
    category: '',
    tags: [],
    isActive: true,
    image: null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    isVisible: false
  });

  // Hata kontrolü
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Başlık gereklidir';
    if (!formData.excerpt.trim()) errors.excerpt = 'Özet gereklidir';
    if (!formData.content.trim()) errors.content = 'İçerik gereklidir';
    if (!formData.category) errors.category = 'Kategori seçmelisiniz';
    if (!formData.image) errors.image = 'Blog görseli yüklemelisiniz';
    if (formData.tags.length === 0) errors.tags = 'En az bir etiket eklemelisiniz';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form input değişikliği
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  // Görsel yükleme
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      if (formErrors.image) setFormErrors({ ...formErrors, image: '' });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
      if (formErrors.tags) setFormErrors({ ...formErrors, tags: '' });
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddCategory = () => {
    if (customCategory.trim() && !predefinedCategories.includes(customCategory.trim())) {
      setFormData({
        ...formData,
        category: customCategory.trim()
      });
      setCustomCategory('');
      if (formErrors.category) setFormErrors({ ...formErrors, category: '' });
    }
  };

  // API'ye gönderim
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Lütfen gerekli alanları doldurun', 'error');
      return;
    }
    setIsSubmitting(true);

    try {
      // JWT token'ı clientdan al (ör: cookies/localStorage'dan)
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

      // Görsel için FormData kullan (eğer API destekliyorsa)
      const data = new FormData();
      data.append('title', formData.title);
      data.append('excerpt', formData.excerpt);
      data.append('content', formData.content);
      data.append('author', formData.author);
      data.append('category', formData.category);
      data.append('isActive', String(formData.isActive));
      data.append('slug', createSlug(formData.title));
    
      if (formData.image) data.append('image', formData.image);
      data.append('tags', JSON.stringify(formData.tags));
      // Eğer API sadece JSON alıyorsa, image'ı upload edip URL dönmelisin.
      // Eğer API multipart/form-data kabul ediyorsa, bu şekilde gönder.
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/blogs`
          : "https://api.villasantalya.com/api/blogs",
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // Content-Type'ı FormData ile otomatik bırak!
          },
          body: data,
        }
      );

      if (!res.ok) throw new Error('Blog oluşturulamadı');
      showToast('Blog yazısı başarıyla oluşturuldu!', 'success');
      setTimeout(() => router.push('/admin/dashboard/admin/blogs'), 1000);
    } catch (error: any) {
      showToast(error?.message || 'Blog yazısı oluşturulurken bir hata oluştu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const formatDate = () => {
    const date = new Date();
    const months = [
      'OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN',
      'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const createSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/dashboard/admin/blogs"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
              <p className="text-gray-600 mt-1">Yeni bir blog yazısı oluşturun</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/admin/dashboard/admin/blogs')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Kaydet ve Yayınla
                </>
              )}
            </button>
          </div>
        </div>

       <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
          {/* Ana İçerik - Sol Sütun */}
          <div className="lg:col-span-2 space-y-6">
            {/* Blog Başlığı */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Etkileyici bir başlık yazın"
                className={`w-full px-4 py-3 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
              )}
              {formData.title && (
                <p className="mt-2 text-sm text-gray-500">
                  Slug: <span className="font-mono">{createSlug(formData.title)}</span>
                </p>
              )}
            </div>

            {/* Blog Özeti */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Özeti <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Blog yazısının kısa bir özetini yazın (150-200 karakter)"
                rows={3}
                className={`w-full px-4 py-3 border ${formErrors.excerpt ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {formErrors.excerpt && (
                <p className="mt-1 text-sm text-red-500">{formErrors.excerpt}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {formData.excerpt.length} / 200 karakter
              </p>
            </div>

            {/* Blog İçeriği */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog İçeriği <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Blog yazısının içeriğini buraya yazın. Markdown formatı desteklenmektedir."
                rows={15}
                className={`w-full px-4 py-3 border ${formErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono`}
              />
              {formErrors.content && (
                <p className="mt-1 text-sm text-red-500">{formErrors.content}</p>
              )}
              <div className="mt-2 text-sm text-gray-500 flex justify-between">
                <span>{formData.content.length} karakter</span>
                <span>Markdown desteklenmektedir</span>
              </div>
            </div>
          </div>

          {/* Sağ Sütun - Yan Panel */}
          <div className="space-y-6">
            {/* Yayın Durumu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Yayın Durumu</h2>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Yayında mı?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={formData.isActive}
                    onChange={(e) => handleToggleChange('isActive', e.target.checked)}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`h-5 w-5 rounded-full bg-white transform transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'} mt-0.5`}></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Yayınlanma tarihi: {formatDate()}</span>
              </div>
            </div>
            
            {/* Blog Görseli */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Blog Görseli</h2>
              
              {imagePreview ? (
                <div className="relative mb-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Blog görseli önizleme"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: null });
                    }}
                    className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-red-500/70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 mb-1">Blog görseli yükle</span>
                    <span className="text-xs text-gray-500">PNG, JPG, WEBP (Önerilen: 1200x630px)</span>
                  </label>
                </div>
              )}
              
              {formErrors.image && (
                <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>
              )}
            </div>
            
            {/* Yazar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Yazar</h2>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Yazar adı"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Kategori */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategori</h2>
              
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4`}
              >
                <option value="">Kategori seçin</option>
                {predefinedCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Özel kategori ekle"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {formErrors.category && (
                <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
              )}
            </div>
            
            {/* Etiketler */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h2>
              
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Etiket ekle ve Enter'a bas"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-700 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {formErrors.tags && (
                <p className="mt-2 text-sm text-red-500">{formErrors.tags}</p>
              )}
            </div>
          </div>
        </form>
      </div>

     <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </DashboardLayout>
  );
}