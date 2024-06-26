import React, { useEffect, useState } from "react";
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme, useMediaQuery } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { FilterChipOption } from "./FilterChipOption";

// export class Option {
//     constructor(
//         public readonly title: string,
//         public readonly key: number,
//         public readonly iconName: string,
//         public readonly color: string,
//         public readonly position: google.maps.LatLngLiteral
//     ) {}
// }

export default function FilterChips({
    options,
    selectedKeys,
    setSelectedKeys,
    // multiSelectedAllowed,
}: {
    // options: ReadonlyArray<Option>;
    options: ReadonlyArray<FilterChipOption>;
    selectedKeys: ReadonlyArray<number>;
    setSelectedKeys: (selectedKeys: ReadonlyArray<number>) => void;
    // multiSelectedAllowed: boolean;
}): React.JSX.Element {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);

    const handleSelect = (key: number) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(selectedKeys.filter((k) => k !== key));
        } else {
            // setSelectedKeys(multiSelectedAllowed ? [...selectedKeys, key] : [key]);
            setSelectedKeys([...selectedKeys, key]);
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
                        label={option.title}
                        // avatar={<Avatar><Icon>{option.iconName}</Icon></Avatar>}
                        avatar={<Avatar>{option.icon}</Avatar>}
                        onClick={() => handleSelect(option.key)}
                        // color={isSelected ? option.color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' : undefined}
                        color='info'
                        variant={isSelected ? 'filled' : 'outlined'}
                        component="div"
                        sx={{ m: 0.5 }}
                    />
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
