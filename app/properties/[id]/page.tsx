"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Send,
  Mail,
  MessageCircle,
  DollarSign,
  User,
} from "lucide-react"
import Image from "next/image"
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"
import { useParams } from "next/navigation"
import Link from "next/link"

// Properties data
const allProperties = [
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
    parking: 1,
    yearBuilt: "2023",
    image: "/slider-1.jpg",
    images: ["/slider-1.jpg", "/slider-2.jpg", "/hero-background.jpg"],
    description:
      "Antalya'nın en prestijli lokasyonlarından Lara bölgesinde yer alan bu muhteşem daire, modern yaşamın tüm konforunu sunuyor. Deniz manzaralı bu özel konut, yüksek kaliteli malzemeler ve çağdaş tasarımıyla dikkat çekiyor.\n\nFerah ve aydınlık iç mekanlarıyla göz dolduran bu daire, açık plan mutfak ve oturma alanı, geniş yatak odaları ve lüks banyoları ile konforlu bir yaşam sunuyor. Büyük pencerelerden giren doğal ışık, evin her köşesini aydınlatırken, geniş balkonlar şehir ve deniz manzarasının tadını çıkarmanızı sağlıyor.\n\nYüksek kaliteli malzemeler ve modern tasarım detaylarıyla inşa edilen bu daire, akıllı ev sistemleri, yerden ısıtma, merkezi klima gibi lüks özelliklerle donatılmıştır. Rezidans sakinleri ayrıca yüzme havuzu, fitness merkezi, sauna ve 24 saat güvenlik gibi imkanlardan da faydalanabilir.",
    features: [
      "Deniz Manzarası",
      "Kapalı Otopark",
      "Güvenlik",
      "Yüzme Havuzu",
      "Fitness Center",
      "Çocuk Oyun Alanı",
      "Peyzaj Bahçesi",
      "Jeneratör",
      "Akıllı Ev",
      "Yerden Isıtma",
      "Merkezi Klima",
      "Ankastre Mutfak",
    ],
    agent: {
       id: "cem-uzan",
      name: "Cem Uzan",
      phone: "+90 551 389 52 55",
      email: "cem@villasantalya.com",
      image: "/agent-1.jpg",
      rating: 4.9,
    },
    tag: "Öne Çıkan",
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
    parking: 1,
    yearBuilt: "2024",
    image: "/slider-1.jpg",
    images: ["/slider-1.jpg", "/slider-2.jpg", "/hero-background.jpg"],
    description:
      "Lara'nın kalbi Kundu Mahallesi'nde konumlanan bu lüks rezidans, modern mimarisi ve üstün konforuyla öne çıkıyor. Geniş yaşam alanları ve kaliteli malzemelerle inşa edilmiştir.\n\nAvrupa standartlarında inşa edilen bu rezidans, ailenizle huzurlu bir yaşam sürdürmeniz için tasarlanmıştır. Konutunuz, yüksek tavanları ve geniş pencereleri ile ferah bir atmosfer yaratırken, özel tasarlanmış banyo ve mutfaklar günlük yaşamı kolaylaştırıcı detaylarla donatılmıştır.",
    features: [
      "Merkezi Konum",
      "Modern Tasarım",
      "Güvenlik",
      "Asansör",
      "Balkon",
      "Klima",
      "Doğalgaz",
      "İnternet Altyapısı",
    ],
    agent: {
           id: "ayse-demir",
      name: "Ayşe Demir",
      phone: "+90 532 123 45 67",
      email: "ayse@villasantalya.com",
      image: "/agent-2.jpg",
      rating: 4.7,
    },
    tag: "Yeni",
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
    parking: 1,
    yearBuilt: "2022",
    image: "/slider-1.jpg",
    images: ["/slider-1.jpg", "/slider-2.jpg", "/hero-background.jpg"],
    description:
      "Konyaaltı'nın muhteşem sahilinde yer alan bu daire, panoramik deniz manzarasıyla büyüleyici bir yaşam sunuyor. Plaja yürüme mesafesindeki bu konut, modern tasarımı ve kaliteli işçiliğiyle dikkat çekiyor.\n\nGün batımında deniz manzarasının tadını çıkarabileceğiniz geniş balkonuyla, her gününüz tatil havasında geçecek. Yenilikçi mimari ve kaliteli malzemelerin buluştuğu bu daire, hem yaşam alanı hem de yatırım açısından mükemmel bir fırsat sunuyor.",
    features: [
      "Deniz Manzarası",
      "Otopark",
      "Asansör",
      "Yüzme Havuzu",
      "Akdeniz Peyzajı",
      "Plaja Yakın",
      "Balkon",
      "Güvenlik",
    ],
    agent: {
       id: "mehmet-kaya",
      name: "Mehmet Kaya",
      phone: "+90 533 456 78 90",
      email: "mehmet@villasantalya.com",
      image: "/agent-3.jpg",
      rating: 4.8,
    },
    tag: "İndirimli",
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
    parking: 2,
    yearBuilt: "2023",
    image: "/slider-1.jpg",
    images: ["/slider-1.jpg", "/slider-2.jpg", "/hero-background.jpg"],
    description:
      "Muratpaşa'nın sakin ve elit bölgesinde konumlanan bu modern villa, lüks yaşam anlayışını yeniden tanımlıyor. Özel tasarım bahçesi, yüzme havuzu ve akıllı ev sistemleriyle donatılmış bu özel mülk, ayrıcalıklı bir yaşam sunuyor.\n\nÖzel tasarım mimarisi ile dikkat çeken villa, geniş ve ferah iç mekanları, yüksek tavanları ve lüks detaylarıyla premium bir yaşam alanı oluşturuyor. Doğal ışık alan salon ve yaşam alanları, özel tasarım mutfak ve banyolar ile konforu en üst düzeye çıkarıyor.",
    features: [
      "Havuz",
      "Bahçe",
      "Güvenlik",
      "Otopark",
      "Jakuzi",
      "Akıllı Ev",
      "Barbekü",
      "Şömine",
    ],
    agent: {
       id: "fatma-ozkan",
      name: "Fatma Özkan",
      phone: "+90 534 567 89 01",
      email: "fatma@villasantalya.com",
      image: "/agent-4.jpg",
      rating: 5.0,
    },
    tag: "Lüks",
  },
]

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = Number.parseInt(params.id as string)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const property = allProperties.find((p) => p.id === propertyId)

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">İlan Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız emlak ilanı sistemimizde bulunmamaktadır.</p>
          <Link href="/properties" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium inline-block">
            Tüm İlanlara Dön
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Comment submitted:", commentForm)
    // Handle comment submission
    alert("Yorumunuz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.")
    setCommentForm({ name: "", email: "", phone: "", message: "" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCommentForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR') + ' ₺';
  }

  // Sadece farklı türdeki benzer emlakları göster
  const relatedProperties = allProperties
    .filter((p) => p.id !== propertyId)
    .slice(0, 3)

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
            <a href="/contact" className="hover:text-orange-500 transition-colors">
              İletişim
            </a>
          </nav>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
            Giriş Yap / Kayıt Ol
          </Button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-orange-500 transition-colors">
              Anasayfa
            </a>
            <span>/</span>
            <a href="/properties" className="hover:text-orange-500 transition-colors">
              Emlak Listesi
            </a>
            <span>/</span>
            <span className="text-orange-500">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Property Images */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-96 lg:h-[600px] rounded-xl overflow-hidden mb-6">
            <Image
              src={property.images[currentImageIndex] || "/placeholder.svg"}
              alt={property.title}
              fill
              className="object-cover"
            />

            {/* Image Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-gray-700 hover:bg-white"
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
              </button>
              <button className="w-12 h-12 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-colors duration-300">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Type Badge */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold">
              {property.type}
            </div>

            {/* Tag Badge (if exists) */}
            {property.tag && (
              <div className="absolute top-4 left-24 bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                {property.tag}
              </div>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                  currentImageIndex === index ? "ring-2 ring-orange-500" : ""
                }`}
              >
                <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Info */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <div className="flex items-center text-orange-500 mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-gray-600">{property.fullAddress}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {property.discountedPrice ? (
                        <>
                          <span className="text-2xl lg:text-3xl font-bold text-orange-500">{formatPrice(property.discountedPrice)}</span>
                          <span className="text-lg line-through text-gray-400">{formatPrice(property.price)}</span>
                        </>
                      ) : (
                        <span className="text-2xl lg:text-3xl font-bold text-orange-500">{formatPrice(property.price)}</span>
                      )}
                    </div>
                    <div className="text-gray-500 text-sm">{property.type} Fiyatı</div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Square className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-base font-bold text-gray-900">{property.area} m²</div>
                    <div className="text-xs text-gray-600">Alan</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Bed className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-base font-bold text-gray-900">{property.beds}</div>
                    <div className="text-xs text-gray-600">Yatak Odası</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Bath className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-base font-bold text-gray-900">{property.baths}</div>
                    <div className="text-xs text-gray-600">Banyo</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Car className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-base font-bold text-gray-900">{property.parking}</div>
                    <div className="text-xs text-gray-600">Otopark</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h3>
                  {property.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Özellikler</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment Form */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bu İlan Hakkında Bilgi Alın</h3>
                <p className="text-gray-600 mb-4 text-sm">
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
                        className="h-12 rounded-lg border-gray-200 text-gray-600 placeholder:text-gray-400"
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
                        className="h-12 rounded-lg border-gray-200 text-gray-600 placeholder:text-gray-400"
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
                      className="h-12 rounded-lg border-gray-200 text-gray-600 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      placeholder="Bu emlak hakkındaki sorularınız veya yorumlarınız..."
                      value={commentForm.message}
                      onChange={handleInputChange}
                      className="min-h-32 rounded-lg border-gray-200 text-gray-600 placeholder:text-gray-400 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-base font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    İleti Gönder
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
  <h3 className="text-lg font-bold text-gray-900 mb-4">Emlak Danışmanı</h3>
  <div className="text-center">
    <div className="relative w-20 h-20 mx-auto mb-3">
      <Image
        src={property.agent.image || "/placeholder.svg"}
        alt={property.agent.name}
        fill
        className="object-cover rounded-full"
      />
    </div>
    <h4 className="text-base font-bold text-gray-900 mb-2">{property.agent.name}</h4>
    <div className="flex items-center justify-center space-x-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < Math.floor(property.agent.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({property.agent.rating})</span>
    </div>

    <div className="space-y-3">
      <Button className="w-full h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold">
        <MessageCircle className="w-4 h-4 mr-1.5" />
        WhatsApp
      </Button>
      <Button className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold">
        <Phone className="w-4 h-4 mr-1.5" />
        {property.agent.phone}
      </Button>
      <Button
        variant="outline"
        className="w-full h-10 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-lg text-sm font-semibold bg-transparent"
      >
        <Mail className="w-4 h-4 mr-1.5" />
        E-posta Gönder
      </Button>
     <Button
  variant="secondary"
  className="w-full h-10 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold"
  asChild
>
  <Link href={`/agents/${property.agent.id}`}>
    <User className="w-4 h-4 mr-1.5" />
    Profili Görüntüle
  </Link>
</Button> 
    </div>
  </div>
</div>

              {/* Property Details */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Emlak Detayları</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Emlak Türü:</span>
                    <span className="font-medium text-gray-900">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">İlan Türü:</span>
                    <span className="font-medium text-gray-900">{property.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Alan:</span>
                    <span className="font-medium text-gray-900">{property.area} m²</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Yapım Yılı:</span>
                    <span className="font-medium text-gray-900">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Yatak Odası:</span>
                    <span className="font-medium text-gray-900">{property.beds}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Banyo:</span>
                    <span className="font-medium text-gray-900">{property.baths}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">İlan No:</span>
                    <span className="font-medium text-gray-900">#{property.id.toString().padStart(6, "0")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Benzer Emlaklar</h2>
            <p className="text-gray-600 text-sm mt-1">Size uygun diğer emlak seçeneklerini keşfedin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProperties.map((relatedProperty) => (
              <Link
                key={relatedProperty.id}
                href={`/properties/${relatedProperty.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={relatedProperty.image || "/placeholder.svg"}
                    alt={relatedProperty.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    {relatedProperty.type}
                  </div>
                  
                  {/* Tag */}
                  {relatedProperty.tag && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      {relatedProperty.tag}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300 line-clamp-1">
                    {relatedProperty.title}
                  </h3>

                  <div className="flex items-start text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-orange-500" />
                    <span className="text-sm line-clamp-1">{relatedProperty.fullAddress}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-3">
                    <DollarSign className="h-4 w-4 mr-1 text-orange-500" />
                    <div className="flex items-center space-x-2">
                      {relatedProperty.discountedPrice ? (
                        <>
                          <span className="font-bold text-orange-500">{formatPrice(relatedProperty.discountedPrice)}</span>
                          <span className="text-sm line-through text-gray-400">{formatPrice(relatedProperty.price)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-orange-500">{formatPrice(relatedProperty.price)}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span className="text-xs text-gray-600">{relatedProperty.propertyType}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span className="text-xs text-gray-600">{relatedProperty.area} m²</span>
                    </div>
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span className="text-xs text-gray-600">{relatedProperty.beds} Oda</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span className="text-xs text-gray-600">{relatedProperty.baths} Banyo</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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