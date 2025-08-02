"use client"
import { useState } from "react"
import {
  MapPin,
  Square,
  Bed,
  Bath,
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
  Home,
  Key,
  Calendar,
  DollarSign,
} from "lucide-react"
import Image from "next/image"

const filterTabs = [
  { id: "all", label: "Tüm Mülkler", icon: Home },
  { id: "sale", label: "Satılık", icon: Key },
  { id: "long-rent", label: "Uzun Dönem Kiralama", icon: Calendar },
  { id: "rent", label: "Kiralık", icon: DollarSign },
]

const allProperties = [
  {
    id: 1,
    title: "Vali Konakları — Cem Uzan",
    price: "$ 47,200",
    originalPrice: "$ 35,000",
    location: "Antalya Vali Konakları, Lara Muratpaşa, TR 07060",
    area: "3 Adet",
    beds: null,
    baths: null,
    image: "/slider-1.jpg",
    category: "sale",
  },
  {
    id: 2,
    title: "Oakwood Manor Estates",
    price: "$ 148,000",
    location: "25945 Washington Street, ID 1651612",
    area: "2468 Sq",
    beds: "5 Beds",
    baths: "3 Baths",
    image: "/placeholder.svg?height=400&width=600&text=1640×1000",
    category: "sale",
  },
  {
    id: 3,
    title: "Willowbrook Grey Estate",
    price: "$ 148,000",
    location: "75835 Herta Walks, indonesia, ID 796326",
    area: "2468 Sq",
    beds: "2 Beds",
    baths: "3 Baths",
    image: "/placeholder.svg?height=400&width=600&text=1640×1000",
    category: "rent",
  },
  {
    id: 4,
    title: "Timberland Interior Legacy",
    price: "$ 128,000",
    location: "6621 Sammy Gateway, Japan, JP 65651",
    area: "2598 Sq",
    beds: "2 Beds",
    baths: "4 Baths",
    image: "/placeholder.svg?height=400&width=600&text=1640×1000",
    category: "long-rent",
  },
  {
    id: 5,
    title: "Sunset Villa Paradise",
    price: "$ 320,000",
    location: "Kalkan, Antalya, TR 07960",
    area: "4500 Sq",
    beds: "4 Beds",
    baths: "3 Baths",
    image: "/placeholder.svg?height=400&width=600&text=1640×1000",
    category: "sale",
  },
  {
    id: 6,
    title: "Modern City Apartment",
    price: "$ 85,000",
    location: "Konyaaltı, Antalya, TR 07050",
    area: "1800 Sq",
    beds: "2 Beds",
    baths: "2 Baths",
    image: "/placeholder.svg?height=400&width=600&text=1640×1000",
    category: "rent",
  },
]

export default function MagnificentExperienceSection() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentSlide, setCurrentSlide] = useState(0)
  const itemsPerSlide = 4

  const getFilteredProperties = () => {
    if (activeTab === "all") return allProperties
    return allProperties.filter((property) => property.category === activeTab)
  }

  const filteredProperties = getFilteredProperties()
  const totalSlides = Math.ceil(filteredProperties.length / itemsPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentProperties = () => {
    const startIndex = currentSlide * itemsPerSlide
    return filteredProperties.slice(startIndex, startIndex + itemsPerSlide)
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setCurrentSlide(0) // Reset slide when filter changes
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-orange-500 text-sm font-semibold mb-4 tracking-wider uppercase">
            VİLLAS ANTALYA'YI KEŞFEDİN
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Görkemli Deneyim
          </h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-500 hover:scale-105"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getCurrentProperties().map((property, index) => (
              <div
                key={property.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer hover:scale-105 border border-gray-100"
              >
                {/* Property Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Price Tag */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-2xl shadow-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{property.price}</span>
                      {property.originalPrice && (
                        <span className="text-sm line-through text-orange-200">{property.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 hover:scale-110">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 hover:scale-110">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Placeholder Text for Demo Images */}
                  {property.image.includes("placeholder") && (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg font-medium">1640 × 1000</span>
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                    {property.title}
                  </h3>

                  <div className="flex items-start text-orange-500 mb-4">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 leading-relaxed line-clamp-2">{property.location}</span>
                  </div>

                  {/* Property Stats */}
                  <div className="flex items-center justify-between text-gray-600 text-sm bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center space-x-1">
                      <Square className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">{property.area}</span>
                    </div>
                    {property.beds && (
                      <div className="flex items-center space-x-1">
                        <Bed className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{property.beds}</span>
                      </div>
                    )}
                    {property.baths && (
                      <div className="flex items-center space-x-1">
                        <Bath className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{property.baths}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
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
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {totalSlides > 1 && (
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
        )}
      </div>
    </section>
  )
}
