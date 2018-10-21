import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    DESELECT_DECK,
    SELECT_DECK,
    SELECT_METADATA,
} from "./constants";
import {
    DeselectDeckAction,
    SelectDeckAction,
    SelectionStateBranch,
    SelectMetadataAction,
} from "./types";

export const initialState = {};

const actionToConfigMap: TypeToDescriptionMap = {
    [DESELECT_DECK]: {
        accepts: (action: AnyAction): action is DeselectDeckAction => action.type === DESELECT_DECK,
        perform: (state: SelectionStateBranch, action: DeselectDeckAction) => ({
            ...state,
            deck: null,
        }),
    },
    [SELECT_DECK]: {
        accepts: (action: AnyAction): action is SelectDeckAction => action.type === SELECT_DECK,
        perform: (state: SelectionStateBranch, action: SelectDeckAction) => ({
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
