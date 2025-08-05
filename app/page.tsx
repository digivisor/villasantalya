"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, Facebook, Twitter, Youtube, Instagram, Home, Users, Star, Menu, X } from "lucide-react"
import Image from "next/image"
import LuxuryVillasSection from "@/components/luxury-villas-section"
import PropertySearchSection from "@/components/property-search-section"
import MagnificentExperienceSection from "@/components/magnificent-experience-section"
import MapSection from "@/components/map-section"
import StatsSection from "@/components/stats-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"

export default function VillaWebsite() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 8000) // 8 saniyede bir değişir

    return () => clearInterval(timer)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-900">
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
          {/* Logo Section */}
          <div className="flex items-center">
            <Image
              src="/villasantalya-logo.png"
              alt="VillasAntalya Logo"
              width={80}
              height={60}
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-orange-500 hover:text-orange-400 font-medium">
              Anasayfa
            </a>
            <a href="about" className="hover:text-orange-500 transition-colors">
              Hakkımızda
            </a>
            <a href="properties" className="hover:text-orange-500 transition-colors">
              Emlak Listesi
            </a>
            <a href="blog" className="hover:text-orange-500 transition-colors">
              Blog
            </a>
            <a href="contact" className="hover:text-orange-500 transition-colors">
              İletişim
            </a>
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
              <a href="#" className="text-orange-500 hover:text-orange-400 font-medium py-2">
                Anasayfa
              </a>
              <a href="about" className="text-white hover:text-orange-500 transition-colors py-2">
                Hakkımızda
              </a>
              <a href="properties" className="text-white hover:text-orange-500 transition-colors py-2">
                Emlak Listesi
              </a>
              <a href="blog" className="text-white hover:text-orange-500 transition-colors py-2">
                Blog
              </a>
              <a href="contact" className="text-white hover:text-orange-500 transition-colors py-2">
                İletişim
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Slider Section */}
      <div className="relative h-[70vh] md:h-screen overflow-hidden">
        {/* Slider Images */}
        <div className="relative w-full h-full">
          {[
            { src: "/hero-background.jpg", alt: "Luxury Villa at Sunset" },
            { src: "/slider-1.jpg", alt: "Villa with Pool at Evening" },
            { src: "/slider-2.jpg", alt: "Modern Villa Design" },
          ].map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className={`object-cover transition-transform duration-[30000ms] ease-out ${
                  currentSlide === index ? "scale-[1.02]" : "scale-100"
                }`}
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-orange-500 scale-125" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl">
              <div className="text-orange-500 text-sm font-semibold mb-4 md:mb-6 tracking-widest uppercase animate-fade-in-up">
                EN GÜVENİLİR
              </div>
              <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8 max-w-4xl animate-fade-in-up animation-delay-200">
                Ev, Daire ve Villa Satışı veya Kiralaması İçin Mükemmel Firma
              </h1>

              <div className="flex flex-wrap gap-4 lg:gap-8 text-white mt-8 md:mt-12 animate-fade-in-up animation-delay-400">
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-orange-500" />
                  <span className="text-sm md:text-base font-medium">2 Milyondan Fazla Emlak.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span className="text-sm md:text-base font-medium">46.789 Memnun Müşteri</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm md:text-base font-medium">4,8 — En Yüksek Puan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Search Section - NEW */}
      <PropertySearchSection />

      {/* Luxury Villas Section */}
      <LuxuryVillasSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Magnificent Experience Section - NEW */}
      <MagnificentExperienceSection />

      {/* Map Section */}
      <MapSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}