import { makeConstant } from "../util";

const BRANCH_NAME = "feedback";

export const SET_ALERT = makeConstant(BRANCH_NAME, "set-alert");
export const CLEAR_ALERT = makeConstant(BRANCH_NAME, "clear-alert");
