export enum FieldValueType {
    STRING = 0,
    BOOLEAN = 1,
    NUMBER = 2,
    DATE = 3,
    MAP = 4,
}

// export type FieldType = string | boolean | number | Date | ReadonlyMap<string, string> | null;

// export class Field {
//     constructor(
//         public name: string,
//         public valueType: FieldValueType,
//         public value: FieldType | null,
//         public required: boolean,
//         public readOnly: boolean
//     ) { }
// }

export type FieldType = string | boolean | number | Date;

export class Field {
    constructor(
        public readonly name: string,
        public readonly valueType: FieldValueType,
        public readonly initialValue: FieldType | null,
        public readonly isCustomField: boolean
    ) { }
}

export class EditableField extends Field {
    constructor(
        public readonly name: string,
        public readonly valueType: FieldValueType,
        public readonly initialValue: FieldType | null,
        public readonly isCustomField: boolean,
        public readonly required: boolean
    ) {
        super(name, valueType, initialValue, isCustomField);
    }
}
