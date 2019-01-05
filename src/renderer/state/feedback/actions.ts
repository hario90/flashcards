import { ADD_REQUEST_IN_PROGRESS, CLEAR_ALERT, REMOVE_REQUEST_IN_PROGRESS, SET_ALERT } from "./constants";
import {
    AddRequestInProgressAction,
    AppAlert,
    ClearAlertAction,
    HttpRequestType,
    RemoveRequestInProgressAction,
    SetAlertAction,
} from "./types";

export function setAlert(payload: AppAlert): SetAlertAction {
    return {
        payload,
        type: SET_ALERT,
    };
}

export function clearAlert(): ClearAlertAction {
    return {
        type: CLEAR_ALERT,
    };
}

export function addRequestToInProgress(payload: HttpRequestType): AddRequestInProgressAction {
    return {
        payload,
        type: ADD_REQUEST_IN_PROGRESS,
    };
}

export function removeRequestFromInProgress(payload: HttpRequestType): RemoveRequestInProgressAction {
    return {
        payload,
        type: REMOVE_REQUEST_IN_PROGRESS,
    };
}
