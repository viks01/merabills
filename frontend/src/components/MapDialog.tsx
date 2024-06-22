import React from 'react';
import { Dialog } from '@mui/material';
import { DialogTitle, DialogContent } from '@mui/joy';
import MapWithMarkers, { MarkerOption } from './MapWithMarkers';

interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  selectedKeys: ReadonlyArray<number>;
  markerOptions: ReadonlyArray<MarkerOption>;
}

const MapDialog: React.FC<MapDialogProps> = ({ open, onClose, selectedKeys, markerOptions }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Map</DialogTitle>
      <DialogContent>
        <MapWithMarkers selectedKeys={selectedKeys} markerOptions={markerOptions} />
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
