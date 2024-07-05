export class LatLong {
    constructor(public readonly lat: number, public readonly long: number) {}
    toString() {
        return `${this.lat}, ${this.long}`;
    }
}