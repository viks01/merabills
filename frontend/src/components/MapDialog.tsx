import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
// import MapWithMarkers, { MarkerOption } from './MapWithMarkers';

interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  // selectedKeys: ReadonlyArray<number>;
  // markerOptions: ReadonlyArray<MarkerOption>;
  children?: React.ReactNode;
}

const MapDialog: React.FC<MapDialogProps> = ({ open, onClose, children }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* <DialogTitle>Map</DialogTitle> */}
      <DialogContent>
        {/* <MapWithMarkers selectedKeys={selectedKeys} markerOptions={markerOptions} /> */}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
