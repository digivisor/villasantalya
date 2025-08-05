"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
  Bath,
  Loader
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"

// userService'i import et
import userService, { Consultant } from "../../services/user.service"
import propertyService from "../../services/property.service"

// API URL'si
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.includes('/api')
    ? process.env.NEXT_PUBLIC_API_URL.split('/api')[0]
    : process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:5000';

export default function AgentProfilePage() {
  const params = useParams();
  const router = useRouter();
  
  // URL parametresi olarak alınan agent ID
  const agentId = params.id as string;
  
  const [agent, setAgent] = useState<Consultant | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Danışman verilerini API'den çek
    const fetchAgentData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching agent data for ID:', agentId);
        
        // Danışman bilgilerini çek
        const agentResponse = await userService.getConsultantById(agentId);
        console.log('Agent data received:', agentResponse);
        
        if (agentResponse.agent) {
          setAgent(agentResponse.agent);
          
          // Danışmanın ilanlarını çek
          try {
            const propertiesResponse = await userService.getConsultantProperties(agentId);
            console.log('Agent properties:', propertiesResponse);
            if (propertiesResponse.properties && Array.isArray(propertiesResponse.properties)) {
              setListings(propertiesResponse.properties);
            }
          } catch (propError) {
            console.error('Error fetching agent properties:', propError);
            // İlanlar yüklenemese bile danışman profilini göster
            setListings([]);
          }
        } else {
          setError('Danışman bilgileri bulunamadı');
        }
      } catch (error: any) {
        console.error('Error fetching agent data:', error);
        setError(error.message || 'Danışman bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    if (agentId) {
      fetchAgentData();
    } else {
      setError('Geçersiz danışman ID');
      setLoading(false);
    }
  }, [agentId]);

  // İletişim işleyicileri
  const handleContact = (type: 'whatsapp' | 'phone' | 'email') => {
    if (!agent) return;
    
    const { phone, email, name } = agent;
    
    switch (type) {
      case 'whatsapp':
        // WhatsApp'ta mesaj gönder
        const formattedPhone = phone?.replace(/\D/g, '') || '';
        const whatsappUrl = `https://wa.me/${formattedPhone.startsWith('90') ? formattedPhone : `90${formattedPhone}`}`;
        window.open(whatsappUrl, '_blank');
        break;
        
      case 'phone':
        // Telefon araması yap
        window.location.href = `tel:${phone || ''}`;
        break;
        
      case 'email':
        // E-posta gönder
        const subject = `${agent.name} ile İletişim - VillasAntalya`;
        const body = `Merhaba ${name || 'Emlak Danışmanı'},\n\nSize VillasAntalya web sitesi üzerinden ulaşıyorum.\n\nSaygılarımla.`;
        window.location.href = `mailto:${email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
    }
  };

  // Şirket profili sayfasına yönlendirme
  const handleViewCompany = () => {
    if (!agent || !agent.company) return;
    
    router.push(`/companies/${agent.company._id}`);
  };

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price: number, currency: string = 'TRY') => {
    try {
      let currencySymbol = '₺';
      if (currency === 'USD') currencySymbol = '$';
      if (currency === 'EUR') currencySymbol = '€';
      
      return `${price.toLocaleString('tr-TR')} ${currencySymbol}`;
    } catch (error) {
      return `${price} ₺`;
    }
  };
  
  // Resim URL'si formatlama fonksiyonu
  const formatImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/placeholder-agent.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiBaseUrl}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-orange-500 mx-auto" />
          <p className="mt-4 text-gray-600">Danışman bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Danışman Bulunamadı</h2>
          <p className="text-gray-600 mb-6">{error || 'Aradığınız emlak danışmanı sistemimizde bulunmamaktadır.'}</p>
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
            <Link href="/agents" className="hover:text-orange-500 transition-colors">
              Danışmanlar
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
                    src={formatImageUrl(agent.image)}
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
                    {agent.social && Object.entries(agent.social).map(([platform, url]) => {
                      // Boş URL'leri filtrele
                      if (!url) return null;
                      
                      return (
                        <a 
                          key={platform} 
                          href={url as string} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                          aria-label={`${agent.name} - ${platform}`}
                        >
                          {platform === 'facebook' && <Facebook className="w-5 h-5" />}
                          {platform === 'twitter' && <Twitter className="w-5 h-5" />}
                          {platform === 'instagram' && <Instagram className="w-5 h-5" />}
                          {platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                        </a>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {agent.company && (
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2 text-orange-500" />
                      <span>{agent.company.name}</span>
                    </div>
                  )}
                  
                  {agent.regions && agent.regions.length > 0 && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                      <span>{agent.regions.join(", ")}</span>
                    </div>
                  )}
                  
                  {agent.experience > 0 && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                      <span>{agent.experience} Yıllık Deneyim</span>
                    </div>
                  )}
                  
                  {agent.languages && agent.languages.length > 0 && (
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2 text-orange-500" />
                      <span>{agent.languages.join(", ")}</span>
                    </div>
                  )}
                </div>
                
                {/* Agent Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-gray-900">{listings.length}</div>
                    <div className="text-sm text-gray-500">Aktif İlan</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-gray-900">{agent.experience * 15}</div>
                    <div className="text-sm text-gray-500">Tamamlanan Satış</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-center text-xl font-bold text-gray-900">
                      <span>{agent.rating || 4.5}</span>
                      <Star className="w-4 h-4 ml-1 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="text-sm text-gray-500">Değerlendirme</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-gray-900">{agent.experience * 8 || 0}</div>
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
                    {agent.about ? (
                      agent.about.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-gray-600 leading-relaxed">{paragraph}</p>
                      ))
                    ) : (
                      <p className="text-gray-600">Bu danışman henüz hakkında bilgi eklememiştir.</p>
                    )}
                  </div>
                  
                  {agent.specialties && agent.specialties.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Uzmanlık Alanları</h3>
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.map((specialty, idx) => (
                          <span key={idx} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {agent.regions && agent.regions.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Çalıştığı Bölgeler</h3>
                      <div className="flex flex-wrap gap-2">
                        {agent.regions.map((region, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="listings" className="space-y-6">
                  {listings.length > 0 ? (
                    listings.map((property) => (
                      <Link
                        key={property._id}
                        href={`/properties/${property.slug || property._id}`}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group block"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative h-56 md:h-auto md:w-48 lg:w-64">
                            <Image
                              src={formatImageUrl(property.mainImage || property.image || '/placeholder.svg')}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                            
                            {/* Type Badge */}
                            <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold">
                              {property.type === 'sale' ? 'Satılık' : 'Kiralık'}
                            </div>
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                              {property.propertyType || 'Emlak'}
                            </div>
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300">
                              {property.title}
                            </h3>
                            
                            <div className="flex items-start text-gray-600 mb-3">
                              <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-orange-500" />
                              <span className="text-sm">
                                {property.address ? `${property.address}, ${property.district || ''}, ${property.city || ''}` : 
                                 `${property.district || ''}, ${property.city || ''}`}
                              </span>
                            </div>
                            
                            <div className="flex items-center mb-4">
                              <DollarSign className="h-4 w-4 mr-1 text-orange-500" />
                              <div className="flex items-center space-x-2">
                                {property.discountedPrice ? (
                                  <>
                                    <span className="font-bold text-orange-500">{formatPrice(property.discountedPrice, property.currency)}</span>
                                    <span className="text-sm line-through text-gray-400">{formatPrice(property.price, property.currency)}</span>
                                  </>
                                ) : (
                                  <span className="font-bold text-orange-500">{formatPrice(property.price, property.currency || 'TRY')}</span>
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
                              {(property.bedrooms || property.beds) && (
                                <div className="flex items-center">
                                  <Bed className="w-4 h-4 mr-1.5 text-gray-500" />
                                  <span className="text-sm text-gray-600">{property.bedrooms || property.beds} Oda</span>
                                </div>
                              )}
                              {(property.bathrooms || property.baths) && (
                                <div className="flex items-center">
                                  <Bath className="w-4 h-4 mr-1.5 text-gray-500" />
                                  <span className="text-sm text-gray-600">{property.bathrooms || property.baths} Banyo</span>
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
                      <a 
                        href={`tel:${agent.phone}`} 
                        onClick={(e) => {
                          e.preventDefault();
                          handleContact('phone');
                        }}
                        className="text-gray-900 font-medium hover:text-orange-500"
                      >
                        {agent.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">E-posta</p>
                      <a 
                        href={`mailto:${agent.email}`} 
                        onClick={(e) => {
                          e.preventDefault();
                          handleContact('email');
                        }}
                        className="text-gray-900 font-medium hover:text-orange-500"
                      >
                        {agent.email}
                      </a>
                    </div>
                  </div>
                  
                  {agent.company && (
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Şirket</p>
                        <p className="text-gray-900 font-medium">{agent.company.name}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Adres</p>
                      <p className="text-gray-900">Antalya, Türkiye</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={() => handleContact('whatsapp')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp ile Mesaj Gönder
                  </Button>
                  
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleContact('email')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    E-posta Gönder
                  </Button>
                </div>
              </div>
              
              {/* Company Card */}
              {agent.company && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Bağlı Olduğu Şirket</h3>
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16 mr-4">
                      <Image
                        src="/villasantalya-logo.png" // Gerçek logo için API entegrasyonu gerekiyor
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
                    <button 
                      onClick={handleViewCompany}
                      className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
                    >
                      Şirket Profilini Görüntüle
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
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