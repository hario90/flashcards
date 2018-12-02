import { AnyAction } from "redux";

export interface AppAlert {
    message: string;
    onNo?: AnyAction;
    onYes?: AnyAction;
    type: AlertType;
}

export enum AlertType {
    WARN = 1,
    SUCCESS,
    ERROR,
}

export interface FeedbackStateBranch {
    alert?: AppAlert;
}

export interface SetAlertAction {
    payload: AppAlert;
    type: string;
}

export interface ClearAlertAction {
    type: string;
}
