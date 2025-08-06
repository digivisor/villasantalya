'use client';

import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from 'react'
import { getContactInfo, getSocialLinks, getWorkingHours, WorkingHours } from '../app/services/settings.service'

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: ''
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: ''
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    weekday: { start: '09:00', end: '18:00' },
    saturday: { start: '10:00', end: '14:00' },
    sunday: { isOpen: false, start: '00:00', end: '00:00' }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

        const contactData = await getContactInfo(token);
        setContactInfo(contactData);

        const socialData = await getSocialLinks(token);
        setSocialLinks(socialData);

        const hoursData = await getWorkingHours(token);
        setWorkingHours(hoursData);
      } catch (error) {
        console.error("Footer bilgileri yüklenirken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  const formatWorkingHours = (hours: WorkingHours) => (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-2">
        <Clock className="w-5 h-5 text-orange-500" />
        <span>
          <span className="font-semibold">Hafta içi:</span> {hours.weekday.start} - {hours.weekday.end}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Clock className="w-5 h-5 text-orange-500" />
        <span>
          <span className="font-semibold">Cumartesi:</span> {hours.saturday.start} - {hours.saturday.end}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Clock className="w-5 h-5 text-orange-500" />
        <span>
          <span className="font-semibold">Pazar:</span> {hours.sunday.isOpen ? `${hours.sunday.start} - ${hours.sunday.end}` : "Kapalı"}
        </span>
      </div>
    </div>
  );

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 items-start">
          {/* Company Info */}
          <div className="space-y-6 flex flex-col items-center text-center">
            <Image
              src="/villasantalya-logo.png"
              alt="VillasAntalya Logo"
              width={120}
              height={80}
              className="h-16 w-auto mx-auto"
            />
            <p className="text-gray-400 leading-relaxed">
              Antalya'nın en prestijli villa projelerini güvenilir bir platformda sunuyoruz. Hayalinizdeki evi bulmanız için buradayız.
            </p>
            <div className="flex space-x-4 items-center justify-center">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-6">Hızlı Linkler</h3>
            <ul className="space-y-3">
              <li>
                <a href="anasayfa" className="text-gray-400 hover:text-orange-500 transition-colors">Anasayfa</a>
              </li>
              <li>
                <a href="hakkimizda" className="text-gray-400 hover:text-orange-500 transition-colors">Hakkımızda</a>
              </li>
              <li>
                <a href="emlaklistesi" className="text-gray-400 hover:text-orange-500 transition-colors">Villa Listesi</a>
              </li>
              <li>
                <a href="blog" className="text-gray-400 hover:text-orange-500 transition-colors">Blog</a>
              </li>
              <li>
                <a href="iletisim" className="text-gray-400 hover:text-orange-500 transition-colors">İletişim</a>
              </li>
            </ul>
          </div>

          {/* Çalışma Saatleri */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-6">Çalışma Saatleri</h3>
            <div className="text-gray-400">
              {formatWorkingHours(workingHours)}
            </div>
          </div>

{/* İletişim */}
<div className="flex flex-col items-start text-left w-full">
  <h3 className="text-lg font-semibold mb-6">İletişim</h3>
  <div className="space-y-4 w-full">
    <div className="flex items-center gap-2 whitespace-nowrap">
      <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
      <span className="text-gray-400">{contactInfo.address}</span>
    </div>
    <div className="flex items-center gap-2 whitespace-nowrap">
      <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
      <span className="text-gray-400">{contactInfo.phone}</span>
    </div>
    <div className="flex items-center gap-2 whitespace-nowrap">
      <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
      <span className="text-gray-400">{contactInfo.email}</span>
    </div>
  </div>
</div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm text-center w-full md:w-auto">
            © 2025 &nbsp;
            <a
              href="https://digivisor.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Digivisor Growth Agency
            </a>
            <span className="ml-1" style={{ color: "#39FF14" }}>💚 </span>
            geliştirildi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}