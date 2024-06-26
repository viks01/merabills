import React, { useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

import { MarkerSet } from './MarkerSet';

interface MapWithMarkersProps {
  selectedKeys: ReadonlyArray<number>;
  markerSets: ReadonlyArray<MarkerSet>;
}

const containerStyle = {
  width: '850px',
  height: '600px',
};

const center = {
  lat: 40.5,
  lng: -74.0,
};

const MAP_ID = 'YOUR_MAP_ID';

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ selectedKeys, markerSets }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_API_KEY',
    libraries: ['places'],
    mapIds: [MAP_ID],
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && selectedKeys.length > 0) {
      const filteredMarkerSets = markerSets.filter(markerSet => selectedKeys.includes(markerSet.filterChipOption.key));
      console.log('Filtered Markers:', filteredMarkerSets);
    }
  }, [selectedKeys, markerSets]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const filteredMarkerSets = markerSets.filter(markerSet => selectedKeys.includes(markerSet.filterChipOption.key));

  const filteredMarkers = filteredMarkerSets.flatMap(markerSet => markerSet.markers.map(marker => ({
    key: markerSet.filterChipOption.key,
    latLong: marker.latLong,
    title: markerSet.filterChipOption.title,
    icon: marker.component,
  })));

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {filteredMarkers.map(marker => (
        <MarkerF
          key={marker.key}
          position={new google.maps.LatLng(marker.latLong.lat, marker.latLong.long)}
          title={marker.title}
        >
          {marker.icon}
        </MarkerF>
      ))}
    </GoogleMap>
  );
};

export default MapWithMarkers;
