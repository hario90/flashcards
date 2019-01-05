import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { ADD_REQUEST_IN_PROGRESS, CLEAR_ALERT, REMOVE_REQUEST_IN_PROGRESS, SET_ALERT } from "./constants";
import {
    AddRequestInProgressAction,
    ClearAlertAction,
    FeedbackStateBranch,
    RemoveRequestInProgressAction,
    SetAlertAction,
} from "./types";

const initialState = {
    alert: undefined,
    requestsInProgress: new Set(),
};

const actionToConfigMap: TypeToDescriptionMap =  {
    [CLEAR_ALERT]: {
        accepts: (action: AnyAction): action is ClearAlertAction => action.type === CLEAR_ALERT,
        perform: (state: FeedbackStateBranch) => {
            return {
                ...state,
                alert: undefined,
            };
        },
    },
    [SET_ALERT]: {
        accepts: (action: AnyAction): action is SetAlertAction => action.type === SET_ALERT,
        perform: (state: FeedbackStateBranch, action: SetAlertAction) => {
            return {
                ...state,
                alert: action.payload,
            };
        },
    },
    [ADD_REQUEST_IN_PROGRESS]: {
        accepts: (action: AnyAction): action is AddRequestInProgressAction => action.type === ADD_REQUEST_IN_PROGRESS,
        perform: (state: FeedbackStateBranch, action: AddRequestInProgressAction) => {
            const requestsInProgress = new Set(state.requestsInProgress);
            requestsInProgress.add(action.payload);

            return {
                ...state,
                requestsInProgress,
            };
        },
    },
    [REMOVE_REQUEST_IN_PROGRESS]: {
        accepts: (action: AnyAction): action is RemoveRequestInProgressAction =>
            action.type === REMOVE_REQUEST_IN_PROGRESS,
        perform: (state: FeedbackStateBranch, action: RemoveRequestInProgressAction) => {
            const requestsInProgress = new Set(state.requestsInProgress);
            requestsInProgress.delete(action.payload);

            return {
                ...state,
                requestsInProgress,
            };
        },
    },
};

export default makeReducer<FeedbackStateBranch>(actionToConfigMap, initialState);
