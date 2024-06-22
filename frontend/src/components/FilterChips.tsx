import { useEffect, useState } from "react";
import { Chip, Avatar, DialogTitle, DialogContent, DialogActions, Button, useTheme, IconButton, ColorPaletteProp } from '@mui/joy';
import { Icon, Dialog, useMediaQuery } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

export class Option {
    constructor(
        public readonly title: string,
        public readonly key: number,
        public readonly iconName: string,
        public readonly color: 'primary' | 'success' | 'warning' | 'neutral' | 'danger',
        public readonly position: google.maps.LatLngLiteral
    ) { }
}

export default function FilterChips({
    options,
    selectedKeys,
    setSelectedKeys,
    multiSelectedAllowed,
}: {
    options: ReadonlyArray<Option>;
    selectedKeys: ReadonlyArray<number>;
    setSelectedKeys: (selectedKeys: ReadonlyArray<number>) => void;
    multiSelectedAllowed: boolean;
}): JSX.Element {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);

    const handleSelect = (key: number) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(selectedKeys.filter((k) => k !== key));
        } else {
            setSelectedKeys(multiSelectedAllowed ? [...selectedKeys, key] : [key]);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        console.log(selectedKeys);
    }, [selectedKeys]);

    const chips = (
        <div>
            {options.map((option) => {
                const isSelected = selectedKeys.includes(option.key);
                return (
                    <Chip
                        key={option.key}
                        startDecorator={<Avatar><Icon>{option.iconName}</Icon></Avatar>}
                        onClick={() => handleSelect(option.key)}
                        color={option.color as ColorPaletteProp}
                        variant={isSelected ? 'solid' : 'outlined'}
                        component="div"
                        sx={{
                            m: 0.5,
                            backgroundColor: isSelected ? `${option.color}darker` : undefined,
                        }}
                    >{option.title}</Chip>
                );
            })}
        </div>
    );

    return isSmallScreen ? (
        <>
            <IconButton onClick={handleOpen}>
                <FilterListIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Filter</DialogTitle>
                <DialogContent>
                    {chips}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    ) : chips;
}
