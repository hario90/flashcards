import { CLEAR_NEXT_PAGE, GO_BACK, SET_NEXT_PAGE, SET_PAGE } from "./constants";
import {
    ClearNextPageAction,
    GoBackAction,
    Page, SetNextPageAction,
    SetPageAction,
} from "./types";

export function setPage(payload: Page): SetPageAction {
    return {
        payload,
        type: SET_PAGE,
    };
}

export function clearNextPage(): ClearNextPageAction {
    return {
        type: CLEAR_NEXT_PAGE,
    };
}

export function setNextPage(payload: Page): SetNextPageAction {
    return {
        payload,
        type: SET_NEXT_PAGE,
    };
}

export function goBack(): GoBackAction {
    return {
        type: GO_BACK,
    };
}
