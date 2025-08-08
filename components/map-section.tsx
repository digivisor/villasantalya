"use client"
import { useState, useEffect } from "react"
import { MapPin, Home, Bath, Square, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import GoogleMap from "./google-map"
import propertyService from "../app/services/property.service"

interface MapProperty {
  id: string
  name: string
  address: string
  area: string
  beds: string
  baths: string
  image: string
  lat: number
  lng: number
  slug?: string
}

export default function MapSection() {
  const router = useRouter()
  const [displayProperties, setDisplayProperties] = useState<MapProperty[]>([])
  const [allMapProperties, setAllMapProperties] = useState<MapProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const response = await propertyService.getAllProperties({ limit: 20, hasLocation: true })
        if (response?.properties && Array.isArray(response.properties)) {
          // YALNIZCA status === "active" ve isApproved === true olanlar
          const filtered = response.properties.filter(
            (p) => 
              p.status === "active" && 
              (p.isApproved === true || p.isApproved === "true") && 
              p.location && 
              ((p.location.coordinates?.length === 2) || (p.location.lat && p.location.lng))
          )
          const mapped = filtered.map(p => {
            const coords = p.location.coordinates
            const lat = coords?.[1] ?? Number(p.location.lat)
            const lng = coords?.[0] ?? Number(p.location.lng)
            return {
              id: p._id,
              name: p.title,
              address: p.address ? `${p.address}, ${p.district || ''}, ${p.city || ''}` : `${p.district || ''}, ${p.city || ''}`,
              area: `${p.area} m²`,
              beds: `${p.bedrooms || p.beds || 0} Oda`,
              baths: `${p.bathrooms || p.baths || 0} Banyo`,
              image: formatImageUrl(p.mainImage),
              lat,
              lng,
              slug: p.slug,
            }
          })
          setAllMapProperties(mapped)
          setDisplayProperties(mapped.slice(0, 4))
        } else {
          setAllMapProperties([])
          setDisplayProperties([])
        }
        setError(null)
      } catch (err: any) {
        console.error('Emlak verileri çekilirken hata:', err)
        setError(err.message || 'Veriler yüklenirken bir hata oluştu')
        setAllMapProperties([])
        setDisplayProperties([])
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatImageUrl = (path?: string) => {
    if (!path) return "/placeholder-property.jpg"
    if (path.startsWith('http')) return path
    const base = process.env.NEXT_PUBLIC_API_URL
    return base ? `https://api.villasantalya.com${path}` : path
  }

  const handlePropertyClick = (property: MapProperty) => {
    router.push(`/emlaklistesi/${property.slug || property.id}`)
  }

  const defaultProperties: MapProperty[] = [
    {
      id: 'default1',
      name: 'VillasAntalya Merkez Ofis',
      address: 'Lara, Muratpaşa, Antalya',
      area: '150 m²',
      beds: 'Ofis',
      baths: '2 Banyo',
      image: '/villasantalya-logo.png',
      lat: 36.8969,
      lng: 30.7133,
    },
  ]

  const propertiesToShow = displayProperties.length ? displayProperties : defaultProperties
  const mapProperties = allMapProperties.length ? allMapProperties : defaultProperties

  return (
    <section className="py-10 px-2 sm:px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <span className="text-orange-500 text-xs sm:text-sm font-semibold mb-4 tracking-wider uppercase block">
            ÖZEL HİZMET
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
            Tüm Gayrimenkul İhtiyaçlarınız İçin<br className="hidden sm:block" />Tek Bir İrtibat Noktası
          </h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-16 sm:py-20">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div className="space-y-5">
              {propertiesToShow.map(property => (
                <div
                  key={property.id}
                  onClick={() => handlePropertyClick(property)}
                  className="group flex bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer"
                >
                  {/* Aspect Ratio kullanımı ile tam dolu resim */}
                  <div className="w-28 sm:w-40 flex-shrink-0 aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover block"
                      style={{ display: 'block' }}
                      draggable={false}
                    />
                  </div>
                  <div className="flex-1 px-4 py-3 sm:p-5 flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{property.name}</h3>
                    <div className="flex items-center text-orange-500 mb-2 sm:mb-3">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {property.address}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Square className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium">{property.area}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Home className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium">{property.beds}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium">{property.baths}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mapse relative mt-6 lg:mt-0">
              {error ? (
                <div className="bg-red-50 p-6 rounded-xl border border-red-200 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
                  <p className="text-red-600 text-center">{error}</p>
                </div>
              ) : (
                <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl border border-gray-200">
                  <GoogleMap properties={mapProperties} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
