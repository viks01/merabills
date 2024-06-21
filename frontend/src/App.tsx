import React, { useState } from 'react';
// import LocationForm from './components/LocationForm';
import FilterChips, { Option } from './components/FilterChips';
import MapDialog from './components/MapDialog';
import { CssBaseline, Button } from '@mui/material';


const App: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<ReadonlyArray<number>>([]);
  const multiSelectedAllowed = false;
  const [mapOpen, setMapOpen] = useState(false);

  const options: ReadonlyArray<Option> = [
    new Option("John", 1, "person", 'primary', { lat: 40.712776, lng: -74.005974 }),
    new Option("Jane", 2, "person", 'secondary', { lat: 34.052235, lng: -118.243683 }),
    new Option("Doe", 3, "person", 'success', { lat: 41.878113, lng: -87.629799 }),
  ];

  const markerOptions = options.map(option => ({
    key: option.key,
    position: option.position,
    title: option.title,
    icon: `https://maps.google.com/mapfiles/ms/icons/${option.color}-dot.png`,
  }));

  return (
    <div className="App">
      <CssBaseline />
      {/* <LocationForm /> */}
      <FilterChips
        options={options}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        multiSelectedAllowed={multiSelectedAllowed}
      />
      <Button variant="contained" color="primary" onClick={() => setMapOpen(true)}>
        Show Map
      </Button>
      <MapDialog
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        selectedKeys={selectedKeys}
        markerOptions={markerOptions}
      />
    </div>
  );
}

export default App;
