import React, { useState } from 'react';
// import LocationForm from './components/LocationForm';
import FilterChips, { Option } from './components/FilterChips';
import { CssBaseline } from '@mui/material';


const App: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<ReadonlyArray<number>>([]);
  const multiSelectedAllowed = false;

  const options: ReadonlyArray<Option> = [
    new Option("Home", 1, "home", 'primary'),
    new Option("Settings", 2, "settings", 'secondary'),
    new Option("Info", 3, "info", 'success'),
  ];

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
    </div>
  );
}

export default App;
