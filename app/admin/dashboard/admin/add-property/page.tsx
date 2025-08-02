'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Building2, 
  Upload, 
  MapPin, 
  DollarSign,
  Home,
  Bed,
  Bath,
  Square,
  Save,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: '',
    status: 'sale',
    bedrooms: '',
    bathrooms: '',
    area: '',
    floor: '',
    buildingAge: '',
    furnished: false,
    balcony: false,
    parking: false,
    elevator: false,
    security: false,
    garden: false,
    address: '',
    district: '',
    city: 'İstanbul',
    nearbyPlaces: [] as string[],
    features: [] as string[]
  });

  const propertyTypes = [
    'Daire',
    'Villa',
    'Müstakil Ev',
    'Dubleks',
    'Tripleks',
    'Rezidans',
    'Ofis',
    'Dükkan',
    'Depo',
    'Arsa'
  ];

  const districts = [
    'Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Fatih', 'Bakırköy',
    'Üsküdar', 'Maltepe', 'Pendik', 'Kartal', 'Ataşehir', 'Başakşehir'
  ];

  const featuresList = [
    'Merkezi Isıtma', 'Kombi', 'Klima', 'Şömine', 'Jakuzi', 'Sauna',
    'Spor Salonu', 'Yüzme Havuzu', 'Çocuk Oyun Alanı', 'Barbekü Alanı',
    'Çamaşırhane', 'Kiler', 'Giyinme Odası', 'Çalışma Odası'
  ];

  const nearbyPlacesList = [
    'Hastane', 'Okul', 'Üniversite', 'AVM', 'Market', 'Eczane',
    'Metro', 'Otobüs Durağı', 'Park', 'Spor Merkezi', 'Banka', 'Restoran'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (array: string[], item: string, field: 'features' | 'nearbyPlaces') => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Mock image URLs - in real app, upload to server/cloud
      const newImages = Array.from(files).map((file, index) => 
        `https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600`
      );
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In real app, send data to API
    console.log('Property data:', { ...formData, images });
    
    setIsSubmitting(false);
    router.push('/admin/dashboard/consultant/my-properties');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/dashboard"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Yeni İlan Ekle</h1>
              <p className="text-gray-600 mt-1">Emlak ilanınızın detaylarını doldurun</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Temel Bilgiler</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">İlan Başlığı *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Örn: Modern 3+1 Daire Kadıköy'de"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emlak Tipi *</label>
                <select
                  name="propertyType"
                  required
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İlan Durumu *</label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sale">Satılık</option>
                  <option value="rent">Kiralık</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="2500000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alan (m²) *</label>
                <input
                  type="number"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="İlan hakkında detaylı bilgi veriniz..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Home className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Emlak Detayları</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Oda Sayısı</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banyo Sayısı</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kat</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="3. Kat"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bina Yaşı</label>
                <input
                  type="number"
                  name="buildingAge"
                  value={formData.buildingAge}
                  onChange={handleInputChange}
                  placeholder="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Özellikler</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'furnished', label: 'Eşyalı' },
                  { key: 'balcony', label: 'Balkon' },
                  { key: 'parking', label: 'Otopark' },
                  { key: 'elevator', label: 'Asansör' },
                  { key: 'security', label: 'Güvenlik' },
                  { key: 'garden', label: 'Bahçe' }
                ].map(feature => (
                  <label key={feature.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={feature.key}
                      checked={formData[feature.key as keyof typeof formData] as boolean}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Konum Bilgileri</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İl *</label>
                <select
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İlçe *</label>
                <select
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres *</label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Detaylı adres bilgisi..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Yakın Yerler</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {nearbyPlacesList.map(place => (
                  <label key={place} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.nearbyPlaces.includes(place)}
                      onChange={() => handleArrayChange(formData.nearbyPlaces, place, 'nearbyPlaces')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{place}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Ek Özellikler</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {featuresList.map(feature => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleArrayChange(formData.features, feature, 'features')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Fotoğraflar</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-900 mb-2">Fotoğraf Yükle</span>
                  <span className="text-sm text-gray-500">PNG, JPG, JPEG dosyaları desteklenir</span>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  İlanı Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}