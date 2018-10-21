import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { CREATE_DECK, SAVE_DECK } from "./constants";
import {
    CreateDeckAction, Deck,
    DeckStateBranch, SaveDeckAction,
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
    [SAVE_DECK]: {
        accepts: (action: AnyAction): action is SaveDeckAction => action.type === SAVE_DECK,
        perform: (state: DeckStateBranch, action: SaveDeckAction) => {
            const ids = state.decks.map((deck: Deck) => deck.id);
            const index = ids.indexOf(action.payload.id);
            const decks = [
                ...state.decks,
            ];
            decks[index] = action.payload;
            return ({
                ...state,
                decks,
            });
        },
    },
};

export default makeReducer<DeckStateBranch>(actionToConfigMap, initialState);
