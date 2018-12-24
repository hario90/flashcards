import { message } from "antd";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { CLEAR_ALERT, SET_ALERT } from "./constants";
import { ClearAlertAction, FeedbackStateBranch, SetAlertAction } from "./types";

const initialState = {
    alert: undefined,
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
};

export default makeReducer<FeedbackStateBranch>(actionToConfigMap, initialState);
