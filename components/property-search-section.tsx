"use client"
import { useState } from "react"
import { Building, Warehouse, Store, Building2, Home, ChevronLeft, ChevronRight } from "lucide-react"

const allPropertyTypes = [
  {
    id: 1,
    title: "Daire",
    count: "5 Listeleme",
    icon: Building,
    color: "bg-blue-100",
  },
  {
    id: 2,
    title: "Depo",
    count: "3 Listeleme",
    icon: Warehouse,
    color: "bg-orange-100",
  },
  {
    id: 3,
    title: "Tekil Mağaza",
    count: "6 Listeleme",
    icon: Store,
    color: "bg-green-100",
  },
  {
    id: 4,
    title: "Ticari",
    count: "6 Listeleme",
    icon: Building2,
    color: "bg-purple-100",
  },
  {
    id: 5,
    title: "Toplu Konut",
    count: "6 Listeleme",
    icon: Building,
    color: "bg-indigo-100",
  },
  {
    id: 6,
    title: "Villa",
    count: "4 Listeleme",
    icon: Home,
    color: "bg-pink-100",
  },
  {
    id: 7,
    title: "Arsa",
    count: "8 Listeleme",
    icon: Building2,
    color: "bg-yellow-100",
  },
  {
    id: 8,
    title: "Ofis",
    count: "12 Listeleme",
    icon: Building,
    color: "bg-teal-100",
  },
]

export default function PropertySearchSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const itemsPerSlide = 6
  const totalSlides = Math.ceil(allPropertyTypes.length / itemsPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentItems = () => {
    const startIndex = currentSlide * itemsPerSlide
    return allPropertyTypes.slice(startIndex, startIndex + itemsPerSlide)
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-orange-500 text-sm font-semibold mb-4 tracking-wider uppercase">YENİ LİSTELENEN</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Emlak Gereksinime Göre Arama
          </h2>
        </div>

        {/* Property Type Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {getCurrentItems().map((type, index) => (
              <div
                key={type.id}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 relative overflow-hidden"
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <type.icon className="w-8 h-8 text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300">
                    {type.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-orange-500 transition-colors duration-300 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    {type.count}
                  </p>
                  <p className="text-sm font-bold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-6 left-0 right-0">
                    Detayları Göster
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute -left-16 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-orange-500 w-8" : "bg-gray-300 hover:bg-orange-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
