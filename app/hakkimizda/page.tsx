"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Trophy,
  Settings,
  Heart,
  Target,
  Users,
  PhoneCall,
  Menu,
  X
} from "lucide-react"
import Image from "next/image"
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"
import Link from "next/link"
import Header from "@/components/Header"

const requirements = [
  {
    icon: Trophy,
    title: "Geçmiş Başarılar",
    description: "15+ yıllık sektör deneyimi",
  },
  {
    icon: Settings,
    title: "Hizmetler",
    description: "Kapsamlı emlak çözümleri",
  },
  {
    icon: Heart,
    title: "Tutku",
    description: "İşimize olan bağlılığımız",
  },
  {
    icon: Target,
    title: "Kararlılık",
    description: "Hedeflerimize odaklanma",
  },
  {
    icon: Users,
    title: "Bireysellik Değil Takım Ruhu",
    description: "Güçlü ekip çalışması",
  },
]

const processSteps = [
  {
    step: "ADIM 01",
    title: "Ara ve Listeyi Daralt",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    description: "İhtiyaçlarınıza uygun mülkleri filtreleyerek size en uygun seçenekleri sunuyoruz.",
  },
  {
    step: "ADIM 02",
    title: "Saha Ziyareti",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: "Seçtiğiniz mülkleri yerinde inceleme imkanı sağlıyoruz.",
  },
  {
    step: "ADIM 03",
    title: "Kredi Destek Hizmeti",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    description: "Finansman konusunda uzman ekibimizle destek alın.",
  },
  {
    step: "ADIM 04",
    title: "Hukuki Danışmanlık",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    description: "Tüm yasal süreçlerde yanınızdayız.",
  },
  {
    step: "ADIM 05",
    title: "Rezervasyon ve Satın Alma",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    description: "Güvenli bir şekilde satın alma işlemlerini tamamlayın.",
  },
]

const stats = [
  {
    number: "78B",
    label: "Memnun Müşteri",
    description: "Başarıyla tamamlanan işlemler",
  },
  {
    number: "10+",
    label: "Yıllık Tecrübe",
    description: "Sektördeki deneyimimiz",
  },
  {
    number: "3M",
    label: "Kurulmuş Konutlar",
    description: "Toplam mülk portföyümüz",
  },
]

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <Header/>

      {/* Hero Section */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image src="/about-hero-bg.jpg" alt="Hakkımızda" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Hakkımızda</h1>
              <div className="flex items-center space-x-2 text-base md:text-lg">
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Anasayfa
                </Link>
                <span>-</span>
                <span className="text-orange-500">Hakkımızda</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 md:mb-8">Mülkiyet Gereksinimi</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {requirements.map((requirement, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 group-hover:bg-orange-50">
                  <requirement.icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                </div>
                <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300">
                  {requirement.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 px-2">
                  {requirement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="text-orange-500 text-sm font-semibold mb-4 tracking-wider uppercase">SÜRECİMİZ</div>

            {/* Desktop Title */}
            <h2 className="hidden md:block text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8 max-w-4xl mx-auto">
              Tüm Ayrıcalıklarıyla Lüks{" "}
              <span className="inline-block relative mx-2">
                <Image
                  src="/villa-showcase-1.jpg"
                  alt="Lüks Villa"
                  width={80}
                  height={35}
                  className="rounded-2xl shadow-lg"
                />
              </span>{" "}
              Mülklerimize
              <br />
              <span className="inline-flex items-center gap-4 mt-4">
                <span>Hoş</span>
                <div className="relative">
                  <Image
                    src="/villa-showcase-2.png"
                    alt="Villa İç Mekan"
                    width={80}
                    height={30}
                    className="rounded-xl shadow-lg"
                  />
                </div>
                <span>Geldiniz</span>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    <div className="w-10 h-10 bg-orange-200 rounded-full border-2 border-white hover:scale-110 transition-transform duration-300 cursor-pointer shadow-md"></div>
                    <div className="w-10 h-10 bg-orange-300 rounded-full border-2 border-white hover:scale-110 transition-transform duration-300 cursor-pointer shadow-md"></div>
                    <div className="w-10 h-10 bg-orange-400 rounded-full border-2 border-white hover:scale-110 transition-transform duration-300 cursor-pointer shadow-md"></div>
                  </div>
                  <button className="w-14 h-14 bg-white hover:bg-orange-500 rounded-full text-orange-500 hover:text-white cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group">
                    <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                </div>
              </span>
            </h2>

            {/* Mobile Title */}
            <div className="block md:hidden">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
                Tüm Ayrıcalıklarıyla Lüks Mülklerimize Hoş Geldiniz
              </h2>

              {/* Mobile Images */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <Image
                  src="/villa-showcase-1.jpg"
                  alt="Lüks Villa"
                  width={60}
                  height={40}
                  className="rounded-xl shadow-lg"
                />
                <Image
                  src="/villa-showcase-2.png"
                  alt="Villa İç Mekan"
                  width={60}
                  height={40}
                  className="rounded-xl shadow-lg"
                />
              </div>

              {/* Mobile Play Button and Avatars */}
              <div className="flex justify-center items-center gap-4">
                <div className="flex -space-x-1">
                  <div className="w-8 h-8 bg-orange-200 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-orange-300 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white shadow-md"></div>
                </div>
                <button className="w-12 h-12 bg-white hover:bg-orange-500 rounded-full text-orange-500 hover:text-white cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
                  <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-orange-500 hidden lg:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg hidden lg:block group-hover:scale-125 transition-transform duration-300"></div>

                  <div className="text-center pt-12 lg:pt-20">
                    <div className="text-orange-500 text-sm font-semibold mb-4 tracking-wider">{step.step}</div>

                    <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300 cursor-pointer">
                      <div className="text-orange-500 group-hover:text-white transition-colors duration-300">
                        {step.icon}
                      </div>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300">
                      {step.title}
                    </h3>

                    {/* Description only on hover or for mobile always visible */}
                    <div className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 mt-4">
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed px-2 bg-white rounded-lg p-3 shadow-lg border-l-4 border-orange-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Villa Showcase Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Villa Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative h-64 md:h-80 lg:h-[500px] rounded-3xl overflow-hidden">
                <Image src="/about-villa-image.jpg" alt="Lüks Villa" fill className="object-cover" />

                {/* Decorative Shapes - Responsive */}
                <div className="absolute -top-3 -left-3 md:-top-6 md:-left-6 w-16 h-20 md:w-24 md:h-32 bg-blue-200 rounded-[1.5rem] md:rounded-[2rem] opacity-60"></div>
                <div className="absolute -bottom-3 -right-3 md:-bottom-6 md:-right-6 w-12 h-12 md:w-20 md:h-20 bg-blue-300 rounded-full opacity-60"></div>
              </div>

        

              {/* Team Avatars - Responsive */}
              <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-gray-800/80 rounded-full p-2 md:p-3 flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-200 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-300 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-400 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">69+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
              <div>
                <div className="text-orange-500 text-sm font-semibold mb-4 tracking-wider uppercase">
                  DÜNYA ÇAPINDAKİ MÜLKLER
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Tüm Kolaylıklarla Donatılmış Lüks Tesislerimize Hoş Geldiniz.
                </h2>
              </div>

              {/* Stats - Responsive */}
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                    <div className="text-xs md:text-sm text-gray-600">{stat.description}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-col gap-4">
                <Link href="/emlaklistesi">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Emlakları Keşfedin
                  </Button>
                </Link>

                <div className="flex items-center space-x-3 md:space-x-4 bg-gray-900 hover:bg-gray-800 text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Bizi Arayın</div>
                    <div className="text-sm text-orange-400 font-semibold">+90 551 389 52 55</div>
                  </div>
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