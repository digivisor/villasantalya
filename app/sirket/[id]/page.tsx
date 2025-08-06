"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  Building,
  Home,
  DollarSign,
  ChevronRight,
  Search,
  Check,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Square,
  Bed,
  Bath,
  Star,
  User
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"

// Örnek şirket verileri
const companies = [
  {
    id: "villas-antalya",
    name: "Villas Antalya",
    logo: "/villasantalya-logo.png",
    coverImage: "/about-hero-bg.jpg",
    address: "Lara Mah. Deniz Cad. No:123, Muratpaşa/Antalya",
    phone: "+90 551 389 52 55",
    email: "info@villasantalya.com",
    website: "www.villasantalya.com",
    founded: 2010,
    totalAgents: 15,
    totalListings: 108,
    totalSold: 452,
    regions: ["Lara", "Muratpaşa", "Konyaaltı", "Kepez"],
    specialties: ["Lüks Villalar", "Deniz Manzaralı Daireler", "Yatırım Mülkleri", "Site İçi Konutlar"],
    about: "Villas Antalya, 2010 yılında kurulan ve Antalya'nın en prestijli gayrimenkul danışmanlık şirketlerinden biridir. Müşteri memnuniyetini ön planda tutan çalışma anlayışımızla, lüks konutlar ve yatırım amaçlı gayrimenkuller konusunda uzmanlaşmış durumdayız.\n\nDeneyimli ve profesyonel ekibimizle Antalya'nın en değerli bölgelerinde hizmet vermekte ve müşterilerimize gayrimenkul alım, satım ve kiralama süreçlerinde kapsamlı destek sağlamaktayız. Yerli ve yabancı yatırımcılar için özel çözümler sunarak, gayrimenkul sektöründeki beklentilerin ötesine geçmeyi hedefliyoruz.\n\nTeknoloji odaklı çalışma sistemimiz ve şeffaf iş modelimiz sayesinde, müşterilerimize daima güvenilir ve kaliteli bir hizmet sunmaktayız.",
    images: [
      "/slider-1.jpg",
      "/slider-2.jpg",
      "/hero-background.jpg",
    ],
    social: {
      facebook: "https://facebook.com/villasantalya",
      twitter: "https://twitter.com/villasantalya",
      instagram: "https://instagram.com/villasantalya",
      linkedin: "https://linkedin.com/company/villasantalya",
    },
    features: [
      {
        title: "Uzman Danışmanlık",
        description: "Alanında uzman kadromuzla gayrimenkul alım-satım süreçlerinizde profesyonel destek"
      },
      {
        title: "Uluslararası Ağ",
        description: "Türkiye ve yurtdışı yatırımcılarla güçlü iş birlikleri"
      },
      {
        title: "Modern Portföy Yönetimi",
        description: "Teknoloji tabanlı portföy yönetim sistemi"
      },
      {
        title: "Özel Müşteri Hizmetleri",
        description: "Kişiselleştirilmiş müşteri deneyimi ve satış sonrası destek"
      }
    ],
    agents: [
      {
        id: "cem-uzan",
        name: "Cem Uzan",
        title: "Kıdemli Emlak Danışmanı",
        image: "/agent-1.jpg",
        rating: 4.9,
        listings: 42
      },
      {
        id: "ayse-demir",
        name: "Ayşe Demir",
        title: "Emlak Danışmanı",
        image: "/agent-2.jpg",
        rating: 4.7,
        listings: 36
      }
    ]
  },
  {
    id: "remax-antalya",
    name: "Remax Antalya",
    logo: "/remax-logo.png",
    coverImage: "/about-hero-bg.jpg",
    address: "Konyaaltı Cad. No:45, Konyaaltı/Antalya",
    phone: "+90 532 555 33 44",
    email: "info@remaxantalya.com",
    website: "www.remaxantalya.com",
    founded: 2005,
    totalAgents: 25,
    totalListings: 215,
    totalSold: 784,
    regions: ["Konyaaltı", "Lara", "Belek", "Side", "Döşemealtı"],
    specialties: ["Yazlık Konutlar", "Turistik Tesisler", "Ticari Gayrimenkuller", "Arsa Yatırımları"],
    about: "Remax Antalya, dünya çapında tanınan gayrimenkul danışmanlık markası RE/MAX'ın Antalya'daki öncü temsilcisidir. 2005 yılından bu yana faaliyette olan ofisimiz, küresel standartlarda gayrimenkul hizmeti sunmaktadır.\n\nYenilikçi pazarlama stratejileri ve geniş ağımız sayesinde, gayrimenkulleriniz için en etkili çözümleri üretiyoruz. Her müşterimiz için özel olarak hazırlanan stratejiler ve kapsamlı piyasa analizleriyle, gayrimenkul alım-satım süreçlerinizi verimli ve başarılı bir şekilde yönetiyoruz.\n\nDünya standartlarında eğitim almış profesyonel kadromuzla, gayrimenkul sektöründe yeni bir hizmet anlayışı sunmaktan gurur duyuyoruz.",
    images: [
      "/slider-1.jpg",
      "/slider-2.jpg",
    ],
    social: {
      facebook: "https://facebook.com/remaxantalya",
      twitter: "https://twitter.com/remaxantalya",
      instagram: "https://instagram.com/remaxantalya",
      linkedin: "https://linkedin.com/company/remaxantalya",
    },
    features: [
      {
        title: "Global Network",
        description: "Dünya çapında tanınan RE/MAX ağının bir parçası"
      },
      {
        title: "Profesyonel Eğitim",
        description: "Sürekli gelişen eğitim programlarıyla desteklenen danışmanlar"
      },
      {
        title: "Dijital Pazarlama",
        description: "Gayrimenkuller için özel dijital pazarlama stratejileri"
      },
      {
        title: "Hukuki Destek",
        description: "Gayrimenkul süreçlerinde hukuki danışmanlık hizmeti"
      }
    ],
    agents: [
      {
        id: "mehmet-kaya",
        name: "Mehmet Kaya",
        title: "Kıdemli Emlak Danışmanı",
        image: "/agent-3.jpg",
        rating: 4.8,
        listings: 52
      }
    ]
  },
  {
    id: "century21-antalya",
    name: "Century 21 Antalya",
    logo: "/century21-logo.png",
    coverImage: "/about-hero-bg.jpg",
    address: "Çallı Mah. Portakal Çiçeği Cad. No:78, Muratpaşa/Antalya",
    phone: "+90 534 777 88 99",
    email: "info@century21antalya.com",
    website: "www.century21antalya.com",
    founded: 2008,
    totalAgents: 18,
    totalListings: 145,
    totalSold: 523,
    regions: ["Muratpaşa", "Konyaaltı", "Kalkan", "Kaş", "Kemer"],
    specialties: ["Ultra Lüks Villalar", "Butik Oteller", "Özel Tasarım Konutlar", "Turizm Yatırımları"],
    about: "Century 21 Antalya, dünyanın önde gelen gayrimenkul markalarından Century 21'in Antalya'daki bayisidir. 2008 yılından bu yana, Antalya ve çevresindeki en prestijli gayrimenkul projelerinde danışmanlık hizmeti vermekteyiz.\n\nMüşteri memnuniyetini her zaman ilk sıraya koyan şirketimiz, müşterilerimize özel gayrimenkul çözümleri sunmakta ve alım-satım süreçlerini en verimli şekilde yönetmektedir. Dünya standartlarındaki hizmet anlayışımızla, gayrimenkul sektöründe fark yaratmaya devam ediyoruz.\n\nLüks villalar, deniz manzaralı daireler ve turizm tesisleri konusunda uzmanlaşmış ekibimizle, yatırımcılarımızın hayallerindeki gayrimenkullere ulaşmalarını sağlıyoruz.",
    images: [
      "/slider-1.jpg",
      "/slider-2.jpg",
    ],
    social: {
      facebook: "https://facebook.com/century21antalya",
      twitter: "https://twitter.com/century21antalya",
      instagram: "https://instagram.com/century21antalya",
      linkedin: "https://linkedin.com/company/century21antalya",
    },
    features: [
      {
        title: "Lüks Gayrimenkul Uzmanlığı",
        description: "Premium gayrimenkul pazarında uzmanlaşmış kadro"
      },
      {
        title: "Uluslararası Portföy",
        description: "Global standartlarda gayrimenkul portföy yönetimi"
      },
      {
        title: "Özel Müşteri İlişkileri",
        description: "VIP müşteriler için ayrıcalıklı hizmetler"
      },
      {
        title: "Turizm Yatırım Danışmanlığı",
        description: "Turizm tesisleri ve butik oteller konusunda uzman kadro"
      }
    ],
    agents: [
      {
        id: "fatma-ozkan",
        name: "Fatma Özkan",
        title: "Lüks Emlak Uzmanı",
        image: "/agent-4.jpg",
        rating: 5.0,
        listings: 28
      }
    ]
  }
];

// Örnek özellik listesi
const companyProperties = [
  {
    companyId: "villas-antalya",
    properties: [
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
        agent: {
          id: "cem-uzan",
          name: "Cem Uzan"
        }
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
        agent: {
          id: "ayse-demir",
          name: "Ayşe Demir"
        }
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
        agent: {
          id: "cem-uzan",
          name: "Cem Uzan"
        }
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
        agent: {
          id: "ayse-demir",
          name: "Ayşe Demir"
        }
      }
    ]
  },
  {
    companyId: "remax-antalya",
    properties: [
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
        agent: {
          id: "mehmet-kaya",
          name: "Mehmet Kaya"
        }
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
        agent: {
          id: "mehmet-kaya",
          name: "Mehmet Kaya"
        }
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
        agent: {
          id: "mehmet-kaya",
          name: "Mehmet Kaya"
        }
      }
    ]
  },
  {
    companyId: "century21-antalya",
    properties: [
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
        agent: {
          id: "fatma-ozkan",
          name: "Fatma Özkan"
        }
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
        agent: {
          id: "fatma-ozkan",
          name: "Fatma Özkan"
        }
      }
    ]
  }
];

export default function CompanyProfilePage() {
  const params = useParams();
  const companyId = params.id as string;
  const [company, setCompany] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);

  useEffect(() => {
    // Gerçek bir uygulamada API'den veri çekecektik
    const selectedCompany = companies.find(c => c.id === companyId);
    const selectedProperties = companyProperties.find(cp => cp.companyId === companyId)?.properties || [];
    
    setCompany(selectedCompany);
    setProperties(selectedProperties);
    setFilteredProperties(selectedProperties);
    setLoading(false);
  }, [companyId]);

  // Arama işlevi
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProperties(properties);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = properties.filter(property => 
        property.title.toLowerCase().includes(query) || 
        property.location.toLowerCase().includes(query) ||
        property.propertyType.toLowerCase().includes(query)
      );
      setFilteredProperties(filtered);
    }
  }, [searchQuery, properties]);

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR') + ' ₺';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Şirket Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız emlak şirketi sistemimizde bulunmamaktadır.</p>
          <Link href="/emlaklistesi" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium inline-block">
            Emlak Listesine Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Anasayfa
            </Link>
            <Link href="/hakkimizda" className="hover:text-orange-500 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/emlaklistesi" className="hover:text-orange-500 transition-colors">
              Emlak Listesi
            </Link>
            <Link href="/blog" className="hover:text-orange-500 transition-colors">
              Blog
            </Link>
            <Link href="/iletisim" className="hover:text-orange-500 transition-colors">
              İletişim
            </Link>
          </nav>

   
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        <div className="relative h-72 md:h-96 lg:h-[500px] overflow-hidden">
          <Image 
            src={company.coverImage} 
            alt={company.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
        </div>
        
        {/* Company Logo & Info */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-32 md:-mt-40 mb-10 z-10 flex flex-col md:flex-row items-start md:items-end">
            <div className="bg-white p-4 rounded-xl shadow-lg mb-4 md:mb-0 md:mr-6">
              <Image 
                src={company.logo} 
                alt={company.name}
                width={120}
                height={120}
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
            </div>
            <div className="bg-white/90 backdrop-blur rounded-xl p-5 md:p-6 shadow-lg flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">{company.name}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                  <span>{company.address}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap mt-4 md:mt-0 gap-2">
                <a 
                  href={`tel:${company.phone}`}
                  className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Ara</span>
                </a>
                <a 
                  href={`mailto:${company.email}`}
                  className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span>E-posta</span>
                </a>
                <a 
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span>Web Sitesi</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="container mx-auto px-4 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
            <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">{company.founded}</div>
            <div className="text-sm text-gray-500">Kuruluş Yılı</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
            <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">{company.totalAgents}</div>
            <div className="text-sm text-gray-500">Danışman</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
            <Building className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">{company.totalListings}</div>
            <div className="text-sm text-gray-500">Aktif İlan</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
            <Home className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">{company.totalSold}</div>
            <div className="text-sm text-gray-500">Tamamlanan Satış</div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex justify-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white rounded-lg p-1 border border-gray-100 w-full md:w-auto flex flex-wrap justify-center mx-auto max-w-xl">
              <TabsTrigger 
                value="about" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white flex-1"
              >
                Şirket Hakkında
              </TabsTrigger>
              <TabsTrigger 
                value="properties" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white flex-1"
              >
                İlanlar ({properties.length})
              </TabsTrigger>
              <TabsTrigger 
                value="agents" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white flex-1"
              >
                Danışmanlar
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              {/* About Content */}
              <TabsContent value="about">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Main About Content */}
                  <div className="md:col-span-2 space-y-8">
                    {/* About Description */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <Building className="w-5 h-5 mr-2 text-orange-500" />
                          Şirket Hakkında
                        </h2>
                        <div className="space-y-4">
                          {company.about.split('\n\n').map((paragraph: string, idx: number) => (
                            <p key={idx} className="text-gray-700 leading-relaxed">{paragraph}</p>
                          ))}
                        </div>
                      </div>

                      {/* Image Gallery */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 md:p-8 bg-gray-50 mt-4">
                        {company.images.map((image: string, idx: number) => (
                          <div key={idx} className="relative h-56 rounded-lg overflow-hidden group">
                            <Image 
                              src={image} 
                              alt={`${company.name} ${idx + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Company Features */}
                    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Check className="w-5 h-5 mr-2 text-orange-500" />
                        Neden {company.name}?
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {company.features.map((feature: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-700">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Expertise Areas */}
                    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-orange-500" />
                        Uzmanlık Alanları
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {company.specialties.map((specialty: string, idx: number) => (
                          <span key={idx} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                        Hizmet Verdiği Bölgeler
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {company.regions.map((region: string, idx: number) => (
                          <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Side Info */}
                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h2>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Adres</p>
                            <p className="text-gray-900">{company.address}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Phone className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Telefon</p>
                            <a href={`tel:${company.phone}`} className="text-gray-900 hover:text-orange-500">{company.phone}</a>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Mail className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">E-posta</p>
                            <a href={`mailto:${company.email}`} className="text-gray-900 hover:text-orange-500">{company.email}</a>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Globe className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Web Sitesi</p>
                            <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-orange-500">{company.website}</a>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="mt-6 space-y-3">
                        <a 
                          href={`tel:${company.phone}`}
                          className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          <span>Hemen Ara</span>
                        </a>
                        <a 
                          href={`mailto:${company.email}`}
                          className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          <span>E-posta Gönder</span>
                        </a>
                      </div>
                    </div>
                    
                    {/* Social Media */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Sosyal Medya</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(company.social).map(([platform, url]) => (
                          <a 
                            key={platform} 
                            href={url as string} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg transition-colors"
                          >
                            {platform === 'facebook' && <Facebook className="w-5 h-5 mr-2 text-blue-600" />}
                            {platform === 'twitter' && <Twitter className="w-5 h-5 mr-2 text-blue-400" />}
                            {platform === 'instagram' && <Instagram className="w-5 h-5 mr-2 text-pink-600" />}
                            {platform === 'linkedin' && <Linkedin className="w-5 h-5 mr-2 text-blue-700" />}
                            <span className="capitalize">{platform}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                    
                    {/* Featured Agents */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Öne Çıkan Danışmanlar</h2>
                      <div className="space-y-4">
                        {company.agents.slice(0, 2).map((agent: any) => (
                          <Link 
                            key={agent.id}
                            href={`/danisman/${agent.id}`}
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="relative w-14 h-14 mr-3">
                              <Image 
                                src={agent.image} 
                                alt={agent.name} 
                                fill 
                                className="object-cover rounded-full"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                              <p className="text-sm text-gray-500">{agent.title}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Button 
                        onClick={() => setActiveTab('agents')}
                        className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
                      >
                        Tüm Danışmanları Gör
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Properties Content */}
              <TabsContent value="properties">
                {/* Search Bar */}
                <div className="mb-8 bg-white rounded-xl shadow-md p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="w-full md:w-auto">
                      <h2 className="text-2xl font-bold text-gray-900">{company.name} İlanları</h2>
                      <p className="text-gray-600 mt-1">Toplam {properties.length} ilan listelendi</p>
                    </div>
                    
                    <div className="relative w-full md:w-80">
                      <Input
                        placeholder="İlan adı, konum veya tür..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10 h-12 rounded-lg border-gray-300"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Filter Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                      className={`rounded-full ${searchQuery === "" ? "bg-orange-50 text-orange-600 border-orange-200" : ""}`}
                    >
                      Tümü ({properties.length})
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSearchQuery("Villa")}
                      className={`rounded-full ${searchQuery === "Villa" ? "bg-orange-50 text-orange-600 border-orange-200" : ""}`}
                    >
                      Villalar
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSearchQuery("Daire")}
                      className={`rounded-full ${searchQuery === "Daire" ? "bg-orange-50 text-orange-600 border-orange-200" : ""}`}
                    >
                      Daireler
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSearchQuery("Ticari")}
                      className={`rounded-full ${searchQuery === "Ticari" ? "bg-orange-50 text-orange-600 border-orange-200" : ""}`}
                    >
                      Ticari
                    </Button>
                  </div>
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <Link
                        key={property.id}
                        href={`/emlaklistesi/${property.id}`}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group block"
                      >
                        <div className="flex flex-col">
                          <div className="relative h-64">
                            <Image
                              src={property.image || "/placeholder.svg"}
                              alt={property.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {/* Type Badge */}
                            <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold">
                              {property.type}
                            </div>
                            
                            {/* Tag */}
                            {property.tag && (
                              <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                {property.tag}
                              </div>
                            )}
                            
                            {/* Agent Badge */}
                            <Link
                              href={`/danisman/${property.agent.id}`}
                              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md text-xs font-medium flex items-center hover:bg-white transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <User className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                              {property.agent.name}
                            </Link>
                          </div>
                          
                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300">
                              {property.title}
                            </h3>
                            
                            <div className="flex items-start text-gray-600 mb-3">
                              <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-orange-500" />
                              <span className="text-sm">{property.fullAddress}</span>
                            </div>
                            
                            <div className="flex items-center mb-4">
                              <DollarSign className="h-4 w-4 mr-1 text-orange-500" />
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
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-auto border-t border-gray-100 pt-4">
                              <div className="flex items-center">
                                <Home className="w-4 h-4 mr-1.5 text-gray-500" />
                                <span className="text-sm text-gray-600">{property.propertyType}</span>
                              </div>
                              <div className="flex items-center">
                                <Square className="w-4 h-4 mr-1.5 text-gray-500" />
                                <span className="text-sm text-gray-600">{property.area} m²</span>
                              </div>
                              {property.beds && (
                                <div className="flex items-center">
                                  <Bed className="w-4 h-4 mr-1.5 text-gray-500" />
                                  <span className="text-sm text-gray-600">{property.beds} Oda</span>
                                </div>
                              )}
                              {property.baths && (
                                <div className="flex items-center">
                                  <Bath className="w-4 h-4 mr-1.5 text-gray-500" />
                                  <span className="text-sm text-gray-600">{property.baths} Banyo</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 bg-white rounded-xl p-8 shadow-md text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Arama Sonucu Bulunamadı</h3>
                      <p className="text-gray-600 mb-4">Arama kriterlerinize uygun ilan bulunamadı.</p>
                      {searchQuery && (
                        <Button 
                          onClick={() => setSearchQuery("")}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Tüm İlanları Göster
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Agents Content */}
              <TabsContent value="agents">
                <div className="mb-8 bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{company.name} Emlak Danışmanları</h2>
                  <p className="text-gray-600">
                    {company.name} bünyesinde çalışan deneyimli emlak danışmanlarımız size en iyi hizmeti sunmak için hazır.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {company.agents.map((agent: any) => (
                    <Link 
                      key={agent.id}
                      href={`/danisman/${agent.id}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300"
                    >
                      {/* Agent Image */}
                      <div className="relative h-56 overflow-hidden">
                        <Image 
                          src={agent.image || "/placeholder.svg"} 
                          alt={agent.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">{agent.name}</h3>
                              <p className="text-white/80">{agent.title}</p>
                            </div>
                            <div className="flex items-center bg-white/20 backdrop-blur rounded-lg px-2 py-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                              <span className="text-white font-medium">{agent.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Agent Details */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-center px-3 py-2 bg-gray-50 rounded-lg flex-1">
                            <div className="font-bold text-gray-900">{agent.listings}</div>
                            <div className="text-xs text-gray-500">İlanlar</div>
                          </div>
                          <div className="text-center px-3 py-2 bg-gray-50 rounded-lg flex-1 mx-2">
                            <div className="font-bold text-gray-900">{Math.floor(Math.random() * 5) + 3}</div>
                            <div className="text-xs text-gray-500">Yıl Deneyim</div>
                          </div>
                          <div className="text-center px-3 py-2 bg-gray-50 rounded-lg flex-1">
                            <div className="font-bold text-gray-900">{Math.floor(Math.random() * 20) + 30}</div>
                            <div className="text-xs text-gray-500">Satışlar</div>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center">
                          <User className="w-4 h-4 mr-2" />
                          Profili Görüntüle
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}