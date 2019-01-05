import { State } from "../types";

import { HttpRequestType } from "./types";

export const getAlert = (state: State) => state.feedback.alert;
export const getRequestsInProgress = (state: State) => state.feedback.requestsInProgress;
export const getRequestsInProgressContains = (state: State, request: HttpRequestType) => {
    const requestsInProgress = getRequestsInProgress(state);
    return requestsInProgress.has(request);
};
