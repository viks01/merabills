import React, { useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

export interface MarkerOption {
  key: number;
  position: google.maps.LatLngLiteral;
  title: string;
  icon: JSX.Element;
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

const MAP_ID = 'cfc96df6676c95e7';

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ selectedKeys, markerOptions }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDCzubYW6eVdZMqyp4ETXAOQaKEvdk9Mh4',
    libraries: ['places'],
    mapIds: [MAP_ID],
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && selectedKeys.length > 0) {
      const filteredMarkers = markerOptions.filter(option => selectedKeys.includes(option.key));
      console.log('Filtered Markers:', filteredMarkers);
    }
  }, [selectedKeys, markerOptions]);

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
        <MarkerF
          key={option.key}
          position={option.position}
          title={option.title}
        >
          {option.icon}
        </MarkerF>
      ))}
    </GoogleMap>
  );
};

export default MapWithMarkers;
