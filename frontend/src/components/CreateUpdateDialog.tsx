import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  CircularProgress, Snackbar, Radio, RadioGroup, FormControlLabel,
  FormControl, FormLabel, FormHelperText, IconButton, MenuItem, Select,
  Collapse
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AddOutlined, DeleteOutlined } from '@mui/icons-material';

import { Field, EditableField, FieldType, FieldValueType } from '../model/Field';
import dayjs, { Dayjs } from 'dayjs';

interface CreateUpdateDialogProps {
  type: string;
  isUpdate: boolean;
  fields: (EditableField | Field)[];
  onSubmit: (data: Record<string, FieldType>) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = ({ type, isUpdate, fields, onSubmit, onClose, open }) => {
  const [formValues, setFormValues] = useState<Record<string, FieldType>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<(Field | EditableField)[]>([]);
  const [regularFields, setRegularFields] = useState<(Field | EditableField)[]>([]);
  const [isAddFieldExpanded, setIsAddFieldExpanded] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValueType, setNewFieldValueType] = useState<FieldValueType>(FieldValueType.STRING);
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  useEffect(() => {
    const initialValues: Record<string, FieldType> = {};
    fields.forEach(field => {
      if (field.initialValue !== null) {
        initialValues[field.name] = field.initialValue;
      }
    });
    setFormValues(initialValues);
    setRegularFields(fields.filter(field => !field.isCustomField));
    setCustomFields(fields.filter(field => field.isCustomField));
  }, [isUpdate, fields]);

  const handleChange = (name: string, value: FieldType) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const validateFields = () => {
    const newFieldErrors: Record<string, string> = {};

    regularFields.forEach(field => {
      if (field instanceof EditableField && field.required && !formValues[field.name]) {
        newFieldErrors[field.name] = `${field.name} is required`;
      }
    });

    customFields.forEach(field => {
      if (field instanceof EditableField && field.required && !formValues[field.name]) {
        newFieldErrors[field.name] = `${field.name} is required`;
      }
    });

    setFieldErrors(newFieldErrors);
    return Object.keys(newFieldErrors).length === 0;
  };

  const handleToggleAddField = () => {
    setIsAddFieldExpanded(!isAddFieldExpanded);
  };

  const handleAddField = () => {
    if (!newFieldName) {
      setError('Field name is required');
      return;
    }

    const newField = new EditableField(newFieldName, newFieldValueType, "", true, newFieldRequired);
    setCustomFields([...customFields, newField]);
    setNewFieldName('');
    setNewFieldValueType(FieldValueType.STRING);
    setNewFieldRequired(false);
    setIsAddFieldExpanded(false);
  };

  const handleDeleteField = (name: string) => {
    setCustomFields(customFields.filter(field => field.name !== name));
    setRegularFields(regularFields.filter(field => field.name !== name));
    const { [name]: deletedValue, ...restFormValues } = formValues;
    setFormValues(restFormValues);
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

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
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>{isUpdate ? `Update ${type}` : `Create ${type}`}</DialogTitle>
        <DialogContent>
          {[...regularFields, ...customFields].map(field => {
            const isEditable = field instanceof EditableField;
            const isCustomField = field.isCustomField;

            switch (field.valueType) {
              case FieldValueType.STRING:
              case FieldValueType.NUMBER:
                return (
                  <div style={{ display: 'flex', alignItems: 'center' }} key={field.name}>
                    <TextField
                      label={field.name}
                      placeholder={isEditable ? (field.required ? '(required)' : '') : field.initialValue?.toString()}
                      type={field.valueType === FieldValueType.NUMBER ? 'number' : 'text'}
                      value={isEditable ? (formValues[field.name] || '') : field.initialValue?.toString()}
                      onChange={e => handleChange(field.name, field.valueType === FieldValueType.NUMBER ? parseFloat(e.target.value) : e.target.value)}
                      required={isEditable && field.required}
                      disabled={!isEditable || loading}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldErrors[field.name]}
                      helperText={fieldErrors[field.name]}
                    />
                    {isCustomField && (
                      <IconButton
                        onClick={() => handleDeleteField(field.name)}
                        disabled={!isEditable || loading}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    )}
                  </div>
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
                      <FormControlLabel value={true} control={<Radio />} label="True" disabled={!isEditable || loading} />
                      <FormControlLabel value={false} control={<Radio />} label="False" disabled={!isEditable || loading} />
                      {isCustomField && (
                        <IconButton
                          onClick={() => handleDeleteField(field.name)}
                          disabled={!isEditable || loading}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </RadioGroup>
                    {fieldErrors[field.name] && <FormHelperText>{fieldErrors[field.name]}</FormHelperText>}
                  </FormControl>
                );
              case FieldValueType.DATE:
                return (
                  <div style={{ display: 'flex', alignItems: 'center' }} key={field.name}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={field.name}
                        value={formValues[field.name] ? dayjs(formValues[field.name].toString()) : null}
                        onChange={(date: Dayjs | null) => handleChange(field.name, dayjs(date).toDate())}
                        slotProps={{
                          textField: {
                            placeholder: isEditable ? (field.required ? '(required)' : '') : field.initialValue?.toString(),
                            required: isEditable && field.required,
                            disabled: !isEditable || loading,
                            fullWidth: true,
                            margin: "normal",
                            error: !!fieldErrors[field.name],
                            helperText: fieldErrors[field.name]
                          },
                        }}
                      />
                    </LocalizationProvider>
                    {isCustomField && (
                      <IconButton
                        onClick={() => handleDeleteField(field.name)}
                        disabled={!isEditable || loading}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    )}
                  </div>
                );
              default:
                return null;
            }
          })}
          <Button
            onClick={handleToggleAddField}
            color="primary"
            startIcon={<AddOutlined />}
            disabled={loading}
            fullWidth
            style={{ marginTop: '1em' }}
          >
            Add Property
          </Button>
          <Collapse in={isAddFieldExpanded} style={{ border: '1px solid #ccc', padding: '1em', borderRadius: '4px', marginTop: '1em' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
              <TextField
                label="Field Name"
                value={newFieldName}
                onChange={e => setNewFieldName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <FormLabel>Value Type</FormLabel>
                <Select
                  value={newFieldValueType}
                  onChange={e => setNewFieldValueType(e.target.value as FieldValueType)}
                >
                  <MenuItem value={FieldValueType.STRING}>String</MenuItem>
                  <MenuItem value={FieldValueType.NUMBER}>Number</MenuItem>
                  <MenuItem value={FieldValueType.BOOLEAN}>Boolean</MenuItem>
                  <MenuItem value={FieldValueType.DATE}>Date</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Radio
                    checked={newFieldRequired}
                    onChange={e => setNewFieldRequired(e.target.checked)}
                    color="primary"
                  />
                }
                label="Required"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1em', gap: '1em' }}>
              <Button
                onClick={handleToggleAddField}
                color="primary"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddField}
                color="primary"
                disabled={loading}
              >
                Ok
              </Button>
            </div>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Ok'}
          </Button>
        </DialogActions>
      </Dialog>
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          message={error}
        />
      )}
    </>
  );
};

export default CreateUpdateDialog;
