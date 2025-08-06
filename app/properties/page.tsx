  'use client';

  import { useState, useEffect } from "react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    ChevronRight,
    ChevronLeft,
    Bath,
    Loader2,
    Menu,
    X
  } from "lucide-react";
  import Image from "next/image";
  import ScrollToTop from "@/components/scroll-to-top";
  import Footer from "@/components/footer";
  import Link from "next/link";
  import { getAllProperties } from "../services/property.service";
  import { useToast } from "../admin/components/ui/toast-context";

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.includes('/api')
      ? process.env.NEXT_PUBLIC_API_URL.split('/api')[0]  // '/api' içeriyorsa, onu kaldır
      : process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:3000"; // Varsayılan değer

  // Log the API base URL for debugging
    console.log("API Base URL:", apiBaseUrl);

  // Property türü tanımı
  interface Property {
    type: string; // "sale" veya "rent"
    _id: string;
    title: string;
    price: number;
    discountedPrice?: number;
    location?: {
      lat: string;
      lng: string;
    };
    address: string;
    district: string;
    city: string;
    status: string; // "active", "pending", "rejected", "sold"
    propertyType: string;
    category: string;
    area: number;
    bedrooms: string;
    bathrooms: number;
    mainImage: string;
    images: string[];
    features: string[];
    nearbyPlaces: string[];
    isApproved: boolean;
    agent: {
      _id: string;
      name: string;
      image?: string;
    };
    createdAt: string;
    updatedAt: string;
    slug?: string; // Slug opsiyonel olarak eklendi
  }

  export default function PropertiesPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [propertyType, setPropertyType] = useState("all");
    const [listingType, setListingType] = useState("all");
    const [location, setLocation] = useState("");
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [sortBy, setSortBy] = useState("newest");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    // Mobil menüyü aç/kapat
    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
    };

    // API'den emlak verilerini çek
    useEffect(() => {
      const fetchProperties = async () => {
        try {
          setLoading(true);
          const response = await getAllProperties();
          setProperties(response.properties);
          setFilteredProperties(response.properties);
        } catch (error: any) {
          console.error('Error fetching properties:', error);
          toast({
            title: "Hata!",
            description: "İlanlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchProperties();
    }, [toast]);

    // Filtreleme işlevi
    useEffect(() => {
      if (properties.length === 0) return;
      
      let result = [...properties];

      result = result.filter(property => property.status === "active");

      // Anahtar kelime filtresi
      if (searchKeyword) {
        result = result.filter(property => 
          property.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          property.district.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          property.city.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          property.address.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }
      
      // Emlak tipi filtresi
      if (propertyType && propertyType !== 'all') {
        result = result.filter(property => property.propertyType === propertyType);
      }
      
      // İlan tipi filtresi
      if (listingType && listingType !== 'all') {
        // Doğrudan value değerini kullanabiliriz çünkü value'lar sale ve rent
        result = result.filter(property => property.type === listingType);
      }
      
      // Konum filtresi
      if (location) {
        result = result.filter(property => 
          property.district.toLowerCase().includes(location.toLowerCase()) ||
          property.city.toLowerCase().includes(location.toLowerCase()) ||
          property.address.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      // Sıralama
      switch (sortBy) {
        case "newest":
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case "oldest":
          result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case "price-asc":
          result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
          break;
        case "price-desc":
          result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
          break;
      }
      
      setFilteredProperties(result);
      setCurrentPage(1); // Filtreleme yapıldığında ilk sayfaya dön
    }, [searchKeyword, propertyType, listingType, location, sortBy, properties]);

    // Arama işlevi
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      // Filtreleme useEffect ile otomatik olarak yapılacak
    };

    // Sayfa değişikliği
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Sıralama değişikliği
    const handleSortChange = (value: string) => {
      setSortBy(value);
    };

    // Geçerli sayfadaki öğeleri al
    const currentProperties = filteredProperties.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    // Pagination için sayfa numaraları
    const renderPageNumbers = () => {
      const pageNumbers = [];
      const totalPageCount = Math.ceil(filteredProperties.length / itemsPerPage);
      
      // Gösterilecek maksimum sayfa numarası sayısı
      const maxPageNumbers = 5;
      
      // Başlangıç ve bitiş sayfa numaralarını hesapla
      let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
      let endPage = Math.min(totalPageCount, startPage + maxPageNumbers - 1);
      
      // Başlangıç sayfasını ayarla (sondan başa doğru)
      if (endPage - startPage + 1 < maxPageNumbers) {
        startPage = Math.max(1, endPage - maxPageNumbers + 1);
      }
      
      // İlk sayfa ve ellipsis
      if (startPage > 1) {
        pageNumbers.push(
          <Button
            key={1}
            onClick={() => handlePageChange(1)}
            variant="outline"
            className="h-10 w-10 p-0 text-gray-600 hover:text-orange-500 hover:border-orange-500"
          >
            1
          </Button>
        );
        if (startPage > 2) {
          pageNumbers.push(
            <span key="start-ellipsis" className="px-2">
              ...
            </span>
          );
        }
      }
      
      // Ortadaki sayfa numaraları
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <Button
            key={i}
            onClick={() => handlePageChange(i)}
            variant={currentPage === i ? "default" : "outline"}
            className={`h-10 w-10 p-0 ${
              currentPage === i
                ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                : "text-gray-600 hover:text-orange-500 hover:border-orange-500"
            }`}
          >
            {i}
          </Button>
        );
      }
      
      // Son sayfa ve ellipsis
      if (endPage < totalPageCount) {
        if (endPage < totalPageCount - 1) {
          pageNumbers.push(
            <span key="end-ellipsis" className="px-2">
              ...
            </span>
          );
        }
        pageNumbers.push(
          <Button
            key={totalPageCount}
            onClick={() => handlePageChange(totalPageCount)}
            variant="outline"
            className="h-10 w-10 p-0 text-gray-600 hover:text-orange-500 hover:border-orange-500"
          >
            {totalPageCount}
          </Button>
        );
      }
      
      return pageNumbers;
    };

    // Fiyat formatlama fonksiyonu
    const formatPrice = (price: number) => {
      return price.toLocaleString('tr-TR') + ' ₺';
    };

    // API'den gelen emlak tiplerini al
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

    // API'den gelen ilçeleri al
    const districts = [
      'Muratpaşa', 'Konyaaltı', 'Kepez', 'Döşemealtı', 'Aksu', 'Manavgat',
      'Alanya', 'Serik', 'Side', 'Belek', 'Lara', 'Kaş', 'Kalkan', 'Kemer'
    ];

    return (
      <div className="min-h-screen bg-white">
        {/* Top Bar */}
        <div className="bg-gray-800/90 text-white text-sm py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-2 sm:mb-0">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Lara, Muratpaşa Antalya</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>+90 551 389 52 55</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Pzt to Cmt - 09:00 to 21:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <Facebook className="w-4 h-4 hover:text-orange-500 cursor-pointer" />
                <Twitter className="w-4 h-4 hover:text-orange-500 cursor-pointer" />
                <Youtube className="w-4 h-4 hover:text-orange-500 cursor-pointer" />
                <Instagram className="w-4 h-4 hover:text-orange-500 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <header className="bg-gray-900/95 backdrop-blur-sm text-white py-4 px-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/villasantalya-logo.png"
                  alt="VillasAntalya Logo"
                  width={80}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:text-orange-500 transition-colors">
                Anasayfa
              </Link>
              <Link href="/about" className="hover:text-orange-500 transition-colors">
                Hakkımızda
              </Link>
              <Link href="/properties" className="text-orange-500 hover:text-orange-400 font-medium">
                Emlak Listesi
              </Link>
              <Link href="/blog" className="hover:text-orange-500 transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="hover:text-orange-500 transition-colors">
                İletişim
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white focus:outline-none" 
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden bg-gray-800 py-4 px-4 mt-2 rounded-lg">
              <div className="flex flex-col space-y-3">
                <Link href="/" className="text-white hover:text-orange-500 transition-colors py-2">
                  Anasayfa
                </Link>
                <Link href="/about" className="text-white hover:text-orange-500 transition-colors py-2">
                  Hakkımızda
                </Link>
                <Link href="/properties" className="text-orange-500 hover:text-orange-400 font-medium py-2">
                  Emlak Listesi
                </Link>
                <Link href="/blog" className="text-white hover:text-orange-500 transition-colors py-2">
                  Blog
                </Link>
                <Link href="/contact" className="text-white hover:text-orange-500 transition-colors py-2">
                  İletişim
                </Link>
              </div>
            </nav>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative h-72 md:h-96 overflow-hidden">
          <Image src="/about-hero-bg.jpg" alt="Properties Hero" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Emlak Listesi</h1>
                <div className="flex items-center space-x-2 text-base md:text-lg">
                  <Link href="/" className="hover:text-orange-500 transition-colors">
                    Anasayfa
                  </Link>
                  <span>-</span>  
                  <span className="text-orange-500">Emlak Listesi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 md:py-16 px-4 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl p-4 md:p-8 shadow-lg">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Keyword Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Anahtar Kelime</label>
                    <Input
                      placeholder="İlan adı, konum veya adres"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 text-gray-600 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Emlak Türü</label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 text-gray-600">
                        <SelectValue placeholder="Tüm Emlak Türleri" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Emlak Türleri</SelectItem>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Listing Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">İlan Türü</label>
                    <Select value={listingType} onValueChange={setListingType}>
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 text-gray-600">
                        <SelectValue placeholder="Tüm İlanlar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm İlanlar</SelectItem>
                        <SelectItem value="sale">Satılık</SelectItem>
                        <SelectItem value="rent">Kiralık</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Konum</label>
                    <div className="relative">
                      <Input
                        placeholder="Şehir, ilçe veya mahalle"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-12 rounded-xl border-gray-200 text-gray-600 placeholder:text-gray-400 pr-12"
                      />
                      <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-1/2 md:w-1/3 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-semibold"
                  >
                    Emlak Ara
                  </Button>
                </div>
              </form>
            </div>

            {/* Sonuç Sayısı */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 mb-6 px-2 gap-4 sm:gap-0">
              <div className="text-gray-700 text-center sm:text-left">
                <span className="font-semibold">{filteredProperties.length}</span> ilan bulundu
                {filteredProperties.length > 0 && (
                  <span> - Sayfa {currentPage}/{Math.ceil(filteredProperties.length / itemsPerPage)}</span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Sırala:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40 h-10 border-gray-300 text-gray-700">
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">En Yeni</SelectItem>
                    <SelectItem value="oldest">En Eski</SelectItem>
                    <SelectItem value="price-asc">Fiyat (Artan)</SelectItem>
                    <SelectItem value="price-desc">Fiyat (Azalan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-8 px-4 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                <p className="mt-4 text-lg text-gray-600">İlanlar yükleniyor...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProperties.length > 0 ? (
                    currentProperties.map((property) => (
                      <Link
                        key={property._id}
                        href={`/properties/${property.slug || property._id}`}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group flex flex-col cursor-pointer h-full"
                      >
                        {/* Property Image */}
                        <div className="relative h-52 overflow-hidden">
                          <Image
                            src={
                              property.mainImage
                                ? property.mainImage.startsWith('http')
                                  ? property.mainImage
                                  : `${apiBaseUrl}${property.mainImage}`
                                : "/placeholder.svg"
                            }
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Type Badge */}
                          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold">
                            {property.type === 'sale' ? 'Satılık' : property.type === 'rent' ? 'Kiralık' : property.type}
                          </div>
                          
                          {/* Tag - İlk feature'ı göster */}
                          {property.propertyType && (
                            <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                              {property.propertyType}
                            </div>
                          )}
                        </div>

                        {/* Property Details */}
                        <div className="p-5 flex flex-col flex-grow justify-between">
                          <div>
                            {/* Title */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300 line-clamp-1">
                              {property.title}
                            </h3>

                            {/* Location */}
                            <div className="flex items-start text-gray-600 mb-3">
                              <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-orange-500" />
                              <span className="text-sm line-clamp-1">
                                {property.district}, {property.city}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center mb-4">
                              <div className="flex items-center space-x-2">
                                {property.discountedPrice ? (
                                  <>
                                    <span className="font-bold text-orange-500">{formatPrice(property.discountedPrice)}</span>
                                    <span className="text-sm line-through text-gray-400">{formatPrice(property.price)}</span>
                                  </>
                                ) : (
                                  <span className="font-bold text-orange-500">{formatPrice(property.price)}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mt-auto pt-3 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center">
                                <Home className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600 truncate">{property.propertyType}</span>
                              </div>
                              <div className="flex items-center">
                                <Square className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{property.area} m²</span>
                              </div>
                              {property.bedrooms ? (
                                <div className="flex items-center">
                                  <Bed className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-600">{property.bedrooms}</span>
                                </div>
                              ) : null}
                              {property.bathrooms > 0 && (
                                <div className="flex items-center">
                                  <Bath className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-600">{property.bathrooms} Banyo</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 py-16 text-center">
                      <div className="bg-white p-8 rounded-xl shadow">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Aradığınız kriterlere uygun ilan bulunamadı</h3>
                        <p className="text-gray-600 mb-4">Farklı anahtar kelimeler ile tekrar arama yapabilirsiniz</p>
                        <Button 
                          onClick={() => {
                            setSearchKeyword("");
                            setPropertyType("all");
                            setListingType("all");
                            setLocation("");
                          }}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Tüm İlanları Göster
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pagination - 8'den fazla ilan varsa göster */}
                {filteredProperties.length > itemsPerPage && (
                  <div className="flex flex-wrap justify-center items-center gap-2 mt-12">
                    {/* Önceki Sayfa Butonu */}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-10 px-3 py-0"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      <span>Önceki</span>
                    </Button>
                    
                    {/* Sayfa Numaraları */}
                    <div className="flex flex-wrap items-center gap-2">
                      {renderPageNumbers()}
                    </div>
                    
                    {/* Sonraki Sayfa Butonu */}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(filteredProperties.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(filteredProperties.length / itemsPerPage)}
                      className="h-10 px-3 py-0"
                    >
                      <span>Sonraki</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Scroll to Top */}
        <ScrollToTop />
      </div>
    );
  }