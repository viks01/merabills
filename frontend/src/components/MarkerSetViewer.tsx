import React from "react";
import { MarkerSet } from "./MarkerSet";

export function MarkerSetViewer(languageCode: string, markerSets: ReadonlyArray<MarkerSet>): React.JSX.Element {
    return <>{languageCode}{markerSets}</>
}