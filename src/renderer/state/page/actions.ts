import { SET_PAGE } from "./constants";
import {
    Page,
    SetPageAction
} from "./types";

export function setPage(payload: Page): SetPageAction {
    return {
        payload,
        type: SET_PAGE,
    };
}
