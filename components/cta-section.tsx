'use client';

import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { getContactInfo, getYoutubeVideoId } from '../app/services/settings.service'

interface ContactInfo {
  phone: string;
  email: string;
}

export default function CTASection() {
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ")
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Token'ı localStorage'dan al
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

        // Video ID'yi çek
        const videoData = await getYoutubeVideoId(token);
        if (videoData.videoId) {
          setVideoId(videoData.videoId);
        }

        // İletişim bilgilerini çek
        const contactData = await getContactInfo(token);
        setContactInfo(contactData);
      } catch (error) {
        console.error("Veriler çekilemedi:", error);
      }
    }
    
    fetchData();
  }, []);

  // Telefon numarasını formatla ve WhatsApp linki oluştur
  const formatPhoneForCall = (phone: string) => {
    return phone.replace(/\s/g, ''); // Boşlukları kaldır
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    const cleanNumber = phone.replace(/\s/g, '').replace(/^\+/, '');
    return `https://wa.me/${cleanNumber}`;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Hayalinizdeki Villayı Bulmanın Zamanı Geldi
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Antalya'nın en prestijli lokasyonlarında yer alan lüks villalarımızı keşfedin. Uzman ekibimiz size en
              uygun seçenekleri sunmak için hazır.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                onClick={() => window.location.href = `tel:${formatPhoneForCall(contactInfo.phone)}`}
              >
                <Phone className="w-5 h-5 mr-2" />
                Hemen Ara
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg font-semibold bg-transparent"
                onClick={() => window.open(formatPhoneForWhatsApp(contactInfo.phone), '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </div>

            <div className="mt-8 flex items-center space-x-6 text-orange-100">
              {contactInfo.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{contactInfo.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* YouTube Video */}
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title="Villa Tanıtım Videosu"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  )
}