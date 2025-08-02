"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  DollarSign
} from "lucide-react"
import Image from "next/image"
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"
import Link from "next/link"

// Emlak verileri - toplam 19 ilan
const properties = [
  {
    id: 1,
    title: "Vali Konakları – Cem Uzan",
    price: 2850000,
    discountedPrice: 2650000,
    location: "Lara, Antalya",
    fullAddress: "Antalya Vali Konakları, Lara Muratpaşa, TR 07060",
    type: "Satılık",
    propertyType: "Daire",
    area: 155,
    beds: 3,
    baths: 2,
    image: "/slider-1.jpg",
    tag: "Öne Çıkan",
    features: ["Havuz", "Otopark", "Güvenlik", "Asansör"]
  },
  {
    id: 2,
    title: "Lara Lüks Rezidans",
    price: 4200000,
    location: "Lara, Antalya",
    fullAddress: "Lara Kundu Mahallesi, Antalya, TR 07110",
    type: "Satılık",
    propertyType: "Apartman",
    area: 180,
    beds: 3,
    baths: 2,
    image: "/slider-1.jpg",
    tag: "Yeni",
    features: ["Havuz", "Spor Salonu", "Otopark", "Güvenlik"]
  },
  {
    id: 3,
    title: "Konyaaltı Deniz Manzaralı",
    price: 3750000,
    discountedPrice: 3490000,
    location: "Konyaaltı, Antalya",
    fullAddress: "Konyaaltı Sahil, Antalya, TR 07050",
    type: "Satılık",
    propertyType: "Apartman",
    area: 165,
    beds: 2,
    baths: 1,
    image: "/slider-1.jpg",
    tag: "İndirimli",
    features: ["Deniz Manzarası", "Otopark", "Asansör"]
  },
  {
    id: 4,
    title: "Muratpaşa Modern Villa",
    price: 8500000,
    location: "Muratpaşa, Antalya",
    fullAddress: "Muratpaşa Merkez, Antalya, TR 07100",
    type: "Satılık",
    propertyType: "Villa",
    area: 320,
    beds: 4,
    baths: 3,
    image: "/slider-1.jpg",
    tag: "Lüks",
    features: ["Havuz", "Bahçe", "Güvenlik", "Otopark", "Jakuzi"]
  },
  {
    id: 5,
    title: "Kepez Bahçeli Konut",
    price: 2100000,
    location: "Kepez, Antalya",
    fullAddress: "Kepez Santral Mahallesi, Antalya, TR 07200",
    type: "Satılık",
    propertyType: "Villa",
    area: 250,
    beds: 3,
    baths: 2,
    image: "/slider-1.jpg",
    features: ["Bahçe", "Otopark", "Çocuk Parkı"]
  },
  {
    id: 6,
    title: "Aksu Yeni Proje",
    price: 1850000,
    location: "Aksu, Antalya",
    fullAddress: "Aksu Merkez, Antalya, TR 07112",
    type: "Kiralık",
    propertyType: "Dükkan",
    area: 95,
    beds: 2,
    baths: 1,
    image: "/slider-1.jpg",
    tag: "Yeni Proje",
    features: ["Merkezi Konum", "Metro", "Otopark"]
  },
  {
    id: 7,
    title: "Döşemealtı Ticari Alan",
    price: 5200000,
    location: "Döşemealtı, Antalya",
    fullAddress: "Döşemealtı Çamlıbel, Antalya, TR 07190",
    type: "Satılık",
    propertyType: "Ticari",
    area: 450,
    image: "/slider-1.jpg",
    features: ["Yüksek Tavan", "Otopark", "Güvenlik"]
  },
  {
    id: 8,
    title: "Serik Sahil Konakları",
    price: 6750000,
    discountedPrice: 6250000,
    location: "Serik, Antalya",
    fullAddress: "Serik Belek, Antalya, TR 07506",
    type: "Kiralık",
    propertyType: "Dükkan",
    area: 280,
    beds: 1,
    baths: 1,
    image: "/slider-1.jpg",
    tag: "İndirimli",
    features: ["Denize Sıfır", "Havuz", "Otopark", "Güvenlik"]
  },
  {
    id: 9,
    title: "Belek Golf Manzaralı Villa",
    price: 7500000,
    location: "Belek, Antalya",
    fullAddress: "Belek Golf Resort, Antalya, TR 07506",
    type: "Satılık",
    propertyType: "Villa",
    area: 350,
    beds: 5,
    baths: 3,
    image: "/slider-1.jpg",
    tag: "Premium",
    features: ["Golf Sahası", "Havuz", "Otopark", "Güvenlik", "Bahçe"]
  },
  {
    id: 10,
    title: "Alanya Deniz Manzaralı Daire",
    price: 3200000,
    location: "Alanya, Antalya",
    fullAddress: "Alanya Merkez, Antalya, TR 07400",
    type: "Satılık",
    propertyType: "Daire",
    area: 140,
    beds: 2,
    baths: 2,
    image: "/slider-1.jpg",
    features: ["Deniz Manzarası", "Havuz", "Spor Salonu", "Güvenlik"]
  },
  // 9 Ek İlan
  {
    id: 11,
    title: "Side Lüks Villa",
    price: 5850000,
    discountedPrice: 5500000,
    location: "Side, Antalya",
    fullAddress: "Side Kumköy Mahallesi, Manavgat, Antalya, TR 07330",
    type: "Satılık",
    propertyType: "Villa",
    area: 280,
    beds: 4,
    baths: 3,
    image: "/slider-1.jpg",
    tag: "İndirimli",
    features: ["Havuz", "Denize Yakın", "Güvenlik", "Bahçe"]
  },
  {
    id: 12,
    title: "Kalkan Deniz Manzaralı Villa",
    price: 12500000,
    location: "Kalkan, Antalya",
    fullAddress: "Kalkan Kışla, Kaş, Antalya, TR 07580",
    type: "Satılık",
    propertyType: "Villa",
    area: 420,
    beds: 5,
    baths: 4,
    image: "/slider-1.jpg",
    tag: "Ultra Lüks",
    features: ["Sonsuzluk Havuzu", "Panoramik Deniz Manzarası", "Özel Plaj", "Akıllı Ev"]
  },
  {
    id: 13,
    title: "Finike Sahil Dairesi",
    price: 1950000,
    location: "Finike, Antalya",
    fullAddress: "Finike Sahil Mahallesi, Antalya, TR 07740",
    type: "Satılık",
    propertyType: "Daire",
    area: 110,
    beds: 2,
    baths: 1,
    image: "/slider-1.jpg",
    features: ["Deniz Manzarası", "Merkezi Konum", "Balkon"]
  },
  {
    id: 14,
    title: "Kemer Merkez Stüdyo",
    price: 8000,
    location: "Kemer, Antalya",
    fullAddress: "Kemer Merkez, Antalya, TR 07980",
    type: "Kiralık",
    propertyType: "Daire",
    area: 45,
    beds: 1,
    baths: 1,
    image: "/slider-1.jpg",
    tag: "Aylık",
    features: ["Havuz", "Fitness", "Klima"]
  },
  {
    id: 15,
    title: "Gazipaşa Yeni Konut",
    price: 1350000,
    location: "Gazipaşa, Antalya",
    fullAddress: "Gazipaşa Merkez, Antalya, TR 07900",
    type: "Satılık",
    propertyType: "Daire",
    area: 85,
    beds: 2,
    baths: 1,
    image: "/slider-1.jpg",
    tag: "Yeni Yapı",
    features: ["Balkon", "Asansör", "Otopark"]
  },
  {
    id: 16,
    title: "Kundu Sahil Tatil Evi",
    price: 15000,
    location: "Kundu, Antalya",
    fullAddress: "Kundu Turizm Bölgesi, Aksu, Antalya, TR 07112",
    type: "Kiralık",
    propertyType: "Villa",
    area: 220,
    beds: 3,
    baths: 2,
    image: "/slider-1.jpg",
    tag: "Haftalık",
    features: ["Özel Havuz", "Denize 100m", "Bahçe", "Barbekü"]
  },
  {
    id: 17,
    title: "Kumluca Tarım Arazisi",
    price: 3800000,
    location: "Kumluca, Antalya",
    fullAddress: "Kumluca Merkez, Antalya, TR 07350",
    type: "Satılık",
    propertyType: "Arazi",
    area: 15000,
    image: "/slider-1.jpg",
    features: ["Verimli Toprak", "Sulama Sistemi", "Yola Cephe"]
  },
  {
    id: 18,
    title: "Demre Ticari Dükkan",
    price: 1200000,
    location: "Demre, Antalya",
    fullAddress: "Demre Merkez, Antalya, TR 07570",
    type: "Satılık",
    propertyType: "Dükkan",
    area: 75,
    image: "/slider-1.jpg",
    features: ["İşlek Cadde", "Geniş Vitrin", "Depo"]
  },
  {
    id: 19,
    title: "Elmalı Dağ Evi",
    price: 950000,
    location: "Elmalı, Antalya",
    fullAddress: "Elmalı Yayla Bölgesi, Antalya, TR 07700",
    type: "Satılık",
    propertyType: "Dağ Evi",
    area: 120,
    beds: 2,
    baths: 1,
    image: "/slider-1.jpg",
    tag: "Doğa İçinde",
    features: ["Şömine", "Bahçe", "Doğa Manzarası"]
  }
]

export default function PropertiesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [propertyType, setPropertyType] = useState("all")
  const [listingType, setListingType] = useState("all")
  const [location, setLocation] = useState("")
  const [filteredProperties, setFilteredProperties] = useState(properties)

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)

  // Filtreleme işlevi
  useEffect(() => {
    let result = properties;
    
    // Anahtar kelime filtresi
    if (searchKeyword) {
      result = result.filter(property => 
        property.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        property.location.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        property.fullAddress.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    
    // Emlak tipi filtresi
    if (propertyType && propertyType !== 'all') {
      result = result.filter(property => property.propertyType === propertyType);
    }
    
    // İlan tipi filtresi
    if (listingType && listingType !== 'all') {
      result = result.filter(property => property.type === listingType);
    }
    
    // Konum filtresi
    if (location) {
      result = result.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase()) ||
        property.fullAddress.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    setFilteredProperties(result);
    setCurrentPage(1); // Filtreleme yapıldığında ilk sayfaya dön
  }, [searchKeyword, propertyType, listingType, location]);

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
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-gray-800/90 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Lara, Muratpaşa Antalya</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-orange-500" />
              <span>+90 551 389 52 55</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
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
            <Image
              src="/villasantalya-logo.png"
              alt="VillasAntalya Logo"
              width={80}
              height={60}
              className="h-12 w-auto"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="hover:text-orange-500 transition-colors">
              Anasayfa
            </a>
            <a href="/about" className="hover:text-orange-500 transition-colors">
              Hakkımızda
            </a>
            <a href="/properties" className="text-orange-500 hover:text-orange-400 font-medium">
              Emlak Listesi
            </a>
            <a href="/blog" className="hover:text-orange-500 transition-colors">
              Blog
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              İletişim
            </a>
          </nav>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
            Giriş Yap / Kayıt Ol
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image src="/about-hero-bg.jpg" alt="Properties Hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">Emlak Listesi</h1>
              <div className="flex items-center space-x-2 text-lg">
                <a href="/" className="hover:text-orange-500 transition-colors">
                  Anasayfa
                </a>
                <span>-</span>
                <span className="text-orange-500">Emlak Listesi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Daire">Daire</SelectItem>
                      <SelectItem value="Apartman">Apartman</SelectItem>
                      <SelectItem value="Dükkan">Dükkan</SelectItem>
                      <SelectItem value="Ticari">Ticari</SelectItem>
                      <SelectItem value="Arazi">Arazi</SelectItem>
                      <SelectItem value="Dağ Evi">Dağ Evi</SelectItem>
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
                      <SelectItem value="Satılık">Satılık</SelectItem>
                      <SelectItem value="Kiralık">Kiralık</SelectItem>
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
                <Button type="submit" className="w-1/3 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-semibold">
                  Emlak Ara
                </Button>
              </div>
            </form>
          </div>

          {/* Sonuç Sayısı */}
          <div className="flex justify-between items-center mt-8 mb-6 px-2">
            <div className="text-gray-700">
              <span className="font-semibold">{filteredProperties.length}</span> ilan bulundu
              {filteredProperties.length > 0 && (
                <span> - Sayfa {currentPage}/{Math.ceil(filteredProperties.length / itemsPerPage)}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Sırala:</span>
              <Select defaultValue="newest">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProperties.length > 0 ? (
              currentProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group flex flex-col cursor-pointer h-full"
                >
                  {/* Property Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold">
                      {property.type}
                    </div>

                    {/* Tag */}
                    {property.tag && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                        {property.tag}
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
                        <span className="text-sm line-clamp-1">{property.fullAddress}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center mb-4">
                        <DollarSign className="h-4 w-4 mr-1 text-orange-500 flex-shrink-0" />
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
                        {property.beds && (
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{property.beds} Oda</span>
                          </div>
                        )}
                        {property.baths && (
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{property.baths} Banyo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 py-16 text-center">
                <div className="bg-white p-8 rounded-xl shadow">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">Aradığınız kriterlere uygun ilan bulunamadı</h3>
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
            <div className="flex justify-center items-center space-x-2 mt-12">
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
              <div className="flex items-center space-x-2">
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
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}