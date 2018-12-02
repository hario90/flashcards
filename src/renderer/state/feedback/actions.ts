import { CLEAR_ALERT, SET_ALERT } from "./constants";
import { AppAlert, ClearAlertAction, SetAlertAction } from "./types";

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
