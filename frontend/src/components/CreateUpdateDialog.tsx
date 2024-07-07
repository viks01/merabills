import React, { useState, useEffect } from 'react';
import {
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  CircularProgress, Snackbar, Radio, RadioGroup, FormControlLabel,
  FormControl, FormLabel, FormHelperText, IconButton, MenuItem, Select,
  Collapse, Checkbox, InputLabel
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AddOutlined, DeleteOutlined, MyLocation } from '@mui/icons-material';

import { Field, EditableField, FieldType, FieldValueType, Content, ContentType } from '../model/Field';
import { LatLong } from '../model/LatLong';

import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import { useGeolocated } from 'react-geolocated';

interface CreateUpdateDialogProps {
  type: string;
  isUpdate: boolean;
  fields: (EditableField | Field)[];
  onSubmit: (data: Record<string, FieldType>) => Promise<void>;
  onClose: () => void;
  open: boolean;
  addCustomFields: ReadonlyArray<FieldValueType>;
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = ({ type, isUpdate, fields, onSubmit, onClose, open, addCustomFields }) => {
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
  const [initialFieldNames, setInitialFieldNames] = useState<string[]>([]);
  // const [newFieldEnumValues, setNewFieldEnumValues] = useState<Record<string, number>>({}); // For new enum fields
  // const [enumValueKey, setEnumValueKey] = useState('');
  // const [enumValue, setEnumValue] = useState<number | ''>('');
  const [rawLatLongValues, setRawLatLongValues] = useState<Record<string, string>>({});
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });
  const [rawUrlValues, setRawUrlValues] = useState<Record<string, string>>({});

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
    setInitialFieldNames(fields.map(field => field.name));
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

    // const newField = (newFieldValueType === FieldValueType.ENUM) ? new EditableField(newFieldName, newFieldValueType, "", true, newFieldRequired) : new EditableField(newFieldName, newFieldValueType, "", true, newFieldRequired, newFieldEnumValues);
    const newField = new EditableField(newFieldName, newFieldValueType, "", true, newFieldRequired);
    setCustomFields([...customFields, newField]);
    setNewFieldName('');
    setNewFieldValueType(FieldValueType.STRING);
    setNewFieldRequired(false);
    // setNewFieldEnumValues({});
    setIsAddFieldExpanded(false);
  };

  const handleDeleteField = (name: string) => {
    setCustomFields(customFields.filter(field => field.name !== name));
    setRegularFields(regularFields.filter(field => field.name !== name));
    const { [name]: deletedValue, ...restFormValues } = formValues;
    setFormValues(restFormValues);
  };

  const handleLatLongChange = (name: string, value: string) => {
    setRawLatLongValues({ [name]: value });
  };

  const debouncedValidateLatLong = debounce((name: string, value: string) => {
    const [lat, long] = value.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(long)) {
      handleChange(name, new LatLong(lat, long));
      setFieldErrors({ ...fieldErrors, [name]: '' });
    } else {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid LatLong format' });
    }
  }, 1000);

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleUrlChange = (name: string, value: string) => {
    setRawUrlValues({ [name]: value });
  };

  const debouncedValidateURL = debounce((fieldName: string, value: string) => {
    if (isValidUrl(value) && (formValues[fieldName] as Content) && (formValues[fieldName] as Content).contentType) {
      handleChange(fieldName, {
        contentType: (formValues[fieldName] as Content).contentType,
        url: new URL(value)
      });
      setFieldErrors({ ...fieldErrors, [fieldName]: '' });
    } else if (!rawUrlValues[fieldName] || (rawUrlValues[fieldName] === '' && (formValues[fieldName] as Content).contentType)) {
      setFieldErrors({ ...fieldErrors, [fieldName]: '' });
    } else {
      setFieldErrors({ ...fieldErrors, [fieldName]: 'Invalid URL or Content Type' });
    }
  }, 1000);

  const handleContentTypeChange = (fieldName: string, contentType: ContentType) => {
    if (isValidUrl(rawUrlValues[fieldName]) && contentType) {
      handleChange(fieldName, {
        url: new URL(rawUrlValues[fieldName]),
        contentType: contentType
      });
      setFieldErrors({ ...fieldErrors, [fieldName]: '' });
    } else if (!rawUrlValues[fieldName] || (rawUrlValues[fieldName] === '' && contentType)) {
      setFieldErrors({ ...fieldErrors, [fieldName]: '' });
    } else {
      setFieldErrors({ ...fieldErrors, [fieldName]: 'Invalid URL or Content Type' });
    }
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

  // const addEnumValue = () => {
  //   if (enumValueKey && enumValue !== '') {
  //     setNewFieldEnumValues({ ...newFieldEnumValues, [enumValueKey]: Number(enumValue) });
  //     setEnumValueKey('');
  //     setEnumValue('');
  //   }
  // };

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
                      label={initialFieldNames.includes(field.name) ? field.name : `${field.name} (new property)`}
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
                    <FormLabel component="legend">{initialFieldNames.includes(field.name) ? field.name : `${field.name} (new property)`}</FormLabel>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <RadioGroup
                        row
                        value={formValues[field.name] || false}
                        onChange={e => handleChange(field.name, e.target.value === 'true')}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="True" disabled={!isEditable || loading} />
                        <FormControlLabel value={false} control={<Radio />} label="False" disabled={!isEditable || loading} />
                      </RadioGroup>
                      {fieldErrors[field.name] && <FormHelperText>{fieldErrors[field.name]}</FormHelperText>}
                      {isCustomField && (
                        <IconButton
                          onClick={() => handleDeleteField(field.name)}
                          disabled={!isEditable || loading}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </div>
                  </FormControl>
                );
              case FieldValueType.DATE:
                return (
                  <div style={{ display: 'flex', alignItems: 'center' }} key={field.name}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={initialFieldNames.includes(field.name) ? field.name : `${field.name} (new property)`}
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
              case FieldValueType.ENUM:
                return (
                  <FormControl fullWidth margin="normal" key={field.name}>
                    <FormLabel>{initialFieldNames.includes(field.name) ? field.name : `${field.name} (new property)`}</FormLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Select
                        value={field.initialValue ? field.initialValue : (formValues[field.name] || '')}
                        onChange={e => handleChange(field.name, e.target.value)}
                        disabled={!isEditable || loading}
                        error={!!fieldErrors[field.name]}
                        fullWidth
                      >
                        {field.enumValues && Object.entries(field.enumValues).map(([key, value]) => (
                          <MenuItem key={key} value={value}>
                            {key}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors[field.name] && <FormHelperText>{fieldErrors[field.name]}</FormHelperText>}
                      {isCustomField && (
                        <IconButton
                          onClick={() => handleDeleteField(field.name)}
                          disabled={!isEditable || loading}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </div>
                  </FormControl>
                );
              case FieldValueType.LATLONG:
                return (
                  <div style={{ display: 'flex', alignItems: 'center' }} key={field.name}>
                    <TextField
                      label={initialFieldNames.includes(field.name) ? field.name : `${field.name} (new property)`}
                      placeholder={isEditable ? (field.required ? 'lat, long (required)' : 'lat, long') : field.initialValue?.toString()}
                      type='text'
                      value={isEditable ? (rawLatLongValues[field.name] || '') : field.initialValue?.toString()}
                      onChange={e => handleLatLongChange(field.name, e.target.value)}
                      onBlur={() => {
                        if (!rawLatLongValues[field.name] || rawLatLongValues[field.name] === "") {
                          //delete fieldErrors[field.name];
                          setFieldErrors({ ...fieldErrors, [field.name]: '' });
                          return;
                        };
                        if (!rawLatLongValues[field.name].includes(",")) {
                          setFieldErrors({ ...fieldErrors, [field.name]: 'Invalid LatLong format' });
                          return;
                        }
                        let result = rawLatLongValues[field.name].split(',').map(Number).join(',');
                        handleLatLongChange(field.name, result);
                        debouncedValidateLatLong(field.name, result);
                      }}
                      required={isEditable && field.required}
                      disabled={!isEditable || loading}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldErrors[field.name]}
                      helperText={fieldErrors[field.name]}
                      style={{ marginRight: '10px' }}
                    />
                    <Button
                      onClick={() => {
                        if (!isGeolocationAvailable) {
                          setError('Geolocation is not available on this browser.');
                          return;
                        }
                        if (!isGeolocationEnabled) {
                          setError('Geolocation is not enabled. Please enable it in your browser settings.');
                          return;
                        }
                        if (coords) {
                          const value = `${coords.latitude}, ${coords.longitude}`;
                          handleLatLongChange(field.name, value);
                          debouncedValidateLatLong(field.name, value);
                        } else {
                          setError('Unable to retrieve your current location.');
                        }
                      }}
                      disabled={!isEditable || loading}
                      variant="outlined"
                      startIcon={<MyLocation />}
                    >
                      Use Current Location
                    </Button>
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
              case FieldValueType.CONTENT:
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }} key={field.name}>
                    <FormControl fullWidth margin="normal">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }} key={field.name}>
                        <FormLabel>{initialFieldNames.includes(field.name) ? field.name : `${field.name} (new property)`}</FormLabel>
                        <TextField
                          label={"URL"}
                          placeholder="URL"
                          value={isEditable ? (rawUrlValues[field.name] || '') : (formValues[field.name] as Content).url.toString()}
                          onChange={e => handleUrlChange(field.name, e.target.value)}
                          onBlur={() => debouncedValidateURL(field.name, rawUrlValues[field.name])}
                          required={isEditable && field.required}
                          disabled={!isEditable || loading}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                          error={!!fieldErrors[field.name]}
                          helperText={fieldErrors[field.name]}
                        />
                        <FormLabel>Content Type</FormLabel>
                        <Select
                          value={formValues[field.name] ? (formValues[field.name] as Content).contentType : ''}
                          onChange={e => handleContentTypeChange(field.name, e.target.value as ContentType)}
                          disabled={!isEditable || loading}
                          error={!!fieldErrors[field.name]}
                          fullWidth
                        >
                          <MenuItem value={ContentType.IMAGE}>Image</MenuItem>
                          <MenuItem value={ContentType.VIDEO}>Video</MenuItem>
                          <MenuItem value={ContentType.AUDIO}>Audio</MenuItem>
                        </Select>
                        {/* {fieldErrors[field.name] && <FormHelperText>{fieldErrors[field.name]}</FormHelperText>} */}
                      </div>
                    </FormControl>
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
          {addCustomFields.length > 0 && (
            <Button
              onClick={handleToggleAddField}
              color="primary"
              variant="outlined"
              startIcon={<AddOutlined />}
              disabled={loading}
              style={{ marginTop: '1em' }}
            >
              Add Property
            </Button>
          )}
          <Collapse in={isAddFieldExpanded} style={{ border: '1px solid #ccc', padding: '1em', borderRadius: '4px', marginTop: '1em' }}>
            <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
              <TextField
                label="Field Name"
                value={newFieldName}
                onChange={e => setNewFieldName(e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>
                <Select
                  label="Field Type"
                  value={newFieldValueType}
                  onChange={e => setNewFieldValueType(e.target.value as FieldValueType)}
                >
                  {addCustomFields.map(fieldType => (
                    (fieldType !== FieldValueType.ENUM) &&
                    <MenuItem key={fieldType} value={fieldType}>
                      {Object.keys(FieldValueType)[Object.values(FieldValueType).indexOf(fieldType)]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* {newFieldValueType === FieldValueType.ENUM && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', width: '100%' }}>
                  <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                    <TextField
                      label="Key"
                      value={enumValueKey}
                      onChange={e => setEnumValueKey(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Value"
                      value={enumValue}
                      onChange={e => setEnumValue(Number(e.target.value))}
                      fullWidth
                    />
                    <Button onClick={addEnumValue} color="primary" variant="contained">
                      Add Enum Value
                    </Button>
                  </div>
                  <ul>
                    {Object.entries(newFieldEnumValues).map(([key, value]) => (
                      <li key={key}>{`${key}: ${value}`}</li>
                    ))}
                  </ul>
                </div>
              )} */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newFieldRequired}
                    onChange={e => setNewFieldRequired(e.target.checked)}
                  />
                }
                label="Required"
              />
              <Button
                color="primary"
                variant="contained"
                onClick={handleAddField}
              >
                Add
              </Button>
            </div>
          </Collapse>
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} >
              <Alert severity="error">{error}</Alert>
            </Snackbar>
          )}
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
    </>
  );
};

export default CreateUpdateDialog;
