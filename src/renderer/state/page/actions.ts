import { GO_BACK, SET_PAGE } from "./constants";
import {
    GoBackAction,
    Page,
    SetPageAction,
} from "./types";

export function setPage(payload: Page): SetPageAction {
    return {
        payload,
        type: SET_PAGE,
    };
}

export function goBack(): GoBackAction {
    return {
        type: GO_BACK,
    };
}
