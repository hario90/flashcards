import { makeConstant } from "../util";

const BRANCH_NAME = "feedback";

export const SET_ALERT = makeConstant(BRANCH_NAME, "set-alert");
export const CLEAR_ALERT = makeConstant(BRANCH_NAME, "clear-alert");
export const ADD_REQUEST_IN_PROGRESS = makeConstant(BRANCH_NAME, "add-request-in-progress");
export const REMOVE_REQUEST_IN_PROGRESS = makeConstant(BRANCH_NAME, "remove-request-in-progress");
