import React, { useState } from 'react';
// import LocationForm from './components/LocationForm';
import FilterChips, { Option } from './components/FilterChips';
import { CssBaseline } from '@mui/material';

// export class Option {
//     constructor(public readonly title: string, public readonly key: number, public readonly iconName: string) { }
// }

const App: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<ReadonlyArray<number>>([]);
  const options: ReadonlyArray<Option> = [
    new Option("Home", 1, "home"),
    new Option("Settings", 2, "settings"),
    new Option("Info", 3, "info"),
  ];
  const multiSelectedAllowed = true;

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
