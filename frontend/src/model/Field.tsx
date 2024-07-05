import { LatLong } from "./LatLong";

export enum FieldValueType {
    STRING = 0,
    BOOLEAN = 1,
    NUMBER = 2,
    DATE = 3,
    MAP = 4,
    ENUM = 5,
    LATLONG = 6,
    URL = 7,
    CONTENT = 8,
}

export enum ContentType {
    IMAGE = 0,
    VIDEO = 1,
    AUDIO = 2,
}

export type Content = {
    url: URL;
    contentType: ContentType;
};

export type FieldType = string | boolean | number | Date | Record<string, number> | LatLong | URL | Content;

export class Field {
    constructor(
        public readonly name: string,
        public readonly valueType: FieldValueType,
        public readonly initialValue: FieldType | null,
        public readonly isCustomField: boolean,
        public readonly enumValues?: Record<string, number>
    ) { }
}

export class EditableField extends Field {
    constructor(
        public readonly name: string,
        public readonly valueType: FieldValueType,
        public readonly initialValue: FieldType | null,
        public readonly isCustomField: boolean,
        public readonly required: boolean,
        public readonly enumValues?: Record<string, number>
    ) {
        super(name, valueType, initialValue, isCustomField, enumValues);
    }
}
