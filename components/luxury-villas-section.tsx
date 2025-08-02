"use client"

import { MessageCircleQuestion, MessageSquareQuote } from "lucide-react"
import Image from "next/image"

export default function LuxuryVillasSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Images Section */}
          <div className="relative h-[500px] w-full">
            {/* Bottom Villa Image - Base Layer */}
            <div className="absolute bottom-0 left-0 right-4">
              {/* Dark decorative shapes behind bottom image */}
              <div className="absolute -left-8 -bottom-8 w-32 h-40 bg-gray-800 rounded-[3rem] -z-10"></div>

              {/* Bottom image container */}
              <div className="relative h-72 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
                <Image
                  src="https://www.villasantalya.com/wp-content/uploads/2025/02/home-img01.webp"
                  alt="Luxury Villa with Infinity Pool"
                  fill
                  className="object-cover"
                />

                {/* User Reviews Overlay */}
                <div className="absolute bottom-6 left-6 bg-black/85 backdrop-blur-sm rounded-2xl px-5 py-4 text-white">
                  <div className="flex items-center space-x-4">
                    {/* User Avatars */}
                    <div className="flex -space-x-3">
                      <div className="w-11 h-11 rounded-full border-3 border-white overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=44&width=44&text=👩"
                          alt="User 1"
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-11 h-11 rounded-full border-3 border-white overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=44&width=44&text=👨"
                          alt="User 2"
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-11 h-11 rounded-full border-3 border-white overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=44&width=44&text=👴"
                          alt="User 3"
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-11 h-11 rounded-full border-3 border-white overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=44&width=44&text=👨‍💼"
                          alt="User 4"
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-11 h-11 rounded-full bg-orange-500 border-3 border-white flex items-center justify-center text-xs font-bold">
                        69+
                      </div>
                    </div>
                    {/* Text */}
                    <div className="text-sm font-medium whitespace-nowrap">Dünya çapında en iyi derecelendiriler</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Villa Image - Overlapping Layer */}
            <div className="absolute top-0 left-12 right-0">
              {/* Blue decorative background */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-blue-400 rounded-[3rem] -z-10"></div>

              {/* Top image container */}
              <div className="relative h-64 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
                <Image
                  src="https://www.villasantalya.com/wp-content/uploads/2024/04/home-img02.png"
                  alt="Modern Villa with Angular Design"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="text-orange-500 text-sm font-semibold mb-4 tracking-wider uppercase">
                ANTALYA'NIN EN SEÇKİN VİLLALARI
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Tüm ayrıcalıklarıyla lüks mülklerimize hoş geldiniz.
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Antalya'nın en prestijli villa projelerini şeffaf ve güvenilir bir platformda sunmak, alıcıları
                hayalindeki evi bulmaları için yönlendirmek. Müşteri odaklı hizmet anlayışımızla her aşamada doğru ve
                detaylı bilgi sağlayarak güvenilir bir emlak deneyimi sağlamak.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Questions Feature */}
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <MessageCircleQuestion className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sorularınızı Yanıtlayın</h3>
                <p className="text-gray-600">Herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.</p>
              </div>

              {/* Quote Feature */}
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <MessageSquareQuote className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Bir Teklif Seçin</h3>
                <p className="text-gray-600">Yorumları incelemek için tıklayın.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
