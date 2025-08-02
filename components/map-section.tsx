import { MapPin, Home, Bath, Square } from "lucide-react"
import Image from "next/image"
import GoogleMap from "./google-map"

const properties = [
  {
    id: 1,
    name: "Symphony Court",
    address: "160 N , Thapa Magalar, NP 82662",
    area: "3568 Sq",
    beds: "2 Beds",
    baths: "4 Baths",
    image: "/placeholder.svg?height=400&width=600&text=Symphony+Court",
    lat: 36.7969,
    lng: 31.4497,
  },
  {
    id: 2,
    name: "Serendipity Gardens",
    address: "60, Jln 6D, NP 27570",
    area: "2500 Sq",
    beds: "2 Beds",
    baths: "4 Baths",
    image: "/placeholder.svg?height=400&width=600&text=Serendipity+Gardens",
    lat: 36.7769,
    lng: 31.4297,
  },
  {
    id: 3,
    name: "Panorama Place",
    address: "Pal utja ,25, HU 0321",
    area: "2598 Sq",
    beds: "3 Beds",
    baths: "4 Baths",
    image: "/placeholder.svg?height=400&width=600&text=Panorama+Place",
    lat: 36.7669,
    lng: 31.4597,
  },
  {
    id: 4,
    name: "Woodland Terrace",
    address: "Pine Street 45, Forest Hills",
    area: "2800 Sq",
    beds: "4 Beds",
    baths: "3 Baths",
    image: "/placeholder.svg?height=1000&width=1640&text=1640+×+1000",
    lat: 36.7569,
    lng: 31.4397,
  },
]

export default function MapSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="text-orange-500 text-sm font-semibold mb-4 tracking-wider uppercase">ÖZEL HİZMET</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
            Tüm Gayrimenkul İhtiyaçlarınız İçin
            <br />
            Tek Bir İrtibat Noktası
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Property Cards */}
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex">
                  {/* Property Image */}
                  <div className="w-40 h-28 bg-gray-200 flex-shrink-0 relative rounded-l-3xl overflow-hidden">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm font-medium">1640 × 1000</span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{property.name}</h3>

                    <div className="flex items-start text-orange-500 mb-3">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 leading-relaxed">{property.address}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Square className="w-4 h-4" />
                        <span className="text-sm font-medium">{property.area}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Home className="w-4 h-4" />
                        <span className="text-sm font-medium">{property.beds}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="w-4 h-4" />
                        <span className="text-sm font-medium">{property.baths}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="relative">
            <div className="h-[600px] overflow-hidden">
              <GoogleMap properties={properties} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
