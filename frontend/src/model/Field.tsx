export enum FieldValueType {
    STRING = 0,
    BOOLEAN = 1,
    NUMBER = 2,
    DATE = 3,
    MAP = 4,
}

export type FieldType = string | boolean | number | Date | ReadonlyMap<string, string> | null;

export class Field {
    constructor(
        public name: string,
        public valueType: FieldValueType,
        public value: FieldType,
        public required: boolean,
        public readOnly: boolean
    ) {}
}