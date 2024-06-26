import React, { useState, useEffect } from "react";

import MapWithMarkers from "./MapWithMarkers";
import { MarkerSet } from "./MarkerSet";
import FilterChips from "./FilterChips";
import { FilterChipOption } from "./FilterChipOption";

export default function MarkerSetViewer({
    languageCode,
    markerSets }: {
        languageCode: string,
        markerSets: ReadonlyArray<MarkerSet>
    }): React.JSX.Element {
    const [selectedKeys, setSelectedKeys] = useState<ReadonlyArray<number>>([]);

    useEffect(() => {
        const initialSelectedKeys = markerSets.map(markerSet => markerSet.filterChipOption.key);
        setSelectedKeys(initialSelectedKeys);
    }, [markerSets]);
    
    const filterChipOptions: ReadonlyArray<FilterChipOption> = markerSets.map(markerSet => markerSet.filterChipOption);

    return <>
        {languageCode} <br />
        <MapWithMarkers
            selectedKeys={selectedKeys}
            markerSets={markerSets}
        />
        <FilterChips
            options={filterChipOptions}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
        />
    </>
}