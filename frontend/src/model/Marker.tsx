import React from "react";

import { LatLong } from "./LatLong";

export interface Marker {
    get latLong(): LatLong;
    get component(): React.JSX.Element;
}

export class MarkerImpl implements Marker {
    constructor(public readonly latLong: LatLong, public readonly component: React.JSX.Element) {}
}