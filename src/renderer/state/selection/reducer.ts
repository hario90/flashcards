import {
    castArray,
    without,
} from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    DESELECT_DECK,
    SELECT_DECK,
    SELECT_METADATA,
} from "./constants";
import {
    DeselectFileAction,
    SelectFileAction,
    SelectionStateBranch,
    SelectMetadataAction,
} from "./types";

export const initialState = {};

const actionToConfigMap: TypeToDescriptionMap = {
    [DESELECT_DECK]: {
        accepts: (action: AnyAction): action is DeselectFileAction => action.type === DESELECT_DECK,
        perform: (state: SelectionStateBranch, action: DeselectFileAction) => ({
            ...state,
            deck: action.payload,
        }),
    },
    [SELECT_DECK]: {
        accepts: (action: AnyAction): action is SelectFileAction => action.type === SELECT_DECK,
        perform: (state: SelectionStateBranch, action: SelectFileAction) => ({
            ...state,
            deck: action.payload,
        }),
    },
    [SELECT_METADATA]: {
        accepts: (action: AnyAction): action is SelectMetadataAction => action.type === SELECT_METADATA,
        perform: (state: SelectionStateBranch, action: SelectMetadataAction) => ({
            ...state,
            [action.key]: action.payload,
        }),
    },
};

export default makeReducer<SelectionStateBranch>(actionToConfigMap, initialState);
