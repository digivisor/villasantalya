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
  status?: string;
  isApproved?: boolean | string;
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

  // API'den verileri çek ve filtrele!
  useEffect(() => {
    const fetchProperties = async (): Promise<void> => {
      try {
        setLoading(true);

        let typeParam: string | undefined = undefined;
        if (activeTab === "sale") typeParam = "sale";
        else if (activeTab === "rent") typeParam = "rent";
        else if (activeTab === "long-rent") typeParam = "long-rent";

        const response = await propertyService.getAllProperties({
          type: typeParam,
          limit: 32,
          sort: 'newest'
        });

        if (response && response.properties) {
          // Sadece aktif ve onaylı olanlar
          const filtered = response.properties.filter(
            (p: Property) =>
              p.status === "active" &&
              (p.isApproved === true || p.isApproved === "true")
          );
          setProperties(filtered);
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
    return `https://api.villasantalya.com/${imagePath}`;
  };

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price: number, currency: string = 'TRY'): string => {
    if (!price) return '0';
    let currencySymbol = '₺';
    if (currency === 'USD') currencySymbol = '$';
    if (currency === 'EUR') currencySymbol = '€';
    const formattedNumber = price.toLocaleString('tr-TR');
    return `${formattedNumber} ${currencySymbol}`;
  };

  // Emlak detay sayfasına yönlendirme
  const handlePropertyClick = (property: Property): void => {
    router.push(`/emlaklistesi/${property.slug || property._id}`);
  };

  // Favorilere ekle butonu tıklama
  const handleAddToFavorites = (e: React.MouseEvent, propertyId: string): void => {
    e.stopPropagation();
    // Favorilere ekleme işlevi burada implementasyonu yapılacak
  };

  // Hızlı görüntüleme butonu tıklama
  const handleQuickView = (e: React.MouseEvent, property: Property): void => {
    e.stopPropagation();
    // Hızlı görüntüleme modalı işlevi burada implementasyonu yapılacak
  };

  // Property Type Badge
  const getTypeBadge = (type: string) => {
    if (type === "sale") return "Satılık";
    if (type === "rent") return "Kiralık";
    if (type === "long-rent") return "Uzun Dönem";
    return "";
  };

  return (
    <section className="py-10 px-2 sm:px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-orange-500 text-xs sm:text-sm font-semibold mb-4 tracking-wider uppercase">
            VİLLAS ANTALYA'YI KEŞFEDİN
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Görkemli Deneyim
          </h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 sm:px-8 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-500 hover:scale-105"
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-orange-500" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
            <Home className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">İlan Bulunamadı</h3>
            <p className="text-gray-500">Seçtiğiniz filtreye uygun ilan bulunmamaktadır.</p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="relative">
            {/* Responsive grid: 1 on xs, 2 on sm, 4 on lg up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {getCurrentProperties().map((property) => (
                <div
                  key={property._id}
                  onClick={() => handlePropertyClick(property)}
                  className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={formatImageUrl(property.mainImage)}
                      alt={property.title || "Emlak Görseli"}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-400"
                    />
                    {/* Price Tag */}
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-xl shadow font-bold text-base sm:text-lg flex items-center">
                      <span>{formatPrice(property.price, property.currency)}</span>
                      {property.discountedPrice && (
                        <span className="ml-2 text-xs sm:text-sm line-through text-orange-200 font-normal">
                          {formatPrice(property.discountedPrice, property.currency)}
                        </span>
                      )}
                    </div>
                    {/* Type Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded font-medium text-xs sm:text-sm">
                      {getTypeBadge(property.type)}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-orange-500 mb-2 sm:mb-4">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {property.address 
                          ? `${property.address}, ${property.district || ''}, ${property.city || ''}` 
                          : `${property.district || ''}, ${property.city || ''}`}
                      </span>
                    </div>

                    {/* Stats section */}
                    <div className="flex flex-row justify-between items-center bg-gray-50 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                      <div className="flex items-center space-x-1">
                        <Square className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{property.area} m²</span>
                      </div>
                      {(property.bedrooms || property.beds) && (
                        <div className="flex items-center space-x-1">
                          <Bed className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">
                            {(property.bedrooms ?? property.beds)} Yatak
                          </span>
                        </div>
                      )}
                      {(property.bathrooms || property.baths) && (
                        <div className="flex items-center space-x-1">
                          <Bath className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{property.bathrooms ?? property.baths} Banyo</span>
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
                  className="hidden lg:flex absolute left-[-32px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full items-center justify-center shadow-lg transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="hidden lg:flex absolute right-[-32px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full items-center justify-center shadow-lg transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
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
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-orange-500 w-8" : "bg-gray-300 w-2 hover:bg-orange-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}