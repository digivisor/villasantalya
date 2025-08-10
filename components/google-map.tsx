"use client";
import { useEffect, useRef, useState } from "react";
import propertyService from "../app/services/property.service";
import { useRouter } from "next/navigation";

interface MapProperty {
  _id: string;
  title: string;
  slug?: string;
  image?: string;
  discountedPrice?: string;
  price?: string | number;
  currency?: string;
  address?: string;
  district?: string;
  city?: string;
  location: { lat: number; lng: number };
  mainImage?: string;
  area?: string;
  beds?: string;
  baths?: string;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const MAP_STYLE = [
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#8994b5" }] },
  { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "labels.text", stylers: [{ color: "#b3b8d7" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f8fb" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f0f3f6" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#e4eaf1" }] },
  { featureType: "road", elementType: "labels.text", stylers: [{ color: "#b3b8d7" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#e1eafa" }] },
  { featureType: "water", elementType: "labels.text", stylers: [{ color: "#b3b8d7" }] },
];

function useGoogleMapsScript() {
  useEffect(() => {
    if (typeof window === "undefined" || (window as any).google?.maps) return;
    if (!GOOGLE_MAPS_API_KEY) return;
    if (document.querySelector('script[data-google-maps="true"]')) return;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps", "true");
    document.head.appendChild(script);
  }, []);
}

function getCurrencySymbol(curr?: string) {
  switch (curr) {
    case "TRY":
      return "₺";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "";
  }
}

export default function GoogleMap() {
  const [properties, setProperties] = useState<MapProperty[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const fitBoundsOnce = useRef(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useGoogleMapsScript();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await propertyService.getAllProperties({
          limit: 40,
          status: "active",
          isApproved: true,
          hasLocation: true,
        });
        let data = response?.properties || [];
        data = data.filter((p: any) =>
          p.location &&
          ((p.location.coordinates?.length === 2) || (p.location.lat && p.location.lng))
        );
        const result = data.map((p: any) => {
          const coords = p.location?.coordinates;
          const lat = coords?.[1] ?? Number(p.location?.lat);
          const lng = coords?.[0] ?? Number(p.location?.lng);
          return {
            _id: p._id,
            title: p.title,
            slug: p.slug,
            image: p.image,
            price: p.price,
            discountedPrice: p.discountedPrice,
            currency: p.currency,
            address: p.address,
            district: p.district,
            city: p.city,
            location: { lat, lng },
            mainImage: p.mainImage,
            area: p.area ? `${p.area} m²` : "",
            beds: `${p.bedrooms || p.beds || 0} Oda`,
            baths: `${p.bathrooms || p.baths || 0} Banyo`,
          } as MapProperty;
        });
        setProperties(result);
      } catch (err) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !properties.length) return;
    if (!(window as any).google?.maps) return;
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      const firstLocation = properties[0]?.location;
      if (!firstLocation) return;
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: firstLocation.lat, lng: firstLocation.lng },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: MAP_STYLE as any,
        backgroundColor: "#f8fafd",
        gestureHandling: "greedy",
      });
    }

    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();
    properties.forEach((property) => {
      const marker = new window.google.maps.Marker({
        position: { lat: property.location.lat, lng: property.location.lng },
        map: mapInstance.current,
        title: property.title,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
              <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <filter id="shadow" x="-4" y="-2" width="56" height="66">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#a0aec0" flood-opacity="0.18"/>
                </filter>
                <g filter="url(#shadow)">
                  <path d="M24 2C12.95 2 4 10.95 4 22.01C4 38.5 24 54 24 54C24 54 44 38.5 44 22.01C44 10.95 35.05 2 24 2Z" fill="#F4724D"/>
                  <circle cx="24" cy="22" r="8" fill="white"/>
                </g>
              </svg>
            `),
          scaledSize: new window.google.maps.Size(24, 28),
          anchor: new window.google.maps.Point(12, 28),
        },
      });
      const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return "";
        if (!imagePath.startsWith("http")) {
          return `https://api.villasantalya.com${imagePath}`;
        }
        return imagePath;
      };
      const imgSrc = getImageUrl(property.mainImage);

      // Fiyat ve para birimi simgesi
      const priceSymbol = getCurrencySymbol(property.currency);

      const kart = `
  <div style="
    min-width:280px; max-width:320px;
    background:#ffffff;
    border-radius:1px;
    box-shadow:0 8px 32px rgba(0,0,0,0.12);
    padding:0;
    overflow:hidden;
    border:none;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    ">
    <div style="width:100%;height:140px;position:relative;overflow:hidden;">
      <img src="${imgSrc}" alt="${property.title}" style="
        width:100%;height:100%;object-fit:cover;display:block;
        border-radius:16px 16px 0 0;
      " />
      ${
  property.discountedPrice
    ? `<span style="position:absolute;bottom:8px;right:20px;background:#f4724d;color:#fff;padding:2px 10px;border-radius:8px;font-weight:bold;font-size:1rem;">
        ${priceSymbol} ${property.discountedPrice}
      </span>`
    : property.price
    ? `<span style="position:absolute;bottom:8px;right:12px;background:#f4724d;color:#fff;padding:2px 10px;border-radius:8px;font-weight:bold;font-size:1rem;">
        ${priceSymbol} ${property.price}
      </span>`
    : ""
}
    </div>
    <div style="padding:16px 18px 18px 18px;">
      <div style="font-size:1.1rem;font-weight:600;color:#1a1a1a;margin-bottom:8px;line-height:1.3;">
        <a href="/emlaklistesi/${property.slug}" style="color:#f4724d;text-decoration:underline;cursor:pointer;" target="_blank">${property.title}</a>
      </div>
      <div style="display:flex;align-items:flex-start;font-size:0.9rem;color:#6b7280;">
        <svg width="14" height="14" fill="none" style="margin-right:6px;margin-top:2px;min-width:14px;">
          <path d="M7 0C4 0 1 3 1 6c0 4 6 8 6 8s6-4 6-8c0-3-3-6-6-6z" fill="#ef4444"/>
          <circle cx="7" cy="6" r="2" fill="#fff"/>
        </svg>
        <span style="font-size:0.9rem;color:#6b7280;font-weight:bold;line-height:1.4;">
        ${(property.address || "").replace(", ,", ",")}${property.district ? ", " + property.district : ""}${property.city ? ", " + property.city : ""}
        </span>
      </div>
      <div style="margin-top:12px;font-size:0.9rem;color:#4b5563;line-height:1.4;">
        <div style="display:flex;align-items:center;margin-bottom:6px;">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
            <g fill="#f4724d" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M15,2c-0.26138,0.00002 -0.51237,0.10237 -0.69922,0.28516l-10.9082,8.92187c-0.0126,0.00947 -0.02497,0.01924 -0.03711,0.0293l-0.03711,0.03125v0.00195c-0.20274,0.18887 -0.31802,0.45339 -0.31836,0.73047c0,0.55228 0.44772,1 1,1h1v11c0,1.105 0.895,2 2,2h16c1.105,0 2,-0.895 2,-2v-11h1c0.55228,0 1,-0.44772 1,-1c0.0002,-0.27776 -0.11513,-0.54309 -0.31836,-0.73242l-0.01562,-0.01172c-0.02194,-0.01988 -0.04475,-0.03878 -0.06836,-0.05664l-1.59766,-1.30664v-3.89258c0,-0.552 -0.448,-1 -1,-1h-1c-0.552,0 -1,0.448 -1,1v1.43945l-6.32227,-5.17187c-0.18422,-0.17125 -0.42621,-0.26679 -0.67773,-0.26758zM18,15h4v8h-4z"></path></g></g>
          </svg>
          <span style="font-size:0.9rem;color:#6b7280;font-weight:bold;line-height:1.4;"> &nbsp${property.area}- ${property.beds} - ${property.baths} </span>
        </div>
      </div>
    </div>
  </div>
`;

      marker.addListener("click", () => {
        infoWindowRef.current.setContent(kart);
        infoWindowRef.current.open(mapInstance.current, marker);
      });

      const pos = marker.getPosition();
      if (pos) bounds.extend(pos);
      markersRef.current.push(marker);
    });

    if (properties.length > 1 && !fitBoundsOnce.current) {
      mapInstance.current.fitBounds(bounds);
      fitBoundsOnce.current = true;
    }

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [properties, GOOGLE_MAPS_API_KEY]);

  return (
    <div ref={mapRef} className="h-full" style={{ minHeight: "700px", minWidth: "700px" }} />
  );
}
