import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { SET_PAGE } from "./constants";
import {
    Page,
    PageStateBranch,
    SetPageAction,
} from "./types";

const initialState = {
    page: Page.Home,
};

const actionToConfigMap: TypeToDescriptionMap = {

    [SET_PAGE]: {
        accepts: (action: AnyAction): action is SetPageAction => action.type === SET_PAGE,
        perform: (state: PageStateBranch, action: SetPageAction) => ({
            ...state,
            page: action.payload,
        }),
    },
};

export default makeReducer<PageStateBranch>(actionToConfigMap, initialState);
