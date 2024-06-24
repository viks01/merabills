import React, { useState } from 'react';
import { Button, CssBaseline, SvgIcon } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterChips, { Option } from './components/FilterChips';
import MapDialog from './components/MapDialog';

const App: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<ReadonlyArray<number>>([]);
  const multiSelectedAllowed = false;
  const [mapOpen, setMapOpen] = useState(false);

  const options: ReadonlyArray<Option> = [
    new Option("John", 1, "person", 'primary', { lat: 40.712776, lng: -74.005974 }),
    new Option("Jane", 2, "person", 'warning', { lat: 34.052235, lng: -118.243683 }),
    new Option("Doe", 3, "person", 'success', { lat: 41.878113, lng: -87.629799 }),
  ];

  const markerOptions = options.map(option => ({
    key: option.key,
    position: option.position,
    title: option.title,
    icon: <SvgIcon component={LocationOnIcon} />,
  }));

  return (
    <div className="App">
      <CssBaseline />
      <Button variant="contained" color="primary" onClick={() => setMapOpen(true)}>
        Show Map
      </Button>
      <MapDialog
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        selectedKeys={selectedKeys}
        markerOptions={markerOptions}
      >
        <FilterChips
          options={options}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          multiSelectedAllowed={multiSelectedAllowed}
        />
      </MapDialog>
    </div>
  );
}

export default App;
