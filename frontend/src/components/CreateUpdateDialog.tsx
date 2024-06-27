import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Snackbar } from '@mui/material';

import { Field, FieldType, FieldValueType } from '../model/Field';

interface CreateUpdateDialogProps {
  type: string;
  isUpdate: boolean;
  fields: Field[];
  onSubmit: (data: Record<string, FieldType>) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = ({ type, isUpdate, fields, onSubmit, onClose, open }) => {
  const [formValues, setFormValues] = useState<Record<string, FieldType>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: FieldType) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formValues);
      onClose();
    } catch (e) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isUpdate ? `Update ${type}` : `Create ${type}`}</DialogTitle>
      <DialogContent>
        {fields.map(field => (
          <TextField
            key={field.name}
            label={field.name}
            type={field.valueType === FieldValueType.NUMBER ? 'number' : 'text'}
            value={formValues[field.name] || ''}
            onChange={e => handleChange(field.name, e.target.value)}
            required={field.required}
            disabled={field.readOnly || loading}
            fullWidth
            margin="normal"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'OK'}
        </Button>
      </DialogActions>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} message={error} />
    </Dialog>
  );
};

export default CreateUpdateDialog;