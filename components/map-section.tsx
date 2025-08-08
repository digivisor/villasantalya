"use client"
import { useState, useEffect } from "react"
import { MapPin, Home, Bath, Square, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import GoogleMap from "./google-map"
import propertyService from "../app/services/property.service"
import styles from "../styles/map-section.module.css"

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
  mainImage?: string 
  price?: string | number
}

export default function MapSection() {
  const router = useRouter()
  const [allMapProperties, setAllMapProperties] = useState<MapProperty[]>([])
  const [activeSlide, setActiveSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const response = await propertyService.getAllProperties({ limit: 100, hasLocation: true })
        if (response?.properties && Array.isArray(response.properties)) {
          // YALNIZCA status === "active" ve isApproved === true ve featured === true olanlar
          const filtered = response.properties.filter(
            (p: { status: string; isApproved: string | boolean; featured: boolean | string; location: { coordinates: string | any[]; lat: any; lng: any } }) =>
              p.status === "active" &&
              (p.isApproved === true || p.isApproved === "true") &&
              (p.featured === true || p.featured === "true") &&
              p.location &&
              ((p.location.coordinates?.length === 2) || (p.location.lat && p.location.lng))
          )
          const mapped = filtered.map((p: {
            price: any, location: { coordinates: any; lat: any; lng: any }; _id: any; title: any; address: any; district: any; city: any; area: any; bedrooms: any; beds: any; bathrooms: any; baths: any; mainImage: string | undefined; slug: any 
          }) => {
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
              price:p.price
            }
          })
          setAllMapProperties(mapped)
        } else {
          setAllMapProperties([])
        }
        setError(null)
      } catch (err: any) {
        console.error('Emlak verileri çekilirken hata:', err)
        setError(err.message || 'Veriler yüklenirken bir hata oluştu')
        setAllMapProperties([])
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

  // SLIDER LOGIC
  const slideSize = 4
  const totalSlides = Math.ceil((allMapProperties.length || 1) / slideSize)
  const activeProperties =
    allMapProperties.length > 0
      ? allMapProperties.slice(activeSlide * slideSize, activeSlide * slideSize + slideSize)
      : defaultProperties

  const googleMapProperties = allMapProperties.map(p => ({
    _id: p.id,
    title: p.name,
    address: p.address,
    district: "", // veya gerektiği gibi doldur
    city: "",     // veya gerektiği gibi doldur
    location: { lat: p.lat, lng: p.lng },
    image: p.image,           
    mainImage: p.mainImage,   
    price: p.price,  
    area: p.area,
    beds: p.beds,
    baths: p.baths,
    slug: p.slug
  }));

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
              {activeProperties.map(property => (
                <div
                  key={property.id}
                  onClick={() => handlePropertyClick(property)}
                  className="group flex bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer"
                >
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
              {/* DOTSLAR */}
              {allMapProperties.length > slideSize && (
                <div className="flex justify-center mt-4 space-x-2">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-3 h-3 rounded-full border border-orange-400 
                        ${activeSlide === idx ? "bg-orange-500" : "bg-white"}
                        transition-colors`}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`İlan grubunu göster ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className={`${styles.mapse} relative mt-5 lg:mt-10`}>
              {error ? (
                <div className="bg-red-50 p-6 rounded-xl border border-red-200 h-[800px] sm:h-[800px] md:h-[800px] lg:h-[800px] flex items-center justify-center">
                  <p className="text-red-600 text-center">{error}</p>
                </div>
              ) : (
                <div className="  lg:w-[700px] h-[700px] sm:h-[200px] md:h-[200px] lg:h-[600px] "
                  style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <GoogleMap />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}