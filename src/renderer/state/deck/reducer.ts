import { remove } from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { CREATE_DECK, DELETE_DECK, SAVE_DECK, SAVE_DRAFT } from "./constants";
import {
    CreateDeckAction, Deck,
    DeckStateBranch, DeleteDeckAction, SaveDeckAction, SaveDraftAction,
} from "./types";

export const initialState = {
    decks: [],
    draft: undefined,
};

const actionToConfigMap: TypeToDescriptionMap = {
    [CREATE_DECK]: {
        accepts: (action: AnyAction): action is CreateDeckAction => action.type === CREATE_DECK,
        perform: (state: DeckStateBranch, action: CreateDeckAction) => ({
            ...state,
            decks: [...state.decks, action.payload],
        }),
    },
    [DELETE_DECK]: {
        accepts: (action: AnyAction): action is DeleteDeckAction => action.type === DELETE_DECK,
        perform: (state: DeckStateBranch, action: DeleteDeckAction) => {
            const decks = remove(state.decks, (deck) => deck.id !== action.payload);
            console.log(decks);
            return {
                ...state,
                decks,
            };
        },
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
    [SAVE_DRAFT]: {
        accepts: (action: AnyAction): action is SaveDraftAction => action.type === SAVE_DRAFT,
        perform: (state: DeckStateBranch, action: SaveDraftAction) => {
            return ({
                ...state,
                draft: action.payload,
            });
        },
    },
};

export default makeReducer<DeckStateBranch>(actionToConfigMap, initialState);
