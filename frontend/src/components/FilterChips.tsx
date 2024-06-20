import { useEffect } from "react";
// import { SvgFileIcon } from "./appTheme";
import { Icon, Chip, ChipProps, Avatar } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';


export class Option {
    constructor(
        public readonly title: string,
        public readonly key: number,
        public readonly iconName: string,
        public readonly color: ChipProps['color'] = 'default',
    ) { }
}


export default function FilterChips({
    options,
    selectedKeys,
    setSelectedKeys,
    multiSelectedAllowed,
    defaultSelection,
}: {
    options: ReadonlyArray<Option>;
    selectedKeys: ReadonlyArray<number>;
    setSelectedKeys: (selectedKeys: ReadonlyArray<number>) => void;
    multiSelectedAllowed: boolean;
    defaultSelection: ReadonlyArray<number>;
}): JSX.Element {
    const handleSelect = (key: number) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(selectedKeys.filter((k) => k !== key));
        } else {
            setSelectedKeys(multiSelectedAllowed ? [...selectedKeys, key] : [key]);
        }
    };

    useEffect(() => {
        if (selectedKeys.length === 0) {
            setSelectedKeys(defaultSelection);
        }
        console.log(selectedKeys);
    }, [selectedKeys]);

    return (
        <div>
            {options.map((option) => { 
                const isSelected = selectedKeys.includes(option.key);
                return (
                    <Chip
                        key={option.key}
                        // icon={
                        //     isSelected
                        //         ? <CheckIcon />
                        //         : <Icon>{option.iconName}</Icon>
                        // }
                        avatar={
                            isSelected
                                ? <Avatar><CheckIcon /></Avatar>
                                : <Avatar><Icon>{option.iconName}</Icon></Avatar>
                        }
                        label={option.title}
                        onClick={() => handleSelect(option.key)}
                        color={option.color}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{
                            m: 0.5,
                            backgroundColor: isSelected ? `${option.color}darker` : undefined,
                        }}
                    />
                );
            })}
        </div>
    );
}