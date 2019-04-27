export interface AppAlert {
    message: string;
    type: AlertType;
}

export enum AlertType {
    WARN = 1,
    SUCCESS,
    ERROR,
}

export enum HttpRequestType {
    LOGIN = 1,
    SIGNUP,
    UPDATE_USER,
    GET_DECKS,
}

export interface FeedbackStateBranch {
    alert?: AppAlert;
    requestsInProgress: Set<HttpRequestType>;
}

export interface SetAlertAction {
    payload: AppAlert;
    type: string;
}

export interface ClearAlertAction {
    type: string;
}

export interface AddRequestInProgressAction {
    type: string;
    payload: HttpRequestType;
}

export interface RemoveRequestInProgressAction {
    type: string;
    payload: HttpRequestType;
}
