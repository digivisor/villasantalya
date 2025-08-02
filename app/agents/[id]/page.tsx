"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  Calendar, 
  Building, 
  ChevronRight, 
  MessageCircle, 
  Star, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  User, 
  DollarSign,
  Home,
  Square,
  Bed,
  Bath
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"

// Örnek danışman verileri
const agents = [
  {
    id: "cem-uzan",
    name: "Cem Uzan",
    title: "Kıdemli Emlak Danışmanı",
    email: "cem@villasantalya.com",
    phone: "+90 551 389 52 55",
    image: "/agent-1.jpg",
    rating: 4.9,
    reviews: 124,
    listings: 42,
    sales: 156,
    experience: 8, // Yıl olarak
    languages: ["Türkçe", "İngilizce", "Rusça"],
    company: {
      id: "villas-antalya",
      name: "Villas Antalya",
      logo: "/villasantalya-logo.png",
      address: "Lara Mah. Deniz Cad. No:123, Muratpaşa/Antalya",
    },
    regions: ["Lara", "Kundu", "Muratpaşa", "Konyaaltı"],
    specialties: ["Lüks Villalar", "Deniz Manzaralı Daireler", "Yatırım Mülkleri"],
    about: "2015 yılından bu yana Antalya'nın prestijli bölgelerinde emlak danışmanlığı hizmeti vermekteyim. Lüks konut pazarında uzmanlaşmış olup, özellikle Lara ve Muratpaşa bölgelerindeki gayrimenkul piyasasına hakimim. Müşterilerime özel çözümler sunarak, beklentilerinin ötesinde bir hizmet anlayışıyla çalışmaktayım.\n\nTürkiye'nin önde gelen emlak platformlarında en başarılı danışmanlar arasında yer almaktan ve müşterilerime doğru yatırım fırsatları sunmaktan gurur duyuyorum. Uluslararası yatırımcılara da hizmet vermekte olup, üç dilde akıcı iletişim sağlayabilmekteyim.",
    social: {
      facebook: "https://facebook.com/cemuzan",
      twitter: "https://twitter.com/cemuzan",
      instagram: "https://instagram.com/cemuzan",
      linkedin: "https://linkedin.com/in/cemuzan",
    }
  },
  {
    id: "ayse-demir",
    name: "Ayşe Demir",
    title: "Emlak Danışmanı",
    email: "ayse@villasantalya.com",
    phone: "+90 532 123 45 67",
    image: "/agent-2.jpg",
    rating: 4.7,
    reviews: 98,
    listings: 36,
    sales: 112,
    experience: 5,
    languages: ["Türkçe", "İngilizce", "Almanca"],
    company: {
      id: "villas-antalya",
      name: "Villas Antalya",
      logo: "/villasantalya-logo.png",
      address: "Lara Mah. Deniz Cad. No:123, Muratpaşa/Antalya",
    },
    regions: ["Konyaaltı", "Kepez", "Döşemealtı"],
    specialties: ["Aile Konutları", "Site İçi Daireler", "Yatırım Fırsatları"],
    about: "Emlak sektöründe 5 yıllık deneyimimle, Antalya'nın gelişmekte olan bölgelerinde uzmanlaşmış bir danışmanım. Özellikle aileler için ideal konutlar ve yatırım amaçlı gayrimenkuller konusunda uzmanım.\n\nAlmanya'da eğitim görmüş olmam sebebiyle Alman yatırımcılarla da aktif olarak çalışmaktayım. Müşterilerime gayrimenkul alım-satım süreçlerinde her aşamada profesyonel destek sağlıyor, ihtiyaçlarına en uygun çözümleri sunuyorum.",
    social: {
      facebook: "https://facebook.com/aysedemir",
      twitter: "https://twitter.com/aysedemir",
      instagram: "https://instagram.com/aysedemir",
      linkedin: "https://linkedin.com/in/aysedemir",
    }
  },
  {
    id: "mehmet-kaya",
    name: "Mehmet Kaya",
    title: "Kıdemli Emlak Danışmanı",
    email: "mehmet@villasantalya.com",
    phone: "+90 533 456 78 90",
    image: "/agent-3.jpg",
    rating: 4.8,
    reviews: 112,
    listings: 52,
    sales: 188,
    experience: 10,
    languages: ["Türkçe", "İngilizce", "Arapça"],
    company: {
      id: "remax-antalya",
      name: "Remax Antalya",
      logo: "/remax-logo.png",
      address: "Konyaaltı Cad. No:45, Konyaaltı/Antalya",
    },
    regions: ["Konyaaltı", "Lara", "Belek", "Side"],
    specialties: ["Yazlık Konutlar", "Turistik Yatırımlar", "Ticari Gayrimenkuller"],
    about: "10 yıllık sektör tecrübesiyle Antalya'nın en deneyimli emlak danışmanlarından biriyim. Turizm bölgelerindeki gayrimenkuller ve ticari yatırımlar konusunda uzmanlaşmış durumdayım.\n\nÖzellikle Orta Doğu ve Körfez ülkelerinden gelen yatırımcılarla yakın çalışma deneyimine sahibim. Konut, arsa ve ticari gayrimenkul dahil olmak üzere her türlü gayrimenkul yatırımı konusunda kapsamlı danışmanlık hizmetleri sunuyorum.",
    social: {
      facebook: "https://facebook.com/mehmetkaya",
      twitter: "https://twitter.com/mehmetkaya",
      instagram: "https://instagram.com/mehmetkaya",
      linkedin: "https://linkedin.com/in/mehmetkaya",
    }
  },
  {
    id: "fatma-ozkan",
    name: "Fatma Özkan",
    title: "Lüks Emlak Uzmanı",
    email: "fatma@villasantalya.com",
    phone: "+90 534 567 89 01",
    image: "/agent-4.jpg",
    rating: 5.0,
    reviews: 87,
    listings: 28,
    sales: 94,
    experience: 7,
    languages: ["Türkçe", "İngilizce", "Fransızca"],
    company: {
      id: "century21-antalya",
      name: "Century 21 Antalya",
      logo: "/century21-logo.png",
      address: "Çallı Mah. Portakal Çiçeği Cad. No:78, Muratpaşa/Antalya",
    },
    regions: ["Kalkan", "Kaş", "Muratpaşa", "Kemer"],
    specialties: ["Ultra Lüks Villalar", "Butik Oteller", "Özel Tasarım Konutlar"],
    about: "Lüks gayrimenkul pazarında 7 yıllık deneyime sahip, özel müşteri portföyüne hizmet veren bir danışmanım. Özellikle Kalkan ve Kaş bölgelerindeki lüks villaların yanı sıra, butik otel yatırımları konusunda da uzmanlığım bulunmakta.\n\nAvrupa'dan gelen yatırımcılarla yakın ilişkiler kuruyor, eksklüzif gayrimenkullerin alım-satımında aracılık ediyorum. Her müşterime özel ve kişiselleştirilmiş hizmet anlayışıyla, beklentilerin üzerinde bir deneyim sunuyorum.",
    social: {
      facebook: "https://facebook.com/fatmaozkan",
      twitter: "https://twitter.com/fatmaozkan",
      instagram: "https://instagram.com/fatmaozkan",
      linkedin: "https://linkedin.com/in/fatmaozkan",
    }
  }
];

// Örnek mülk listesi - her danışman için
const agentListings = [
  // Cem Uzan'ın emlakları
  {
    agentId: "cem-uzan",
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
      },
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
      }
    ]
  },
  // Ayşe Demir'in emlakları
  {
    agentId: "ayse-demir",
    properties: [
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
      }
    ]
  },
  // Mehmet Kaya'nın emlakları
  {
    agentId: "mehmet-kaya",
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
      }
    ]
  },
  // Fatma Özkan'ın emlakları
  {
    agentId: "fatma-ozkan",
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
      }
    ]
  }
];

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = params.id as string;
  const [agent, setAgent] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    // Gerçek bir uygulamada API'den veri çekecektik
    const selectedAgent = agents.find(a => a.id === agentId);
    const selectedListings = agentListings.find(l => l.agentId === agentId)?.properties || [];
    
    setAgent(selectedAgent);
    setListings(selectedListings);
    setLoading(false);
  }, [agentId]);

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

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Danışman Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız emlak danışmanı sistemimizde bulunmamaktadır.</p>
          <Link href="/properties" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium inline-block">
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
            <Link href="/about" className="hover:text-orange-500 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/properties" className="hover:text-orange-500 transition-colors">
              Emlak Listesi
            </Link>
            <Link href="/blog" className="hover:text-orange-500 transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-orange-500 transition-colors">
              İletişim
            </Link>
          </nav>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
            Giriş Yap / Kayıt Ol
          </Button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Anasayfa
            </Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-orange-500 transition-colors">
              Emlak Listesi
            </Link>
            <span>/</span>
            <span className="text-orange-500">{agent.name}</span>
          </div>
        </div>
      </div>

      {/* Agent Profile Header */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-r from-orange-500 to-orange-600"></div>
            
            <div className="relative px-6 py-8">
              {/* Profile Image */}
              <div className="absolute -top-16 left-6">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={agent.image || "/placeholder.svg"}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="pt-16 md:pt-0 md:ml-36">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{agent.name}</h1>
                    <p className="text-orange-500 font-medium">{agent.title}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    {Object.entries(agent.social).map(([platform, url]) => (
                      <a 
                        key={platform} 
                        href={url as string} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                      >
                        {platform === 'facebook' && <Facebook className="w-5 h-5" />}
                        {platform === 'twitter' && <Twitter className="w-5 h-5" />}
                        {platform === 'instagram' && <Instagram className="w-5 h-5" />}
                        {platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Building className="w-4 h-4 mr-2 text-orange-500" />
                    <span>{agent.company.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    <span>{agent.regions.join(", ")}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                    <span>{agent.experience} Yıllık Deneyim</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2 text-orange-500" />
                    <span>{agent.languages.join(", ")}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-gray-900">{agent.listings}</div>
                    <div className="text-sm text-gray-500">Aktif İlan</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-gray-900">{agent.sales}</div>
                    <div className="text-sm text-gray-500">Tamamlanan Satış</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-center text-xl font-bold text-gray-900">
                      <span>{agent.rating}</span>
                      <Star className="w-4 h-4 ml-1 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="text-sm text-gray-500">Değerlendirme</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-gray-900">{agent.reviews}</div>
                    <div className="text-sm text-gray-500">Yorum</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Detail Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 bg-white rounded-lg p-1 border border-gray-100">
                  <TabsTrigger value="about" className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Hakkında
                  </TabsTrigger>
                  <TabsTrigger value="listings" className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    İlanları ({listings.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Danışman Hakkında</h2>
                  <div className="space-y-4">
                    {agent.about.split('\n\n').map((paragraph: string, idx: number) => (
                      <p key={idx} className="text-gray-600 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Uzmanlık Alanları</h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.map((specialty: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Çalıştığı Bölgeler</h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.regions.map((region: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="listings" className="space-y-6">
                  {listings.length > 0 ? (
                    listings.map((property) => (
                      <Link
                        key={property.id}
                        href={`/properties/${property.id}`}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group block"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative h-56 md:h-auto md:w-48 lg:w-64">
                            <Image
                              src={property.image || "/placeholder.svg"}
                              alt={property.title}
                              fill
                              className="object-cover"
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
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col">
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
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-auto">
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
                    <div className="bg-white rounded-xl p-8 shadow-md text-center">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Bu danışmana ait aktif ilan bulunamadı</h3>
                      <p className="text-gray-600">Danışmanın aktif ilanları bulunmamaktadır.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">İletişim Bilgileri</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <a href={`tel:${agent.phone}`} className="text-gray-900 font-medium hover:text-orange-500">{agent.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">E-posta</p>
                      <a href={`mailto:${agent.email}`} className="text-gray-900 font-medium hover:text-orange-500">{agent.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Şirket</p>
                      <p className="text-gray-900 font-medium">{agent.company.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Adres</p>
                      <p className="text-gray-900">{agent.company.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp ile Mesaj Gönder
                  </Button>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    <Mail className="w-4 h-4 mr-2" />
                    E-posta Gönder
                  </Button>
                </div>
              </div>
              
              {/* Company Card */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Bağlı Olduğu Şirket</h3>
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={agent.company.logo || "/placeholder.svg"}
                      alt={agent.company.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{agent.company.name}</h4>
                    <p className="text-sm text-gray-600">Antalya, Türkiye</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <Link href={`/companies/${agent.company.id}`} className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
                    Şirket Profilini Görüntüle
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}