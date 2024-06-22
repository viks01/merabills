import React from 'react';
import GoogleMapReact from 'google-map-react';

interface MarkerOption {
  key: number;
  position: google.maps.LatLngLiteral;
  title: string;
  icon: string;
}

interface SimpleMapProps {
  selectedKeys: ReadonlyArray<number>;
  markerOptions: ReadonlyArray<MarkerOption>;
}

interface AnyReactComponentProps {
  lat: number;
  lng: number;
  icon: string;
  text: string;
}

const AnyReactComponent: React.FC<AnyReactComponentProps> = ({ icon, text }) => (
  <div style={{
    position: 'relative',
    transform: 'translate(-50%, -50%)',
  }}>
    <img src={icon} alt={text} style={{ width: '24px', height: '24px' }} />
    <div style={{
      position: 'absolute',
      top: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'black',
      background: 'white',
      padding: '2px 5px',
      borderRadius: '3px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
      fontSize: '12px',
      whiteSpace: 'nowrap',
    }}>
      {text}
    </div>
  </div>
);

const SimpleMap: React.FC<SimpleMapProps> = ({ selectedKeys, markerOptions }) => {
  const defaultCenter = { lat: 40.712776, lng: -74.005974 }; // Default center (New York)
  const defaultZoom = 11; // Default zoom level

  return (
    <div style={{ height: '600px', width: '800px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: '' }} // You can leave this empty
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
      >
        {markerOptions
          .filter(option => selectedKeys.includes(option.key))
          .map(option => (
            <AnyReactComponent
              key={option.key}
              lat={option.position.lat}
              lng={option.position.lng}
              icon={option.icon}
              text={option.title}
            />
          ))}
      </GoogleMapReact>
    </div>
  );
};


export default SimpleMap;
