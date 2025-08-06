'use client';

import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Facebook, Twitter, Youtube, Instagram, Menu, X } from "lucide-react";
import Image from "next/image";
import NavLinks from "./NavLinks";
import { 
  getContactInfo, 
  getSocialLinks,
  getWorkingHours,
  type WorkingHours 
} from '../app/services/settings.service';

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
  linkedin: string;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: ''
  });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: ''
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
        
        const [contactData, socialData, hoursData] = await Promise.all([
          getContactInfo(token),
          getSocialLinks(token),
          getWorkingHours(token)
        ]);

        setContactInfo(contactData);
        setSocialLinks(socialData);
        setWorkingHours(hoursData);
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Daha kompakt çalışma saatleri formatı
// formatWorkingHours fonksiyonunu güncelle
const formatWorkingHours = () => {
  const weekday = `${workingHours.weekday.start} - ${workingHours.weekday.end}`;
  const saturday = `${workingHours.saturday.start} - ${workingHours.saturday.end}`;
  
  let schedule = `Hft içi: ${weekday}, Cmt: ${saturday}`;
  
  if (workingHours.sunday.isOpen) {
    schedule += `, Pzr: ${workingHours.sunday.start} - ${workingHours.sunday.end}`;
  }
  
  return schedule;
};

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-800/90 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Desktop View */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center space-x-6">
              {contactInfo.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="truncate max-w-[200px]">{contactInfo.address}</span>
                </div>
              )}
              {contactInfo.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>{contactInfo.phone}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{formatWorkingHours()}</span>
              </div>
              <div className="flex items-center space-x-3">
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Mobile View */}
<div className="md:hidden flex flex-col items-center space-y-2">
  {contactInfo.address && (
    <div className="flex items-center space-x-2">
      <MapPin className="w-5 h-4 text-orange-500" />
      <span className="truncate max-w-[200px]">{contactInfo.address}</span>
    </div>
  )}
  {contactInfo.phone && (
    <div className="flex items-center space-x-2">
      <Phone className="w-4 h-4 text-orange-500" />
      <span>{contactInfo.phone}</span>
    </div>
  )}
  <div className="flex items-center space-x-2">
    <Clock className="w-4 h-4 text-orange-500" />
    <span>{formatWorkingHours()}</span>
  </div>
  {/* Sosyal medya linkleri */}
  <div className="flex items-center space-x-2">

  </div>

            <div className="flex items-center space-x-3">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
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
            <NavLinks />
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
              <NavLinks 
                isMobile={true} 
                onLinkClick={() => setMobileMenuOpen(false)} 
              />
            </div>
          </nav>
        )}
      </header>
    </>
  );
}