"use client"
import { useState, useEffect } from "react"
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
  Mail,
  MessageCircle,
  Send,
  PhoneCall,
  Calendar,
  Menu,
  X
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ScrollToTop from "@/components/scroll-to-top"
import Footer from "@/components/footer"
import Header from "@/components/Header"

import { 
  getContactInfo, 
  getSocialLinks,
  getWorkingHours,
  type WorkingHours
} from '../services/settings.service';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Dinamik API'den gelen state'ler
  const [contactInfo, setContactInfo] = useState({
    address: "",
    phone: "",
    email: ""
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: ""
  });
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    weekday: { start: '', end: '' },
    saturday: { start: '', end: '' },
    sunday: { isOpen: false, start: '', end: '' }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
        // API'den verileri çek
        const [contactData, socialData, hoursData] = await Promise.all([
          getContactInfo(token),
          getSocialLinks(token),
          getWorkingHours(token)
        ]);
        setContactInfo(contactData);
        setSocialLinks(socialData);
        setWorkingHours(hoursData);
      } catch (error) {
        console.error("İletişim sayfası verileri yüklenemedi:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Form submission logic here
  }

  // Mobil menüyü aç/kapat
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Dinamik iletişim kartları - API verilerini karta çevir
  const contactCards = [
    {
      icon: Phone,
      title: "Telefon",
      info: contactInfo.phone,
      description: "7/24 ulaşabilirsiniz",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Mail,
      title: "E-posta",
      info: contactInfo.email,
      description: "Size 24 saat içinde dönüş yapacağız",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: MapPin,
      title: "Adres",
      info: contactInfo.address,
      description: "Ofisimizi ziyaret edebilirsiniz",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      info: `Pzt-Cmt: ${workingHours.weekday.start} - ${workingHours.weekday.end}`,
      description: workingHours.sunday.isOpen
        ? `Pazar: ${workingHours.sunday.start} - ${workingHours.sunday.end}`
        : "Pazar: Kapalı",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // Dinamik sosyal medya linkleri
  const socialIconData = [
    { icon: Facebook, name: "Facebook", url: socialLinks.facebook, color: "hover:text-blue-600" },
    { icon: Instagram, name: "Instagram", url: socialLinks.instagram, color: "hover:text-pink-600" },
    { icon: Twitter, name: "Twitter", url: socialLinks.twitter, color: "hover:text-blue-400" },
    { icon: Youtube, name: "YouTube", url: socialLinks.youtube, color: "hover:text-red-600" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <Header/>
      {/* Hero Section */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image src="/about-hero-bg.jpg" alt="Contact Hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">İletişim</h1>
              <div className="flex items-center space-x-2 text-base md:text-lg">
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Anasayfa
                </Link>
                <span>-</span>
                <span className="text-orange-500">İletişim</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-orange-500 text-sm font-semibold mb-3 md:mb-4 tracking-wider uppercase">
              İLETİŞİM BİLGİLERİ
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Bizimle İletişime Geçin</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-16">
            {contactCards.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl md:rounded-3xl p-6 md:p-8 shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
              >
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 ${item.color} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{item.title}</h3>
                <p className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">{item.info}</p>
                <p className="text-xs md:text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-8 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-xl md:rounded-3xl p-6 md:p-8 lg:p-12">
              <div className="mb-6 md:mb-8">
                <div className="text-orange-500 text-sm font-semibold mb-3 md:mb-4 tracking-wider uppercase">BİZE YAZIN</div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 md:mb-4">Mesajınızı Gönderin</h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  Sorularınız, önerileriniz veya emlak ihtiyaçlarınız için bizimle iletişime geçin. Uzman ekibimiz size
                  en kısa sürede dönüş yapacaktır.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Adınız Soyadınız"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 md:h-14 rounded-lg md:rounded-xl border-gray-200 text-gray-600 placeholder:text-gray-400 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="E-posta Adresiniz"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 md:h-14 rounded-lg md:rounded-xl border-gray-200 text-gray-600 placeholder:text-gray-400 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Telefon Numaranız"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 md:h-14 rounded-lg md:rounded-xl border-gray-200 text-gray-600 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      name="subject"
                      placeholder="Konu"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="h-12 md:h-14 rounded-lg md:rounded-xl border-gray-200 text-gray-600 placeholder:text-gray-400 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Textarea
                    name="message"
                    placeholder="Mesajınız"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-24 md:min-h-32 rounded-lg md:rounded-xl border-gray-200 text-gray-600 placeholder:text-gray-400 resize-none text-sm"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 md:h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-lg md:rounded-xl text-base md:text-lg font-semibold"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Mesajı Gönder
                </Button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-6 md:space-y-8">
              {/* Map */}
              <div className="bg-gray-50 rounded-xl md:rounded-3xl p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Ofis Lokasyonumuz</h3>
                <div className="h-56 md:h-64 bg-gray-200 rounded-lg md:rounded-2xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.7234567890123!2d30.7133!3d36.8969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDUzJzQ4LjgiTiAzMMKwNDInNDcuOSJF!5e0!3m2!1str!2str!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg md:rounded-2xl"
                  ></iframe>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-xl md:rounded-3xl p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Hızlı İletişim</h3>
<div className="space-y-3 md:space-y-4">
  {/* WhatsApp ile Mesaj Gönder */}
  <Button
    className="w-full h-12 md:h-14 bg-green-500 hover:bg-green-600 text-white rounded-lg md:rounded-xl text-sm md:text-base lg:text-lg font-semibold justify-start"
    asChild
  >
    <a
      href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
      <span className="truncate">WhatsApp ile Mesaj Gönder</span>
    </a>
  </Button>

  {/* Hemen Ara */}
  <Button
    className="w-full h-12 md:h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-lg md:rounded-xl text-sm md:text-base lg:text-lg font-semibold justify-start"
    asChild
  >
    <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}>
      <PhoneCall className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
      <span className="truncate">Hemen Ara: {contactInfo.phone}</span>
    </a>
  </Button>

  {/* Randevu Al (Arama başlatır) */}
  <Button
    className="w-full h-12 md:h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-lg md:rounded-xl text-sm md:text-base lg:text-lg font-semibold justify-start"
    asChild
  >
    <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}>
      <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
      <span className="truncate">Randevu Al</span>
    </a>
  </Button>
</div>


              </div>

              {/* Social Media */}
              <div className="bg-gray-50 rounded-xl md:rounded-3xl p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Sosyal Medya</h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {socialIconData.map((social, index) =>
                    social.url && (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-2 md:space-x-3 p-3 md:p-4 bg-white rounded-lg md:rounded-xl hover:shadow-md transition-all duration-300 ${social.color}`}
                      >
                        <social.icon className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-semibold text-sm md:text-base">{social.name}</span>
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-16 px-4 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Hayalinizdeki Villa İçin Hemen İletişime Geçin</h2>
          <p className="text-base md:text-lg lg:text-xl text-orange-100 mb-6 md:mb-8 leading-relaxed">
            Uzman ekibimiz size en uygun villa seçeneklerini sunmak için hazır. Ücretsiz danışmanlık hizmeti alın.
          </p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  {/* Hemen Ara */}
  <Button
    className="bg-white text-orange-500 hover:bg-gray-100 px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-semibold rounded-lg md:rounded-xl"
    asChild
  >
    <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}>
      <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
      Hemen Ara
    </a>
  </Button>

  {/* E-posta Gönder */}
  <Button
    variant="outline"
    className="border-white text-white hover:bg-white hover:text-orange-500 px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-semibold bg-transparent rounded-lg md:rounded-xl"
    asChild
  >
    <a href={`mailto:${contactInfo.email}`}>
      <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
      E-posta Gönder
    </a>
  </Button>
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