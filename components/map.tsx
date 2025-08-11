'use client';

import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  markerTitle?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const Map: React.FC<MapProps> = ({ lat, lng, zoom = 10, markerTitle = 'İlan Konumu' }) => {
  const [showInfoWindow, setShowInfoWindow] = React.useState(false);

  const center = {
    lat: lat,
    lng: lng,
  };

  // Google Maps API anahtarı
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        <Marker
          position={center}
          onClick={() => setShowInfoWindow(true)}
        >
          {showInfoWindow && (
            <InfoWindow
              position={center}
              onCloseClick={() => setShowInfoWindow(false)}
            >
              <div>
                <h3 className="font-medium">{markerTitle}</h3>
                <p className="text-sm">{`${lat.toFixed(6)}, ${lng.toFixed(6)}`}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
