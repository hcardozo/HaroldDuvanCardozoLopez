import { AlertType } from "../enums/alert-enum";


export interface Alert {
    type: AlertType;
    text: string;
}