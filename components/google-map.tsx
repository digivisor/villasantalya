"use client"
import { useEffect, useRef } from "react"

interface Property {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  area: string
  beds: string
  baths: string
}

interface GoogleMapProps {
  properties: Property[]
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function GoogleMap({ properties }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap()
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBELzPJx5i7NYSgrQF5WVaU_QMgct5lyiQ&callback=initMap`
      script.async = true
      script.defer = true

      window.initMap = initializeMap

      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return

      // Manavgat, Antalya koordinatları
      const center = { lat: 36.7869, lng: 31.4397 }

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 10,
        center: center,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d1d5db" }, { lightness: 40 }],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#fefefe" }, { lightness: 20 }],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#f9fafb" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text",
            stylers: [{ color: "#d1d5db" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road",
            elementType: "labels.text",
            stylers: [{ color: "#e5e7eb" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#f3f4f6" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#e0f2fe" }, { lightness: 50 }],
          },
          {
            featureType: "water",
            elementType: "labels.text",
            stylers: [{ color: "#d1d5db" }],
          },
        ],
      })

      mapInstanceRef.current = map

      // Ana konum marker'ı - Büyük turuncu pin
      const mainMarker = new window.google.maps.Marker({
        position: { lat: 36.7869, lng: 31.4397 },
        map: map,
        title: "Vali Konakları &#8211; Cem Uzan",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
      <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 0C13.4315 0 0 13.4315 0 30C0 52.5 30 80 30 80S60 52.5 60 30C60 13.4315 46.5685 0 30 0Z" fill="#f97316"/>
        <circle cx="30" cy="30" r="12" fill="white"/>
        <path d="M30 22L31.5 27H36L32.75 29.5L34.25 34.5L30 32L25.75 34.5L27.25 29.5L24 27H28.5L30 22Z" fill="#f97316"/>
      </svg>
    `),
          scaledSize: new window.google.maps.Size(50, 67),
          anchor: new window.google.maps.Point(25, 67),
        },
      })

      // Info window'u otomatik aç
      const mainInfoWindow = new window.google.maps.InfoWindow({
        content: `
    <div style="padding: 8px 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
      <div style="color: #1f2937; font-size: 14px; font-weight: 500; margin: 0;">Vali Konakları &#8211; Cem Uzan</div>
    </div>
  `,
        disableAutoPan: true,
      })

      // Info window'u hemen aç
      mainInfoWindow.open(map, mainMarker)

      // Property marker'ları ekle - Küçük mavi pinler
      properties.forEach((property, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: property.lat, lng: property.lng },
          map: map,
          title: property.name,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0C6.71573 0 0 6.71573 0 15C0 26.25 15 40 15 40S30 26.25 30 15C30 6.71573 23.2843 0 15 0Z" fill="#3b82f6"/>
                <circle cx="15" cy="15" r="8" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(20, 27),
            anchor: new window.google.maps.Point(10, 27),
          },
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">${property.name}</h3>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${property.address}</p>
              <div style="display: flex; gap: 12px; color: #6b7280; font-size: 12px;">
                <span>📐 ${property.area}</span>
                <span>🛏️ ${property.beds}</span>
                <span>🛁 ${property.baths}</span>
              </div>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })
      })
    }

    loadGoogleMaps()

    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com"]')
      if (script) {
        script.remove()
      }
      delete window.initMap
    }
  }, [properties])

  return <div ref={mapRef} className="w-full h-full" style={{ minHeight: "600px" }} />
}
