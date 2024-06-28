import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Snackbar, 
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, FilledTextFieldProps, OutlinedTextFieldProps, 
  StandardTextFieldProps, TextFieldVariants, FormHelperText 
} from '@mui/material';
import { DatePicker } from '@mui/lab';

import { Field, FieldType, FieldValueType } from '../model/Field';
import { JSX } from 'react/jsx-runtime';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: FieldType) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const validateFields = () => {
    const newFieldErrors: Record<string, string> = {};

    fields.forEach(field => {
      if (field.required && !formValues[field.name]) {
        newFieldErrors[field.name] = `${field.name} is required`;
      }
    });

    setFieldErrors(newFieldErrors);
    return Object.keys(newFieldErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

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
        {fields.map(field => {
          switch (field.valueType) {
            case FieldValueType.STRING:
            case FieldValueType.NUMBER:
              return (
                <TextField
                  key={field.name}
                  label={field.name}
                  type={field.valueType === FieldValueType.NUMBER ? 'number' : 'text'}
                  value={formValues[field.name] || ''}
                  onChange={e => handleChange(field.name, field.valueType === FieldValueType.NUMBER ? parseFloat(e.target.value) : e.target.value)}
                  required={field.required}
                  disabled={field.readOnly || loading}
                  fullWidth
                  margin="normal"
                  error={!!fieldErrors[field.name]}
                  helperText={fieldErrors[field.name]}
                />
              );
            case FieldValueType.BOOLEAN:
              return (
                <FormControl component="fieldset" key={field.name} margin="normal" fullWidth error={!!fieldErrors[field.name]}>
                  <FormLabel component="legend">{field.name}</FormLabel>
                  <RadioGroup
                    row
                    value={formValues[field.name] || false}
                    onChange={e => handleChange(field.name, e.target.value === 'true')}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="True" disabled={field.readOnly || loading} />
                    <FormControlLabel value={false} control={<Radio />} label="False" disabled={field.readOnly || loading} />
                  </RadioGroup>
                  {fieldErrors[field.name] && <FormHelperText>{fieldErrors[field.name]}</FormHelperText>}
                </FormControl>
              );
            case FieldValueType.DATE:
              return (
                <DatePicker
                  key={field.name}
                  label={field.name}
                  value={formValues[field.name] || null}
                  onChange={(date: string | number | boolean | Date | ReadonlyMap<string, string> | null) => handleChange(field.name, date)}
                  renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => (
                    <TextField
                      {...params}
                      required={field.required}
                      disabled={field.readOnly || loading}
                      fullWidth
                      margin="normal"
                      error={!!fieldErrors[field.name]}
                      helperText={fieldErrors[field.name]}
                    />
                  )}
                />
              );
            case FieldValueType.MAP:
              const map = field.value as ReadonlyMap<string, string>;
              return (
                <div key={field.name} style={{ marginBottom: '16px' }}>
                  <FormLabel component="legend">{field.name}</FormLabel>
                  {Array.from(map.entries()).map(([key, value]) => (
                    <TextField
                      key={key}
                      label={key}
                      value={value}
                      disabled
                      fullWidth
                      margin="normal"
                    />
                  ))}
                </div>
              );
            default:
              return null;
          }
        })}
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