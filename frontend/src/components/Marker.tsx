import React from "react";
import { LatLong } from "./LatLong";

export interface Marker {
    get latLong(): LatLong;
    get component(): React.JSX.Element;
}