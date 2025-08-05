'use client';

import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface LocationPickerProps {
  center: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number };
}

const LocationPicker: React.FC<LocationPickerProps> = ({ center, onLocationSelect, selectedLocation }) => {
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(selectedLocation || null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });
  console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      onLocationSelect(lat, lng);
    }
  }, [onLocationSelect]);

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Harita yükleniyor...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={marker || center}
      zoom={marker ? 16 : 13}
      onClick={handleMapClick}
      options={mapOptions}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
};

export default LocationPicker;