'use client';

import { useState, useEffect } from 'react';
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
  Image as ImageIcon,
  Calendar,
  Check,
  Truck,
  Shield,
  Map as MapIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import propertyService, { PropertyFormData } from '../../../../services/property.service';
import { useToast } from '../../../components/ui/toast-context';
import dynamic from 'next/dynamic';

// Google Maps bileşenini client-side olarak yükle
const LocationPicker = dynamic(() => import('../../../components/dashboard/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
      Harita yükleniyor...
    </div>
  ),
});

export default function AddPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number}>({
    lat: 36.8969, // Antalya merkez
    lng: 30.7133
  });
  
// AddPropertyPage.tsx içinde formData tanımı
const [formData, setFormData] = useState<PropertyFormData>({
  title: '',
  description: '',
  price: '',
  propertyType: '',
  currency: 'TRY',
  category: '',
  type: 'sale', // Varsayılan değer 'sale' olarak ayarlanmalı (status değil!)
  discountedPrice: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  buildingAge: '',
  floor: '',
  totalFloors: '',
  furnished: false,
  balcony: false,
  parking: false,
  elevator: false,
  security: false,
  garden: false,
  address: '',
  district: '',
  city: 'Antalya',
  location: {
    lat: '',
    lng: ''
  },
  features: [],
  nearbyPlaces: []
  // status alanını göndermeyin, otomatik olarak 'pending' olacak
});

  // İlçeye göre haritanın merkezini güncelle
  useEffect(() => {
    if (formData.district) {
      // İlçelere göre yaklaşık merkez koordinatları
      const districtCoordinates: Record<string, {lat: number, lng: number}> = {
        'Muratpaşa': {lat: 36.8881, lng: 30.7046},
        'Konyaaltı': {lat: 36.8678, lng: 30.6321},
        'Kepez': {lat: 36.9275, lng: 30.6759},
        'Döşemealtı': {lat: 37.0252, lng: 30.6453},
        'Aksu': {lat: 36.9294, lng: 30.8444},
        'Manavgat': {lat: 36.7865, lng: 31.4430},
        'Alanya': {lat: 36.5426, lng: 32.0041},
        'Serik': {lat: 36.9200, lng: 31.1002},
        'Side': {lat: 36.7667, lng: 31.3889},
        'Belek': {lat: 36.8603, lng: 31.0522},
        'Lara': {lat: 36.8563, lng: 30.7392},
        'Kaş': {lat: 36.1989, lng: 29.6347},
        'Kalkan': {lat: 36.2678, lng: 29.4142},
        'Kemer': {lat: 36.5972, lng: 30.5652},
      };

      if (districtCoordinates[formData.district]) {
        setMapCenter(districtCoordinates[formData.district]);
      }
    }
  }, [formData.district]);

  const propertyTypes = [
    'Daire',
    'Villa',
    'Müstakil Ev',
    'İkiz Villa',
    'Yazlık',
    'Residence',
    'Dağ Evi',
    'Ofis',
    'Dükkan',
    'Depo',
    'Arsa'
  ];

  const categories = [
    'Konut',
    'İşyeri',
    'Arsa',
    'Turistik Tesis'
  ];

  const districts = [
    'Muratpaşa', 'Konyaaltı', 'Kepez', 'Döşemealtı', 'Aksu', 'Manavgat',
    'Alanya', 'Serik', 'Side', 'Belek', 'Lara', 'Kaş', 'Kalkan', 'Kemer'
  ];

  const featuresList = [
    'Merkezi Isıtma', 'Kombi', 'Klima', 'Şömine', 'Jakuzi', 'Sauna',
    'Spor Salonu', 'Yüzme Havuzu', 'Çocuk Oyun Alanı', 'Barbekü Alanı',
    'Deniz Manzarası', 'Dağ Manzarası', 'Çamaşırhane', 'Kiler', 
    'Giyinme Odası', 'Çalışma Odası', 'Akıllı Ev Sistemi', 'Güneş Enerjisi',
    'Jeneratör', '24 Saat Güvenlik', 'Kapalı Otopark', 'Açık Havuz', 'Kapalı Havuz'
  ];

  const nearbyPlacesList = [
    'Hastane', 'Okul', 'Üniversite', 'AVM', 'Market', 'Eczane',
    'Metro', 'Otobüs Durağı', 'Park', 'Spor Merkezi', 'Banka', 'Restoran',
    'Plaj', 'Marina', 'Havalimanı', 'Ören Yeri', 'Müze', 'Camii'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.includes('.')) {
      // Nested property (location.lat, location.lng gibi)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Haritadan seçilen konum
  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      location: {
        lat: lat.toString(),
        lng: lng.toString()
      }
    }));
  };


  const handleArrayChange = (array: string[], item: string, field: 'features' | 'nearbyPlaces') => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Resim dosyalarını saklama
      const newImageFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newImageFiles]);
      
      // Önizleme URL'leri oluşturma
      const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newImageUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      // Önizleme URL'sini kaldırmadan önce temizle (bellek sızıntısını önle)
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Form doğrulama kontrolleri
    if (!formData.title || !formData.description) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen başlık ve açıklama alanlarını doldurun.",
        variant: "warning",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.price) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen fiyat bilgisini girin.",
        variant: "warning",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.propertyType || !formData.category) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen mülk tipi ve kategori seçin.",
        variant: "warning",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.address || !formData.district || !formData.city) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen adres bilgilerini girin.",
        variant: "warning",
      });
      setIsSubmitting(false);
      return;
    }
    if (formData.discountedPrice && Number(formData.discountedPrice) >= Number(formData.price)) {
      toast({
        title: "Geçersiz İndirimli Fiyat",
        description: "İndirimli fiyat, normal fiyattan düşük olmalıdır.",
        variant: "warning",
      });
      setIsSubmitting(false);
      return;
    }
    // Konum kontrolü
    if (!formData.location.lat || !formData.location.lng) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen haritadan konum seçin.",
        variant: "warning",
      });
      setIsSubmitting(false);
      return;
    }

    // Resim kontrolü
    if (imageFiles.length === 0) {
      toast({
        title: "Resim Gerekli",
        description: "Lütfen en az bir resim ekleyin.",
        variant: "warning",
      });
      setIsSubmitting(false);
      return;
    }

    // Form verilerini sayısal verilere dönüştürme
    const submissionData = {
      ...formData,
     
      area: formData.area ? Number(formData.area) : 0,
      buildingAge: formData.buildingAge ? Number(formData.buildingAge) : 0,
      floor: formData.floor ? Number(formData.floor) : 0,
      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : 0
    };
    
    console.log("Gönderilecek veriler:", submissionData);
    console.log("Resimler:", imageFiles.map(f => f.name).join(", "));

    // Manuel XMLHttpRequest oluşturma
    const xhr = new XMLHttpRequest();
    const formDataToSend = new FormData();
    
    // Property verilerini ekle
    formDataToSend.append('data', JSON.stringify(submissionData));
    
    // Resimleri ekle
    for (let i = 0; i < imageFiles.length; i++) {
      console.log(`Resim ekleniyor ${i+1}: ${imageFiles[i].name} (${imageFiles[i].size} bytes)`);
      formDataToSend.append('images', imageFiles[i]);
    }
    
    // İsteği başlat
    xhr.open('POST', 'https://api.villasantalya.com/api/properties', true);
    
    // Token ekle - hem yeni format (Authorization) hem eski format (x-auth-token)
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Oturum Hatası",
        description: "Oturum bilgileriniz bulunamadı. Lütfen tekrar giriş yapın.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('x-auth-token', token);
    
    // Yanıt geldiğinde
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Başarılı
        console.log("Başarılı yanıt:", xhr.responseText);
        
        toast({
          title: "Başarılı!",
          description: "İlanınız başarıyla eklendi. Onay için bekleyiniz.",
          variant: "success",
        });
        
        // İlanlarım sayfasına yönlendir
        setTimeout(() => {
          router.push('/admin/dashboard/consultant/my-properties');
        }, 2000);
      } else {
        // HTTP hatası
        console.error("HTTP Hatası:", xhr.status, xhr.responseText);
        
        let errorMessage = "İlanınız eklenirken bir hata oluştu.";
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          if (errorResponse.message) {
            errorMessage = errorResponse.message;
          }
        } catch (e) {
          // JSON parse hatası, responseText direkt kullan
          errorMessage = `Sunucu hatası (${xhr.status}): ${xhr.responseText || 'Bilinmeyen hata'}`;
        }
        
        toast({
          title: "Hata!",
          description: errorMessage,
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    };
    
    // Ağ hatası
    xhr.onerror = function(e) {
      console.error("Ağ hatası:", e);
      toast({
        title: "Bağlantı Hatası",
        description: "Sunucuya bağlanırken bir hata oluştu. İnternet bağlantınızı kontrol edin.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    };
    
    // İlerleme durumu (opsiyonel)
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        console.log(`Yükleme: %${percentComplete}`);
        // İsterseniz burada bir ilerleme çubuğu gösterebilirsiniz
      }
    };
    
    // İsteği gönder
    console.log("İstek gönderiliyor...");
    xhr.send(formDataToSend);
    
  } catch (error: any) {
    console.error('Form gönderme hatası:', error);
    
    toast({
      title: "Hata!",
      description: error.message || "İlanınız eklenirken bir hata oluştu.",
      variant: "destructive",
    });
    setIsSubmitting(false);
  }
};
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/dashboard/consultant"
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
          {/* Genel Bilgiler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Home className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Genel Bilgiler</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  İlan Başlığı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Örn: Konyaaltı'nda Deniz Manzaralı Lüks Villa"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

             {/* Fiyat alanından sonra */}
<div className="md:col-span-2">
  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
    Fiyat <span className="text-red-500">*</span>
  </label>
  <div className="flex space-x-2">
    {/* Para birimi seçimi */}
    <div className="w-24">
      <select
        id="currency"
        name="currency"
        value={formData.currency}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        <option value="TRY">₺ TL</option>
        <option value="USD">$ Dolar</option>
        <option value="EUR">€ Euro</option>
      </select>
    </div>
    
    {/* Fiyat input */}
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {formData.currency === 'TRY' && <span className="text-gray-500">₺</span>}
        {formData.currency === 'USD' && <span className="text-gray-500">$</span>}
        {formData.currency === 'EUR' && <span className="text-gray-500">€</span>}
      </div>
      <input
        type="text"
        id="price"
        name="price"
        value={formData.price}
        onChange={(e) => {
          // Sadece sayı ve nokta kabul et
          let value = e.target.value.replace(/[^\d.]/g, '');
          
      
          setFormData(prev => ({ ...prev, price: value }));
        }}
        required
        placeholder="Örn: 2.700.000"
        className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
</div>

{/* İndirimli fiyat */}
<div className="md:col-span-2">
  <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
    İndirimli Fiyat
    <span className="ml-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Opsiyonel</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {formData.currency === 'TRY' && <span className="text-gray-500">₺</span>}
      {formData.currency === 'USD' && <span className="text-gray-500">$</span>}
      {formData.currency === 'EUR' && <span className="text-gray-500">€</span>}
    </div>
    <input
      type="text"
      id="discountedPrice"
      name="discountedPrice"
      value={formData.discountedPrice}
      onChange={(e) => {
        // Sadece sayı ve nokta kabul et
        let value = e.target.value.replace(/[^\d.]/g, '');
        
        
        
        setFormData(prev => ({ ...prev, discountedPrice: value }));
      }}
      placeholder="Örn: 2.500.000"
      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  <p className="text-xs text-gray-500 mt-1">İndirimli bir fiyat varsa giriniz (Kampanya, özel teklif vb.)</p>
</div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                  Mülk Tipi <span className="text-red-500">*</span>
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Mülk Tipi Seçin</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Satılık/Kiralık <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="sale">Satılık</option>
                  <option value="rent">Kiralık</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  İlan Açıklaması <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Mülkünüzün detaylı bir açıklamasını yazın..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Mülk Özellikleri</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                   Oda Sayısı
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="Örn: 3+1"
                    min="0"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Banyo Sayısı
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bath className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="Örn: 2"
                    min="0"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  Alan (m²) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Square className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    placeholder="Örn: 120"
                    min="0"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="buildingAge" className="block text-sm font-medium text-gray-700 mb-1">
                  Bina Yaşı
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="buildingAge"
                    name="buildingAge"
                    value={formData.buildingAge}
                    onChange={handleInputChange}
                    placeholder="Örn: 5"
                    min="0"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                  Bulunduğu Kat
                </label>
                <input
                  type="number"
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="Örn: 3 (0=Zemin Kat, -1=Bodrum)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="totalFloors" className="block text-sm font-medium text-gray-700 mb-1">
                  Toplam Kat Sayısı
                </label>
                <input
                  type="number"
                  id="totalFloors"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleInputChange}
                  placeholder="Örn: 5"
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="furnished"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="furnished" className="text-sm text-gray-700">
                  Eşyalı
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="balcony"
                  name="balcony"
                  checked={formData.balcony}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="balcony" className="text-sm text-gray-700">
                  Balkon
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="parking"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="parking" className="text-sm text-gray-700">
                  Otopark
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="elevator"
                  name="elevator"
                  checked={formData.elevator}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="elevator" className="text-sm text-gray-700">
                  Asansör
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="security"
                  name="security"
                  checked={formData.security}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="security" className="text-sm text-gray-700">
                  Güvenlik
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="garden"
                  name="garden"
                  checked={formData.garden}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="garden" className="text-sm text-gray-700">
                  Bahçe
                </label>
              </div>
            </div>

            {/* Detaylı Özellikler */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-800 mb-2">Detaylı Özellikler</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {featuresList.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`feature-${feature}`}
                      checked={formData.features.includes(feature)}
                      onChange={() => handleArrayChange(formData.features, feature, 'features')}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`feature-${feature}`} className="text-sm text-gray-700">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Konum Bilgileri */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Konum Bilgileri</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Şehir <span className="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="Antalya">Antalya</option>
                </select>
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                  İlçe/Bölge <span className="text-red-500">*</span>
                </label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">İlçe/Bölge Seçin</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Tam Adres <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Mülkün tam adresini yazın..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Harita */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Haritada Konumu İşaretleyin <span className="text-red-500">*</span>
                </label>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <MapIcon className="h-3 w-3" />
                  <span>İlgili konumu işaretlemek için haritaya tıklayın</span>
                </div>
              </div>
              <div className="h-80 border border-gray-300 rounded-lg overflow-hidden">
                <LocationPicker 
                  center={mapCenter}
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={
                    formData.location.lat && formData.location.lng 
                      ? { lat: parseFloat(formData.location.lat), lng: parseFloat(formData.location.lng) }
                      : undefined
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label htmlFor="location.lat" className="block text-xs text-gray-500 mb-1">Enlem (Latitude)</label>
                  <input
                    type="text"
                    id="location.lat"
                    name="location.lat"
                    value={formData.location.lat}
                    onChange={handleInputChange}
                    placeholder="Haritadan seçilecek"
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="location.lng" className="block text-xs text-gray-500 mb-1">Boylam (Longitude)</label>
                  <input
                    type="text"
                    id="location.lng"
                    name="location.lng"
                    value={formData.location.lng}
                    onChange={handleInputChange}
                    placeholder="Haritadan seçilecek"
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Yakındaki Yerler */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-800 mb-2">Yakın Çevre</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {nearbyPlacesList.map((place) => (
                  <div key={place} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`nearby-${place}`}
                      checked={formData.nearbyPlaces.includes(place)}
                      onChange={() => handleArrayChange(formData.nearbyPlaces, place, 'nearbyPlaces')}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`nearby-${place}`} className="text-sm text-gray-700">
                      {place}
                    </label>
                  </div>
                ))}
              </div>
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
                  <span className="text-sm text-gray-500">PNG, JPG, JPEG, WEBP dosyaları desteklenir</span>
                  <span className="text-xs text-gray-500 mt-2">En fazla 10 fotoğraf ekleyebilirsiniz</span>
                </label>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Mülk Fotoğrafı ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                          Ana Fotoğraf
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/dashboard/consultant/my-properties"
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
                  İlan Kaydediliyor...
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