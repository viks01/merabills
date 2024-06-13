import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Modal,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Container,
    Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useTranslation } from 'react-i18next';
import countries from '../data/countries.json';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function LocationForm() {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [area, setArea] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [lookupPerformed, setLookupPerformed] = useState(false);
    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        // Get the list of countries based on the current language
        const currentLocale = i18n.language;
        const countriesForLocale = countries[currentLocale];
        const countryItems = Object.entries(countriesForLocale).map(([code, name]) => (
            <MenuItem key={code} value={code}>{name}</MenuItem>
        ));
        setCountryList(countryItems);
    }, [i18n.language]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    };

    const handlePinCodeChange = (event) => {
        setPinCode(event.target.value);
    };

    const handleLookup = () => {
        // Mock data, replace with real API call to get location details based on pin code
        setState('California');
        setDistrict('Los Angeles');
        setArea('Downtown LA');
        setLatitude('34.0522');
        setLongitude('-118.2437');
        setLookupPerformed(true);
    };

    const handleUseCurrentLocation = () => {
        // Mock data, replace with real API call to get current location
        setCountry('+1');
        setPinCode('90012');
        setState('California');
        setDistrict('Los Angeles');
        setArea('Downtown LA');
        setLatitude('34.0522');
        setLongitude('-118.2437');
        setLookupPerformed(true);
    };

    const allFieldsPopulated = country && pinCode && state && district && area && latitude && longitude;

    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    {t("locationForm.getLocation")}
                </Button>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('locationForm.specifyLocation')}
                    </Typography>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="country-label">{t('locationForm.country')}</InputLabel>
                        <Select
                            labelId="country-label"
                            value={country}
                            label={t('locationForm.country')}
                            onChange={handleCountryChange}
                            required
                        >
                            {/* <MenuItem value="+1">USA</MenuItem>
                            <MenuItem value="+91">India</MenuItem>
                            <MenuItem value="+44">UK</MenuItem> */}
                            {countryList}
                        </Select>
                    </FormControl>

                    <TextField
                        label={t('locationForm.pinCode')}
                        variant="outlined"
                        value={pinCode}
                        onChange={handlePinCodeChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    {lookupPerformed && (
                        <>
                            <TextField
                                label={t('locationForm.state')}
                                variant="outlined"
                                value={state}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <TextField
                                label={t('locationForm.district')}
                                variant="outlined"
                                value={district}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <TextField
                                label={t('locationForm.area')}
                                variant="outlined"
                                value={area}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLookup}
                            disabled={!country || !pinCode}
                            sx={{ mr: 1 }}
                        >
                            {t('locationForm.lookup')}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }}>{t('locationForm.or')}</Divider>

                    {/* <TextField
                        label="Latitude"
                        variant="outlined"
                        value={latitude}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        label="Longitude"
                        variant="outlined"
                        value={longitude}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                    /> */}

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUseCurrentLocation}
                            startIcon={<LocationOnIcon />}
                        >
                            {t('locationForm.useCurrentLocation')}
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={handleClose} sx={{ mr: 2 }}>
                            {t('locationForm.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClose}
                            disabled={!allFieldsPopulated}
                        >
                            {t('locationForm.ok')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
}

export default LocationForm;
