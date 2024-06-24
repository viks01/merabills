import { Marker } from './Marker';
import { FilterChipOption } from './FilterChipOption';

export class MarkerSet {
    constructor(public filterChipOption: FilterChipOption, public readonly markers: ReadonlyArray<Marker>) { }
}