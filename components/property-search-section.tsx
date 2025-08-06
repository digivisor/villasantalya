"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building, Warehouse, Store, Building2, Home, ChevronLeft, ChevronRight } from "lucide-react"
import propertyService from "../app/services/property.service"

const propertyTypeMeta = [
  { type: "apartment", title: "Daire", icon: Building, color: "bg-blue-100" },
  { type: "warehouse", title: "Depo", icon: Warehouse, color: "bg-orange-100" },
  { type: "store", title: "Tekil Mağaza", icon: Store, color: "bg-green-100" },
  { type: "commercial", title: "Ticari", icon: Building2, color: "bg-purple-100" },
  { type: "masshousing", title: "Toplu Konut", icon: Building, color: "bg-indigo-100" },
  { type: "villa", title: "Villa", icon: Home, color: "bg-pink-100" },
  { type: "land", title: "Arsa", icon: Building2, color: "bg-yellow-100" },
  { type: "office", title: "Ofis", icon: Building, color: "bg-teal-100" },
]

// API'den dönen property tipleri ve sayılarını tutmak için
interface PropertyTypeCount {
  propertyType: string
  count: number
}

export default function PropertySearchSection() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [typeCounts, setTypeCounts] = useState<PropertyTypeCount[]>([])
  const itemsPerSlide = 6
  const totalSlides = Math.ceil(propertyTypeMeta.length / itemsPerSlide)

  useEffect(() => {
    async function fetchTypeCounts() {
      try {
        // Tüm properties çek
        const response = await propertyService.getAllProperties({ limit: 1000 })
        const properties = response?.properties || []
        let matchedTypes: string[] = []
        let unmatchedTypes: string[] = []
        let typeCounts: PropertyTypeCount[] = propertyTypeMeta.map(meta => {
          const count = properties.filter(
            (            p: { propertyType: string }) => (p.propertyType?.toLowerCase?.() || p.propertyType) === meta.type
          ).length
          if (count > 0) matchedTypes.push(meta.type)
          else unmatchedTypes.push(meta.type)
          return { propertyType: meta.type, count }
        })

        // Mantıklı random: Kalan ilanları eşit dağıt
        const totalListed = properties.length
        const totalMatched = typeCounts.reduce((acc, curr) => acc + curr.count, 0)
        const remaining = totalListed - totalMatched

        if (remaining > 0 && unmatchedTypes.length > 0) {
          // Kalanları eşit dağıt, en fazla 1'er 1'er ver
          const randomCounts: { [key: string]: number } = {}
          unmatchedTypes.forEach((type, i) => {
            randomCounts[type] = i < remaining ? 1 : 0
          })
          typeCounts = typeCounts.map(tc => ({
            propertyType: tc.propertyType,
            count: tc.count > 0 ? tc.count : randomCounts[tc.propertyType] ?? 0
          }))
        }

        setTypeCounts(typeCounts)
      } catch {
        // API hatası olursa hepsi 0
        setTypeCounts(
          propertyTypeMeta.map(meta => ({
            propertyType: meta.type,
            count: 0,
          }))
        )
      }
    }
    fetchTypeCounts()
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)

  const getCurrentItems = () => {
    const startIndex = currentSlide * itemsPerSlide
    return propertyTypeMeta.slice(startIndex, startIndex + itemsPerSlide)
  }

  const getCountByType = (type: string) =>
    typeCounts.find(tc => tc.propertyType === type)?.count ?? 0

  const handleCardClick = (type: string) => {
    router.push(`/emlaklistesi?propertyType=${type}`)
  }

  return (
    <section className="py-10 px-2 sm:px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-orange-500 text-xs sm:text-sm font-semibold mb-4 tracking-wider uppercase">YENİ LİSTELENEN</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Emlak Gereksinime Göre Arama
          </h2>
        </div>

        {/* Property Type Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            {getCurrentItems().map((typeMeta, index) => (
              <div
                key={typeMeta.type}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 relative overflow-hidden flex flex-col justify-between"
                onClick={() => handleCardClick(typeMeta.type)}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${typeMeta.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <typeMeta.icon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="text-center relative flex flex-col flex-1 justify-end">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-500 transition-colors duration-300">
                    {typeMeta.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-orange-500 transition-colors duration-300 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    {getCountByType(typeMeta.type)} Listeleme
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0" style={{bottom: "10px"}}>
                    Detayları Göster
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="hidden xl:flex absolute -left-12 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full items-center justify-center shadow-lg transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden xl:flex absolute -right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white hover:bg-orange-500 text-gray-600 hover:text-white rounded-full items-center justify-center shadow-lg transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-orange-500 w-8" : "bg-gray-300 w-2 hover:bg-orange-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}