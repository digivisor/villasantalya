'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { 
  Building2, 
  Upload, 
  MapPin, 
  DollarSign,
  Home,
  Save,
  Image as ImageIcon,
  Percent
} from 'lucide-react';
import { Property } from '../../types/property';

type PropertyEditModalProps = {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProperty: Property) => void;
};

export default function PropertyEditModal({
  property,
  isOpen,
  onClose,
  onSave
}: PropertyEditModalProps) {
  const [formData, setFormData] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);

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
  
  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        status: property.type === 'Satılık' ? 'sale' : 'rent',
        propertyType: property.type,
        district: property.location.split(',')[0].trim(),
        city: property.location.split(',')[1]?.trim() || 'İstanbul',
        address: '',
        bedrooms: '3',
        bathrooms: '2',
        floor: '3',
        buildingAge: '5',
        furnished: false,
        balcony: false,
        parking: false,
        elevator: false,
        security: false,
        garden: false,
        features: [],
        nearbyPlaces: [],
        discountedPrice: property.discountedPrice || null,
      });
      
      setHasDiscount(!!property.discountedPrice);
      
      // Tek bir görüntü varsa onu diziye ekle, yoksa boş dizi
      setImages(property.image ? [property.image] : []);
    }
  }, [property]);

  if (!formData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Hata varsa temizle
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
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
      // Mock image URLs - gerçek uygulamada sunucuya/buluta yükleyin
      const newImages = Array.from(files).map((file, index) => 
        `https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600`
      );
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) {
      newErrors.title = 'İlan başlığı gereklidir';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }

    if (hasDiscount && (!formData.discountedPrice || formData.discountedPrice <= 0)) {
      newErrors.discountedPrice = 'Geçerli bir indirimli fiyat giriniz';
    }

    if (hasDiscount && parseInt(formData.discountedPrice) >= parseInt(formData.price)) {
      newErrors.discountedPrice = 'İndirimli fiyat normal fiyattan düşük olmalıdır';
    }
    
    if (!formData.location) {
      newErrors.location = 'Konum gereklidir';
    }
    
    if (!formData.propertyType) {
      newErrors.propertyType = 'Emlak tipi gereklidir';
    }
    
    if (!formData.district) {
      newErrors.district = 'İlçe gereklidir';
    }

    if (images.length === 0) {
      newErrors.images = 'En az bir görsel yüklemelisiniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Formdaki değerleri birleştirip güncellenmiş emlak verisi oluştur
    const updatedProperty: Property = {
      ...property!,
      title: formData.title,
      price: parseFloat(formData.price),
      discountedPrice: hasDiscount ? parseFloat(formData.discountedPrice) : null,
      location: `${formData.district}, ${formData.city}`,
      type: formData.status === 'sale' ? 'Satılık' : 'Kiralık',
      image: images[0] || '',
      // Diğer alanları da ekleyin
      description: formData.description || ''
    };

    // Güncelleme işlemi tamamlandığında bildir
    setTimeout(() => {
      setIsSubmitting(false);
      onSave(updatedProperty);
    }, 1000);
  };

  const toggleDiscount = () => {
    setHasDiscount(!hasDiscount);
    if (!hasDiscount) {
      // İndirim açıldığında varsayılan olarak %10 indirimli fiyat hesapla
      const discountAmount = Math.round(parseFloat(formData.price) * 0.9);
      setFormData(prev => ({ ...prev, discountedPrice: discountAmount }));
    } else {
      // İndirim kapatıldığında indirimli fiyatı temizle
      setFormData(prev => ({ ...prev, discountedPrice: null }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="İlanı Düzenle" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
        {/* Temel Bilgiler */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Temel Bilgiler</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">İlan Başlığı *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Örn: Modern 3+1 Daire Kadıköy'de"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emlak Tipi *</label>
              <select
                name="propertyType"
                required
                value={formData.propertyType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.propertyType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seçiniz</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İlan Durumu *</label>
              <select
                name="status"
                required
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="sale">Satılık</option>
                <option value="rent">Kiralık</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="2500000"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="flex items-center">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDiscount}
                  onChange={toggleDiscount}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                İndirimli Fiyat Ekle
              </label>
            </div>

            {hasDiscount && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İndirimli Fiyat (₺) *</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="discountedPrice"
                    required
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    placeholder="2250000"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.discountedPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.discountedPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.discountedPrice}</p>
                )}
                {formData.price && formData.discountedPrice && !errors.discountedPrice && (
                  <p className="mt-1 text-sm text-green-600">
                    %{Math.round((1 - formData.discountedPrice / formData.price) * 100)} indirim
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alan (m²) *</label>
              <input
                type="number"
                name="area"
                required
                value={formData.area}
                onChange={handleInputChange}
                placeholder="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="İlan hakkında detaylı bilgi veriniz..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Emlak Detayları */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Home className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Emlak Detayları</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oda Sayısı</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banyo Sayısı</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Özellikler</h3>
            <div className="grid grid-cols-2 gap-2">
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

        {/* Konum Bilgileri */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Konum Bilgileri</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İl *</label>
              <select
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İlçe *</label>
              <select
                name="district"
                required
                value={formData.district}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.district ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seçiniz</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
            </div>
          </div>
        </div>

        {/* Görseller */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Fotoğraflar</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload-edit"
              />
              <label
                htmlFor="image-upload-edit"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-base font-medium text-gray-900 mb-1">Fotoğraf Yükle</span>
                <span className="text-xs text-gray-500">PNG, JPG, JPEG dosyaları desteklenir</span>
              </label>
            </div>

            {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}