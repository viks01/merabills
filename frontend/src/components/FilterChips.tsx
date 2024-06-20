import { useEffect } from "react";
// import { SvgFileIcon } from "./appTheme";
import { Icon, Chip } from "@mui/material";


export class Option {
    constructor(public readonly title: string, public readonly key: number, public readonly iconName: string) { }
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
    const handleSelect = (key: number) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(selectedKeys.filter((k) => k !== key));
        } else {
            setSelectedKeys(multiSelectedAllowed ? [...selectedKeys, key] : [key]);
        }
    };

    useEffect(() => {
        console.log(selectedKeys);
    }, [selectedKeys]);

    return (
        <div>
            {options.map((option) => (
                <Chip
                    key={option.key}
                    icon={<Icon>{option.iconName}</Icon>}
                    label={option.title}
                    onClick={() => handleSelect(option.key)}
                    color={selectedKeys.includes(option.key) ? 'primary' : 'default'}
                    sx={{ m: 0.5 }}
                />
            ))}
        </div>
    );
 }