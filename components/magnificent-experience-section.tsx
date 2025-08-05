"use client"
import { useState, useEffect, JSX } from "react"
import {
  MapPin,
  Square,
  Bed,
  Bath,
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
  Home,
  Key,
  Calendar,
  DollarSign,
  Loader2
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import propertyService from "../app/services/property.service"

// Property tipini tanımla
interface Property {
  _id: string;
  title: string;
  slug?: string;
  price: number;
  discountedPrice?: number;
  currency?: string;
  address?: string;
  district?: string;
  city?: string;
  area: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  baths?: number;
  mainImage: string;
  type: 'sale' | 'rent' | 'long-rent';
}

// Tab tipini tanımla
interface FilterTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const filterTabs: FilterTab[] = [
  { id: "all", label: "Tüm Mülkler", icon: Home },
  { id: "sale", label: "Satılık", icon: Key },
  { id: "rent", label: "Kiralık", icon: DollarSign },
  { id: "long-rent", label: "Uzun Dönem Kiralama", icon: Calendar },
]

export default function MagnificentExperienceSection(): JSX.Element {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerSlide = 4;

  // API'den verileri çek
  useEffect(() => {
    const fetchProperties = async (): Promise<void> => {
      try {
        setLoading(true);
        
        // Aktif taba göre filtre uygula
        const typeParam = activeTab === "all" ? undefined : activeTab;
        
        const response = await propertyService.getAllProperties({
          type: typeParam,
          limit: 12,
          sort: 'newest'
        });
        
        if (response && response.properties) {
          setProperties(response.properties);
        } else {
          setProperties([]);
        }
        
        setError(null);
      } catch (err: any) {
        console.error("Emlak verileri çekilirken hata:", err);
        setError(err.message || "Veriler yüklenirken bir hata oluştu");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [activeTab]);

  const totalSlides = Math.ceil(properties.length / itemsPerSlide);

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, totalSlides));
  }

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, totalSlides)) % Math.max(1, totalSlides));
  }

  const getCurrentProperties = (): Property[] => {
    const startIndex = currentSlide * itemsPerSlide;
    return properties.slice(startIndex, startIndex + itemsPerSlide);
  }

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
    setCurrentSlide(0); // Reset slide when filter changes
  }

  // Resim URL'si formatlama fonksiyonu
  const formatImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;
    
    // Backendden gelen göreceli yolu tam URL'ye dönüştür
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return `${apiBaseUrl.replace('/api', '')}${imagePath}`;
  };

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price: number, currency: string = 'TRY'): string => {
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

  // Emlak detay sayfasına yönlendirme
  const handlePropertyClick = (property: Property): void => {
    router.push(`/properties/${property.slug || property._id}`);
  };

  // Favorilere ekle butonu tıklama
  const handleAddToFavorites = (e: React.MouseEvent, propertyId: string): void => {
    e.stopPropagation(); // Ana kart tıklama işlevini engelle
    console.log('Favorilere eklendi:', propertyId);
    // Favorilere ekleme işlevi burada implementasyonu yapılacak
  };
  
  // Hızlı görüntüleme butonu tıklama
  const handleQuickView = (e: React.MouseEvent, property: Property): void => {
    e.stopPropagation(); // Ana kart tıklama işlevini engelle
    console.log('Hızlı görüntüleme:', property.title);
    // Hızlı görüntüleme modalı işlevi burada implementasyonu yapılacak
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-orange-500 text-sm font-semibold mb-4 tracking-wider uppercase">
            VİLLAS ANTALYA'YI KEŞFEDİN
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Görkemli Deneyim
          </h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-500 hover:scale-105"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && properties.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">İlan Bulunamadı</h3>
            <p className="text-gray-500">Seçtiğiniz filtreye uygun ilan bulunmamaktadır.</p>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && properties.length > 0 && (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {getCurrentProperties().map((property) => (
                <div
                  key={property._id}
                  onClick={() => handlePropertyClick(property)}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer hover:scale-105 border border-gray-100"
                >
                  {/* Property Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={formatImageUrl(property.mainImage)}
                      alt={property.title || "Emlak Görseli"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Price Tag */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-2xl shadow-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{formatPrice(property.price, property.currency)}</span>
                        {property.discountedPrice && (
                          <span className="text-sm line-through text-orange-200">
                            {formatPrice(property.discountedPrice, property.currency)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        className="w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 hover:scale-110"
                        onClick={(e) => handleAddToFavorites(e, property._id)}
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                      <button 
                        className="w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 hover:scale-110"
                        onClick={(e) => handleQuickView(e, property)}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Property Type Badge */}
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-medium">
                      {property.type === 'sale' ? 'Satılık' : property.type === 'rent' ? 'Kiralık' : 'Uzun Dönem'}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                      {property.title}
                    </h3>

                    <div className="flex items-start text-orange-500 mb-4">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {property.address 
                          ? `${property.address}, ${property.district || ''}, ${property.city || ''}` 
                          : `${property.district || ''}, ${property.city || ''}`}
                      </span>
                    </div>

                    {/* Property Stats */}
                    <div className="flex items-center justify-between text-gray-600 text-sm bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center space-x-1">
                        <Square className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{property.area} m²</span>
                      </div>
                      
                      {(property.bedrooms || property.beds) && (
                        <div className="flex items-center space-x-1">
                          <Bed className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{property.bedrooms || property.beds} Yatak</span>
                        </div>
                      )}
                      
                      {(property.bathrooms || property.baths) && (
                        <div className="flex items-center space-x-1">
                          <Bath className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{property.bathrooms || property.baths} Banyo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute -left-16 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Pagination Dots */}
        {!loading && !error && totalSlides > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-orange-500 w-8" : "bg-gray-300 hover:bg-orange-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}