import React, { useEffect, useState } from "react";
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme, useMediaQuery } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import { FilterChipOption } from "./FilterChipOption";

export default function FilterChips({
    options,
    selectedKeys,
    setSelectedKeys,
}: {
    options: ReadonlyArray<FilterChipOption>;
    selectedKeys: ReadonlyArray<number>;
    setSelectedKeys: (selectedKeys: ReadonlyArray<number>) => void;
}): React.JSX.Element {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);

    const handleSelect = (key: number) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(selectedKeys.filter((k) => k !== key));
        } else {
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
                        avatar={<Avatar>{option.icon}</Avatar>}
                        onClick={() => handleSelect(option.key)}
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
