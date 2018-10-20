import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { CREATE_DECK } from "./constants";
import {
    CreateDeckAction,
    DeckStateBranch,
} from "./types";

export const initialState = {
    decks: [],
};

const actionToConfigMap: TypeToDescriptionMap = {
    [CREATE_DECK]: {
        accepts: (action: AnyAction): action is CreateDeckAction => action.type === CREATE_DECK,
        perform: (state: DeckStateBranch, action: CreateDeckAction) => ({
            ...state,
            decks: [...state.decks, action.payload],
        }),
    },
};

export default makeReducer<DeckStateBranch>(actionToConfigMap, initialState);
