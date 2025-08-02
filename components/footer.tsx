import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Image
              src="/villasantalya-logo.png"
              alt="VillasAntalya Logo"
              width={120}
              height={80}
              className="h-16 w-auto"
            />
            <p className="text-gray-400 leading-relaxed">
              Antalya'nın en prestijli villa projelerini güvenilir bir platformda sunuyoruz. Hayalinizdeki evi bulmanız
              için buradayız.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
              <Youtube className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Hızlı Linkler</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Anasayfa
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Villa Listesi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Hizmetlerimiz</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Villa Satışı
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Villa Kiralama
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Emlak Danışmanlığı
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Yatırım Danışmanlığı
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Yasal Destek
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">İletişim</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">Lara, Muratpaşa Antalya, Türkiye</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">+90 551 389 52 55</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">info@villasantalya.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 VillasAntalya. Tüm hakları saklıdır.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
              Kullanım Şartları
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
              Çerez Politikası
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
