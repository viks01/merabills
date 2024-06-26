import React, { useState } from 'react';
import { Button, CssBaseline, SvgIcon } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Person } from '@mui/icons-material';

import MapDialog from './components/MapDialog';
import { FilterChipOption } from './components/FilterChipOption';
import { LatLong } from './components/LatLong';
import { Marker, MarkerImpl } from './components/Marker';
import { MarkerSet } from './components/MarkerSet';
import MarkerSetViewer from './components/MarkerSetViewer';

const App: React.FC = () => {
  const [mapOpen, setMapOpen] = useState(false);
  const languageCode: string = "en-US";

  const markers: ReadonlyArray<Marker> = [
    new MarkerImpl(new LatLong(40.712776, -74.005974), <SvgIcon component={LocationOnIcon} />),
    new MarkerImpl(new LatLong(34.052235, -118.243683), <SvgIcon component={LocationOnIcon} />),
    new MarkerImpl(new LatLong(41.878113, -87.629799), <SvgIcon component={LocationOnIcon} />),
  ];

  const filterChipOptions: ReadonlyArray<FilterChipOption> = [
    new FilterChipOption(1, "John", <SvgIcon component={Person} />),
    new FilterChipOption(2, "Jane", <SvgIcon component={Person} />),
    new FilterChipOption(3, "Doe", <SvgIcon component={Person} />),
  ];

  const markerSets: ReadonlyArray<MarkerSet> = [
    new MarkerSet(filterChipOptions[0], [markers[0]]),
    new MarkerSet(filterChipOptions[1], [markers[1]]),
    new MarkerSet(filterChipOptions[2], [markers[2]]),
  ];

  return (
    <div className="App">
      <CssBaseline />
      <Button variant="contained" color="primary" onClick={() => setMapOpen(true)}>
        Show Map
      </Button>
      <MapDialog
        open={mapOpen}
        onClose={() => setMapOpen(false)}
      >
        <MarkerSetViewer languageCode={languageCode} markerSets={markerSets} />
      </MapDialog>
    </div>
  );
}

export default App;
