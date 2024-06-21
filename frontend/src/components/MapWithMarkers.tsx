import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export interface MarkerOption {
  key: number;
  position: google.maps.LatLngLiteral;
  title: string;
  icon: string;
}

interface MapWithMarkersProps {
  selectedKeys: ReadonlyArray<number>;
  markerOptions: ReadonlyArray<MarkerOption>;
}

const containerStyle = {
  width: '800px',
  height: '600px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ selectedKeys, markerOptions }) => {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {markerOptions
          .filter(option => selectedKeys.includes(option.key))
          .map(option => (
            <Marker
              key={option.key}
              position={option.position}
              title={option.title}
              icon={option.icon}
            />
          ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithMarkers;
