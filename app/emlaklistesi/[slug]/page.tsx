"use client";

import { useState, useEffect, ReactNode, useRef } from "react";
import type React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import {
  MapPin,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Home,
  Square,
  Bed,
  Bath,
  Car,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Send,
  Mail,
  MessageCircle,
  DollarSign,
  User,
  Map,
  Navigation,
  Landmark,
  School,
  ShoppingBag,
  Train,
  Building,
  Coffee,
  Copy,
  Check,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";
import ScrollToTop from "@/components/scroll-to-top";
import Footer from "@/components/footer";
import Link from "next/link";
import { generateSlug } from "@/utils/helpers";
import { getPropertyBySlug } from "../../services/property.service";
import dynamic from "next/dynamic";

// Google Maps'i client tarafında dinamik olarak yükle
const MapWithNoSSR = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Harita yükleniyor...</div>
});

// Property tipi
interface PropertyType {
  currency: string;
  _id: string;
  id?: string | number;
  title: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  location?: {
    type?: string;
    coordinates?: number[];
    lat?: string | number;
    lng?: string | number;
  };
  address?: string;
  district?: string;
  city?: string;
  fullAddress?: string;
  type: string;
  status?: string;
  propertyType: string;
  category?: string;
  area: number;
  beds?: number;
  bedrooms?: string;
  baths?: number;
  bathrooms?: number;
  parking?: number | boolean;
  yearBuilt?: string;
  buildingAge?: number | string;
  image?: string;
  mainImage?: string;
  images: string[];
  description: string;
  features: string[] | string;
  nearbyPlaces?: string[] | string;
  agent: {
    slug: any;
    _id?: string;
    id?: string;
    name: string;
    phone: string;
    email: string;
    image: string;
    rating: number;
  };
  tag?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [relatedProperties, setRelatedProperties] = useState<PropertyType[]>([]);
  const [mapCoordinates, setMapCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [mapKey, setMapKey] = useState<number>(0); // Harita için yenileme anahtarı
  const [copied, setCopied] = useState(false); // Paylaşma butonu için durum
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobil menü için durum
  
  // Mobil menüyü aç/kapat
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // API'den ilan detayını ve benzer ilanları çek
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching property details for slug:', slug);
        const data = await getPropertyBySlug(slug);
        console.log('API response:', data);
        
        if (data && data.property) {
          setProperty(data.property);
          
          // Konum bilgilerini ayarla
          if (data.property.location) {
            try {
              // GeoJSON formatında koordinatlar
              if (data.property.location.coordinates && data.property.location.coordinates.length === 2) {
                const lat = Number(data.property.location.coordinates[1]);
                const lng = Number(data.property.location.coordinates[0]);
                
                if (!isNaN(lat) && !isNaN(lng)) {
                  console.log('Setting map coordinates from coordinates array:', lat, lng);
                  setMapCoordinates({ lat, lng });
                  setMapKey(prev => prev + 1);
                }
              } 
              // lat/lng formatı
              else if (data.property.location.lat && data.property.location.lng) {
                const lat = Number(data.property.location.lat);
                const lng = Number(data.property.location.lng);
                
                if (!isNaN(lat) && !isNaN(lng)) {
                  console.log('Setting map coordinates from lat/lng:', lat, lng);
                  setMapCoordinates({ lat, lng });
                  setMapKey(prev => prev + 1);
                }
              }
            } catch (error) {
              console.error('Error setting map coordinates:', error);
            }
          }
          
          // Benzer ilanları çek (eğer API dönerse)
          if (data.relatedProperties && Array.isArray(data.relatedProperties) && data.relatedProperties.length > 0) {
            console.log('Related properties found:', data.relatedProperties.length);
            setRelatedProperties(data.relatedProperties);
          } else {
            console.log('No related properties found in API response');
            setRelatedProperties([]);
          }
        } else {
          setError('İlan bulunamadı');
        }
      } catch (err: any) {
        console.error('Error fetching property:', err);
        setError(err.message || 'İlan yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPropertyDetails();
    }
  }, [slug]);

  // Sayfa yüklendiğinde haritayı tekrar render etmek için
  useEffect(() => {
    // Sayfa tam yüklendiğinde haritayı yeniden render et
    const timer = setTimeout(() => {
      if (mapCoordinates) {
        setMapKey(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [mapCoordinates]);

  // Özellikler ayrıştırma fonksiyonu
  const renderFeatures = () => {
    if (!property || !property.features) return null;
    
    let featuresArray: string[] = [];
    
    try {
      // Eğer özellikler string formatında geliyorsa (JSON string), onu diziye dönüştür
      if (typeof property.features === 'string') {
        console.log('Features is a string, parsing:', property.features);
        try {
          // JSON formatında mı kontrol et
          if (property.features.startsWith('[') && property.features.endsWith(']')) {
            featuresArray = JSON.parse(property.features);
          } else {
            // Basit string ise
            featuresArray = [property.features];
          }
        } catch (e) {
          console.error("JSON parse error:", e);
          // Hata durumunda string'i direkt olarak kullan
          featuresArray = [property.features];
        }
      } 
      // Eğer zaten bir dizi ise, doğrudan kullan
      else if (Array.isArray(property.features)) {
        console.log('Features is an array:', property.features);
        
        // Dizinin her öğesini kontrol et
        featuresArray = property.features.flatMap(feature => {
          if (typeof feature === 'string') {
            // Öğe bir string ve JSON gibi görünüyorsa parse etmeyi dene
            if (feature.startsWith('[') && feature.endsWith(']')) {
              try {
                const parsed = JSON.parse(feature);
                return Array.isArray(parsed) ? parsed : [feature];
              } catch (e) {
                return feature;
              }
            }
            return feature;
          }
          return String(feature);
        });
      }
      // Diğer durumlarda (örneğin tek bir değer), onu diziye çevir
      else {
        console.log('Features is something else:', property.features);
        featuresArray = [String(property.features)];
      }
    } catch (e) {
      console.error("Özellikler ayrıştırılamadı:", e, property.features);
      return <div className="text-red-500">Özellikler yüklenirken bir hata oluştu</div>;
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {featuresArray.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700 text-sm">{feature}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // Yakın yerler ayrıştırma fonksiyonu
  const renderNearbyPlaces = () => {
    if (!property || !property.nearbyPlaces) return null;
    
    let nearbyPlacesArray: string[] = [];
    
    try {
      // Eğer yakın yerler string formatında geliyorsa (JSON string), onu diziye dönüştür
      if (typeof property.nearbyPlaces === 'string') {
        console.log('NearbyPlaces is a string, parsing:', property.nearbyPlaces);
        try {
          // JSON formatında mı kontrol et
          if (property.nearbyPlaces.startsWith('[') && property.nearbyPlaces.endsWith(']')) {
            nearbyPlacesArray = JSON.parse(property.nearbyPlaces);
          } else {
            // Basit string ise
            nearbyPlacesArray = [property.nearbyPlaces];
          }
        } catch (e) {
          console.error("JSON parse error:", e);
          // Hata durumunda string'i direkt olarak kullan
          nearbyPlacesArray = [property.nearbyPlaces];
        }
      } 
      // Eğer zaten bir dizi ise, doğrudan kullan
      else if (Array.isArray(property.nearbyPlaces)) {
        console.log('NearbyPlaces is an array:', property.nearbyPlaces);
        
        // Dizinin her öğesini kontrol et
        nearbyPlacesArray = property.nearbyPlaces.flatMap(place => {
          if (typeof place === 'string') {
            // Öğe bir string ve JSON gibi görünüyorsa parse etmeyi dene
            if (place.startsWith('[') && place.endsWith(']')) {
              try {
                const parsed = JSON.parse(place);
                return Array.isArray(parsed) ? parsed : [place];
              } catch (e) {
                return place;
              }
            }
            return place;
          }
          return String(place);
        });
      }
    } catch (e) {
      console.error("Yakın yerler ayrıştırılamadı:", e, property.nearbyPlaces);
      return null;
    }
    
    // Yakın yer ikonu seç
    const getPlaceIcon = (placeName: string) => {
      const name = placeName.toLowerCase();
      if (name.includes("market") || name.includes("alışveriş")) return <ShoppingBag className="w-4 h-4 text-orange-500" />;
      if (name.includes("okul") || name.includes("üniversite")) return <School className="w-4 h-4 text-orange-500" />;
      if (name.includes("istasyon") || name.includes("durak")) return <Train className="w-4 h-4 text-orange-500" />;
      if (name.includes("park") || name.includes("bahçe")) return <Building className="w-4 h-4 text-orange-500" />;
      if (name.includes("kafe") || name.includes("restoran")) return <Coffee className="w-4 h-4 text-orange-500" />;
      return <Landmark className="w-4 h-4 text-orange-500" />;
    };
    
    if (nearbyPlacesArray.length === 0) return null;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {nearbyPlacesArray.map((place, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            {getPlaceIcon(place)}
            <span className="text-gray-700 text-sm">{place}</span>
          </div>
        ))}
      </div>
    );
  };

  // Paylaş fonksiyonu
  const handleShare = () => {
    const currentUrl = window.location.href;

    // Panoya kopyala
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // 2 saniye sonra durumu sıfırla
      },
      (err) => {
        console.error('Kopyalama hatası:', err);
        // Alternatif paylaşım yöntemi
        try {
          if (navigator.share) {
            navigator.share({
              title: property?.title || 'Emlak İlanı',
              text: `${property?.title} - ${formatPrice(property?.price || 0, property?.currency || 'TRY')}`,
              url: currentUrl,
            });
          }
        } catch (error) {
          console.error('Paylaşım hatası:', error);
        }
      }
    );
  };

  // Yükleme durumu
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="text-2xl font-semibold text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  // Hata durumu
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">İlan Bulunamadı</h2>
          <p className="text-gray-600 mb-6">{error || 'Aradığınız emlak ilanı sistemimizde bulunmamaktadır.'}</p>
          <Link href="/emlaklistesi" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium inline-block">
            Tüm İlanlara Dön
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Burada form verilerini API'ye gönderebilirsiniz
      // const response = await submitPropertyInquiry(property.id, commentForm);
      
      alert("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
      setCommentForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      alert("Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price: number, currency: string = 'TRY') => {
    if (!price) return '0';
    
    // Para birimi sembolünü belirle
    let currencySymbol = '₺';
    if (currency === 'USD') currencySymbol = '$';
    if (currency === 'EUR') currencySymbol = '€';
    
    // Sayıyı formatlı hale getir (binlik ayraçlar ile)
    const formattedNumber = price.toLocaleString('tr-TR');
    
    // Para birimi sembolü ve formatlanmış sayıyı birleştir
    return `${formattedNumber} ${currencySymbol}`;
  };

  // API URL'si
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Resim URL'sini formatlama fonksiyonu
  const formatImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;
    
    // Backendden gelen göreceli yolu tam URL'ye dönüştür
    return `https://api.villasantalya.com${imagePath}`;
  };

  // Oda ve banyo sayılarını doğru al
  const bedrooms = property.bedrooms || property.beds || 0;
  const bathrooms = property.bathrooms || property.baths || 0;
  
  // Adres bilgisini birleştir
  const fullAddress = property.fullAddress || 
    (property.address ? `${property.address}, ${property.district || ''}, ${property.city || ''}` : '');

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <Header/>
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Anasayfa
            </Link>
            <span>/</span>
            <Link href="/emlaklistesi" className="hover:text-orange-500 transition-colors">
              Emlak Listesi
            </Link>
            <span>/</span>
            <span className="text-orange-500 line-clamp-1">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Property Images */}
      <section className="py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[600px] rounded-xl overflow-hidden mb-4 md:mb-6">
            <Image
              src={formatImageUrl(property.images[currentImageIndex] || property.mainImage || '')}
              alt={property.title}
              fill
              className="object-cover"
            />

            {/* Image Navigation */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </>
            )}

            {/* Paylaş Butonu */}
            <div className="absolute top-2 md:top-4 right-2 md:right-4 flex space-x-2">
              <button 
                onClick={handleShare}
                className="w-8 h-8 md:w-12 md:h-12 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Bu ilanı paylaş"
              >
                {copied ? <Check className="w-4 h-4 md:w-6 md:h-6 text-green-500" /> : <Share2 className="w-4 h-4 md:w-6 md:h-6" />}
              </button>
            </div>

            {/* Type Badge */}
            <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-black/70 text-white px-2 py-1 md:px-3 md:py-1 rounded-md text-xs md:text-sm font-semibold">
              {property.type === 'sale' ? 'Satılık' : property.type === 'rent' ? 'Kiralık' : property.type}
            </div>

            {/* Tag Badge (if exists) */}
            {property.propertyType && (
              <div className="absolute top-2 md:top-4 left-16 md:left-24 bg-orange-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-md text-xs md:text-sm font-semibold">
                {property.propertyType}
              </div>
            )}

            {/* Image Counter */}
            {property.images && property.images.length > 1 && (
              <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-black/70 text-white px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {property.images && property.images.length > 1 && (
            <div className="flex space-x-2 md:space-x-4 overflow-x-auto pb-2 md:pb-4 scrollbar-hide">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-12 md:w-24 md:h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                    currentImageIndex === index ? "ring-2 ring-orange-500" : ""
                  }`}
                >
                  <Image 
                    src={formatImageUrl(image)} 
                    alt={`Thumbnail ${index + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Property Title & Price */}
      <section className="py-4 md:py-6 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{property.title}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-orange-500 flex-shrink-0" />
                <span className="text-sm md:text-base line-clamp-2">{fullAddress}</span>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end mt-3 lg:mt-0">
              {property.discountedPrice ? (
                <>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500">
                    {formatPrice(property.discountedPrice, property.currency || 'TRY')}
                  </div>
                  <div className="text-base md:text-lg line-through text-gray-400">
                    {formatPrice(property.price, property.currency || 'TRY')}
                  </div>
                </>
              ) : (
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500">
                  {formatPrice(property.price, property.currency || 'TRY')}
                </div>
              )}
              <div className="text-gray-500 mt-1 text-sm md:text-base">
                {property.status === 'sale' ? 'Satılık Fiyatı' : property.status === 'rent' ? 'Kiralık Fiyatı' : 'Fiyat'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6 md:space-y-8">
              {/* Property Stats */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Square className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                    </div>
                    <div className="text-base md:text-lg font-bold text-gray-900">{property.area} m²</div>
                    <div className="text-xs text-gray-600">Alan</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Bed className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                    </div>
                    <div className="text-base md:text-lg font-bold text-gray-900">{bedrooms}</div>
                    <div className="text-xs text-gray-600">Oda Sayısı</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Bath className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                    </div>
                    <div className="text-base md:text-lg font-bold text-gray-900">{bathrooms}</div>
                    <div className="text-xs text-gray-600">Banyo</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Car className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                    </div>
                    <div className="text-base md:text-lg font-bold text-gray-900">
                      {typeof property.parking === 'boolean' ? (property.parking ? 'Var' : 'Yok') : property.parking || 'Var'}
                    </div>
                    <div className="text-xs text-gray-600">Otopark</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h3>
                <div className="prose prose-gray max-w-none">
                  {property.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Özellikler</h3>
                {renderFeatures()}
              </div>

              {/* Nearby Places */}
              {property.nearbyPlaces && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Yakın Yerler</h3>
                  {renderNearbyPlaces()}
                </div>
              )}
              
              {/* Comment Form */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bu İlan Hakkında Bilgi Alın</h3>
                <p className="text-gray-600 mb-4 text-xs md:text-sm">
                  Bu emlak hakkında sorularınız varsa veya daha fazla bilgi almak istiyorsanız, aşağıdaki formu
                  doldurarak bizimle iletişime geçebilirsiniz.
                </p>

                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Adınız Soyadınız"
                        value={commentForm.name}
                        onChange={handleInputChange}
                        className="h-10 md:h-12 rounded-lg border-gray-200 text-gray-600 placeholder:text-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        name="email"
                        placeholder="E-posta Adresiniz"
                        value={commentForm.email}
                        onChange={handleInputChange}
                        className="h-10 md:h-12 rounded-lg border-gray-200 text-gray-600 placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Telefon Numaranız (Opsiyonel)"
                      value={commentForm.phone}
                      onChange={handleInputChange}
                      className="h-10 md:h-12 rounded-lg border-gray-200 text-gray-600 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      placeholder="Bu emlak hakkındaki sorularınız veya yorumlarınız..."
                      value={commentForm.message}
                      onChange={handleInputChange}
                      className="min-h-24 md:min-h-32 rounded-lg border-gray-200 text-gray-600 placeholder:text-gray-400 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 md:h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm md:text-base font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    İleti Gönder
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Card */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Emlak Danışmanı</h3>
                <div className="text-center">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-3">
                    <Image
                      src={formatImageUrl(property.agent?.image || '/placeholder-user.svg')}
                      alt={property.agent?.name || 'Emlak Danışmanı'}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h4 className="text-sm md:text-base font-bold text-gray-900 mb-2">{property.agent?.name || 'Emlak Danışmanı'}</h4>
                  {property.agent?.rating && (
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.floor(property.agent?.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                      <span className="text-xs md:text-sm text-gray-600 ml-1">({property.agent?.rating})</span>
                    </div>
                  )}

                  <div className="space-y-2 md:space-y-3">
                    {/* WhatsApp butonu */}
                    <Button 
                      className="w-full h-9 md:h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs md:text-sm font-semibold"
                      onClick={() => {
                        const formattedPhone = property.agent?.phone?.replace(/\D/g, '') || '';
                        const whatsappUrl = `https://wa.me/${formattedPhone.startsWith('90') ? formattedPhone : `90${formattedPhone}`}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                      WhatsApp
                    </Button>
                    
                    {/* Telefon butonu */}
                    <Button 
                      className="w-full h-9 md:h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs md:text-sm font-semibold"
                      onClick={() => {
                        window.location.href = `tel:${property.agent?.phone || ''}`;
                      }}
                    >
                      <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                      {property.agent?.phone || 'Telefon'}
                    </Button>
                    
                    {/* E-posta butonu */}
                    <Button
                      variant="outline"
                      className="w-full h-9 md:h-10 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-lg text-xs md:text-sm font-semibold bg-transparent"
                      onClick={() => {
                        const subject = `${property.title} - İlan Hakkında Bilgi Talebi`;
                        const body = `Merhaba ${property.agent?.name || 'Emlak Danışmanı'},\n\n${property.title} başlıklı ilan hakkında bilgi almak istiyorum.\n\nİlan Linki: ${window.location.href}\n\nTeşekkürler.`;
                        window.location.href = `mailto:${property.agent?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      }}
                    >
                      <Mail className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                      E-posta Gönder
                    </Button>

                    <Button
                      variant="secondary"
                      className="w-full h-9 md:h-10 text-xs md:text-sm"
                      onClick={() => {
                        const agentId = property.agent?._id || property.agent?.id;
                        if (agentId) {
                          router.push(`/danisman/${agentId}`);
                        }
                      }}
                    >
                      <User className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                      Profili Görüntüle
                    </Button>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Emlak Detayları</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-xs md:text-sm">Emlak Türü:</span>
                    <span className="font-medium text-gray-900 text-xs md:text-sm">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-xs md:text-sm">İlan Türü:</span>
                    <span className="font-medium text-gray-900 text-xs md:text-sm">
                      {property.type === 'sale' ? 'Satılık' : property.type === 'rent' ? 'Kiralık' : property.type || 'Emlak'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-xs md:text-sm"> Alan:</span>
                    <span className="font-medium text-gray-900 text-xs md:text-sm">{property.area} m²</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-xs md:text-sm">Oda Sayısı:</span>
                    <span className="font-medium text-gray-900 text-xs md:text-sm">{bedrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-xs md:text-sm">Banyo:</span>
                    <span className="font-medium text-gray-900 text-xs md:text-sm">{bathrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-xs md:text-sm">İlan No:</span>
                    <span className="font-medium text-gray-900 text-xs md:text-sm">
                      #{property._id ? property._id.toString().slice(-6).padStart(6, "0") : "------"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              {mapCoordinates && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Konum</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        className="text-xs p-1 h-auto"
                        onClick={() => setMapKey(prev => prev + 1)} // Haritayı yeniden yükle
                      >
                        <Map className="w-3 h-3 mr-1" />
                        Haritayı Yenile
                      </Button>
                      <Button 
                        variant="outline"
                        className="text-xs p-1 h-auto"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${mapCoordinates.lat},${mapCoordinates.lng}`, '_blank')}
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        Google Maps
                      </Button>
                    </div>
                  </div>
                  <div className="h-48 md:h-64 rounded-lg overflow-hidden">
                    <MapWithNoSSR 
                      key={`map-${mapKey}-${mapCoordinates.lat}-${mapCoordinates.lng}`}
                      lat={mapCoordinates.lat} 
                      lng={mapCoordinates.lng} 
                      zoom={15}
                      markerTitle={property.title}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      {relatedProperties && relatedProperties.length > 0 ? (
        <section className="py-8 md:py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Benzer Emlaklar</h2>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Size uygun diğer emlak seçeneklerini keşfedin</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {relatedProperties.map((relatedProperty) => (
                <Link
                  key={relatedProperty._id || relatedProperty.id}
                  href={`/emlaklistesi/${relatedProperty.slug || relatedProperty._id || relatedProperty.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <Image
                      src={formatImageUrl(relatedProperty.mainImage || relatedProperty.image || '/placeholder.svg')}
                      alt={relatedProperty.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Type Badge */}
                    <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold">
                     {relatedProperty.type === 'sale' ? 'Satılık' : relatedProperty.type === 'rent' ? 'Kiralık' : relatedProperty.type}
                    </div>
                    
                    {/* Tag */}
                    {relatedProperty.propertyType && (
                      <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                        {relatedProperty.propertyType}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300 line-clamp-1">
                      {relatedProperty.title}
                    </h3>

                    <div className="flex items-start text-gray-600 mb-3">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 mt-0.5 flex-shrink-0 text-orange-500" />
                      <span className="text-xs md:text-sm line-clamp-1">
                        {relatedProperty.fullAddress || 
                          (relatedProperty.address ? 
                            `${relatedProperty.address}, ${relatedProperty.district || ''}, ${relatedProperty.city || ''}` : '')}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center mb-3">
                      <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-1 text-orange-500" />
                      <div className="flex items-center space-x-2">
                        {relatedProperty.discountedPrice ? (
                          <>
                            <span className="font-bold text-orange-500 text-xs md:text-sm">
                              {formatPrice(relatedProperty.discountedPrice, relatedProperty.currency || 'TRY')}
                            </span>
                            <span className="text-xs line-through text-gray-400">
                              {formatPrice(relatedProperty.price, relatedProperty.currency || 'TRY')}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-orange-500 text-xs md:text-sm">
                            {formatPrice(relatedProperty.price, relatedProperty.currency || 'TRY')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Home className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-500" />
                        <span className="text-xs text-gray-600">{relatedProperty.propertyType}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-500" />
                        <span className="text-xs text-gray-600">{relatedProperty.area} m²</span>
                      </div>
                      {(relatedProperty.beds || relatedProperty.bedrooms) && (
                        <div className="flex items-center">
                          <Bed className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-500" />
                          <span className="text-xs text-gray-600">{relatedProperty.beds || relatedProperty.bedrooms} Oda</span>
                        </div>
                      )}
                      {(relatedProperty.baths || relatedProperty.bathrooms) && (
                        <div className="flex items-center">
                          <Bath className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-500" />
                          <span className="text-xs text-gray-600">{relatedProperty.baths || relatedProperty.bathrooms} Banyo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}