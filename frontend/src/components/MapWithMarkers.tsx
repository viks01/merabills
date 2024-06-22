import React, { useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

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
  height: '600px',
};

const center = {
  lat: 40.5,
  lng: -74.0,
};

// Replace 'YOUR_MAP_ID' with your actual Map ID obtained from the Google Cloud Console
const MAP_ID = 'YOUR_MAP_ID';

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ selectedKeys, markerOptions }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_API_KEY',
    libraries: ['marker'],
    mapIds: [MAP_ID],
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && selectedKeys.length > 0) {
      console.log('Filtered Markers:', filteredMarkers);
    }
  }, [selectedKeys]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const filteredMarkers = markerOptions.filter(option => selectedKeys.includes(option.key));

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {filteredMarkers.map(option => (
        <AdvancedMarkerElement
          key={option.key}
          position={option.position}
          title={option.title}
          icon={option.icon}
          map={mapRef.current}
        />
      ))}
    </GoogleMap>
  );
};

const AdvancedMarkerElement: React.FC<{
  position: google.maps.LatLngLiteral;
  title: string;
  icon: string;
  map: google.maps.Map | null;
}> = ({ position, title, icon, map }) => {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markerRef.current || !map) return;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      title,
      content: markerRef.current,
    });

    marker.map = map; // Associate the marker with the map

    return () => {
      marker.map = null; // Remove marker from the map
    };
  }, [position, title, map]);

  return (
    <div ref={markerRef} style={{ display: 'none' }}>
      <img src={icon} alt={title} />
    </div>
  );
};

export default MapWithMarkers;
