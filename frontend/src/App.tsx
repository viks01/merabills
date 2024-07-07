import React, { useState } from 'react';
import { Button, CssBaseline, SvgIcon } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Person } from '@mui/icons-material';

import { FilterChipOption } from './model/FilterChipOption';
import { LatLong } from './model/LatLong';
import { Marker, MarkerImpl } from './model/Marker';
import { MarkerSet } from './model/MarkerSet';

import MapDialog from './components/MapDialog';
import MarkerSetViewer from './components/MarkerSetViewer';

import { Field, EditableField, FieldType, FieldValueType } from './model/Field';
import CreateUpdateDialog from './components/CreateUpdateDialog';

const App: React.FC = () => {
  // Map controls
  const [mapOpen, setMapOpen] = useState(false);
  const languageCode: string = "en-US";

  const markers: ReadonlyArray<Marker> = [
    new MarkerImpl(new LatLong(40.712776, -74.005974), <SvgIcon component={LocationOnIcon} />),
    new MarkerImpl(new LatLong(34.052235, -118.243683), <SvgIcon component={LocationOnIcon} />),
    new MarkerImpl(new LatLong(41.878113, -87.629799), <SvgIcon component={LocationOnIcon} />),
    new MarkerImpl(new LatLong(29.760427, -95.369804), <SvgIcon component={LocationOnIcon} />),
    new MarkerImpl(new LatLong(33.448376, -112.074036), <SvgIcon component={LocationOnIcon} />),
    new MarkerImpl(new LatLong(37.774929, -122.419418), <SvgIcon component={LocationOnIcon} />),
  ];

  const filterChipOptions: ReadonlyArray<FilterChipOption> = [
    new FilterChipOption(1, "John", <SvgIcon component={Person} />),
    new FilterChipOption(2, "Jane", <SvgIcon component={Person} />),
    new FilterChipOption(3, "Doe", <SvgIcon component={Person} />),
  ];

  const markerSets: ReadonlyArray<MarkerSet> = [
    new MarkerSet(filterChipOptions[0], [markers[0], markers[3]]),
    new MarkerSet(filterChipOptions[1], [markers[1], markers[4]]),
    new MarkerSet(filterChipOptions[2], [markers[2], markers[5]]),
  ];

  // Dialog controls
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const statusEnumValues = {
    ACTIVE: 1,
    DRAFT: 2,
    INACTIVE: 3
  };


  const fields = [
    new EditableField('Name', FieldValueType.STRING, 'Default Name', true, true),
    new EditableField('Description', FieldValueType.STRING, 'Default Description', true, false),
    new EditableField('Date', FieldValueType.DATE, new Date(), true, true),
    new EditableField('Amount', FieldValueType.NUMBER, 0, true, true),
    new EditableField('Active', FieldValueType.BOOLEAN, true, true, true),
    new Field('Static Info', FieldValueType.STRING, 'This is a static field', true),
    new EditableField('Status', FieldValueType.ENUM, 1, true, true, statusEnumValues),
    new EditableField('Location', FieldValueType.LATLONG, new LatLong(40.712776, -74.005974), true, true),
  ];

  const addCustomFieldTypes: ReadonlyArray<FieldValueType> = [
    FieldValueType.STRING, 
    FieldValueType.BOOLEAN, 
    FieldValueType.NUMBER, 
    FieldValueType.DATE, 
    FieldValueType.ENUM, 
    FieldValueType.LATLONG,  
    FieldValueType.CONTENT
  ];

  const handleDialogSubmit = async (data: Record<string, FieldType>) => {
    // Simulate async operation
    console.log(data);
    return new Promise<void>((resolve) => setTimeout(resolve, 2000));
  };

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
      <Button variant="contained" color="primary" onClick={() => { setDialogOpen(true); setIsUpdate(false); }}>
        Open Create Dialog
      </Button>
      <Button variant="contained" color="secondary" onClick={() => { setDialogOpen(true); setIsUpdate(true); }}>
        Open Update Dialog
      </Button>
      <CreateUpdateDialog
        type="Entity"
        isUpdate={isUpdate}
        fields={fields}
        onSubmit={handleDialogSubmit}
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        addCustomFieldTypes={addCustomFieldTypes}
      />
    </div>
  );
}

export default App;
