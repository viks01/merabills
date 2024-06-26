import React from 'react';
import { Dialog, DialogContent } from '@mui/material';

interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const MapDialog: React.FC<MapDialogProps> = ({ open, onClose, children }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
