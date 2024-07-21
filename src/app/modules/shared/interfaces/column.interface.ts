import { ColumnType } from "../enums/column-type.enum";

export interface Column<T> {
    label: string;
    value: keyof T;
    tooltip?: string;
    type: ColumnType;
    width?: string;
    minWidth: string;
}