import { remove } from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { CLEAR_DECKS, CLEAR_DRAFT, CREATE_DECK, DELETE_DECK, SAVE_DECK, SAVE_DRAFT, SET_DECKS } from "./constants";
import {
    ClearDecksAction,
    ClearDraftAction,
    CreateDeckAction,
    DeckStateBranch,
    DeleteDeckAction,
    SaveDraftAction,
    SetDecksAction,
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
            return {
                ...state,
                decks,
            };
        },
    },
    [SET_DECKS]: {
        accepts: (action: AnyAction): action is SetDecksAction => action.type === SET_DECKS,
        perform: (state: DeckStateBranch, action: SetDecksAction) => {
            return {
                ...state,
                decks: action.payload,
            };
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
    [CLEAR_DECKS]: {
        accepts: (action: AnyAction): action is ClearDecksAction => action.type === CLEAR_DECKS,
        perform: (state: DeckStateBranch) => ({
            ...state,
            decks: [],
        }),
    },
    [CLEAR_DRAFT]: {
        accepts: (action: AnyAction): action is ClearDraftAction => action.type === CLEAR_DRAFT,
        perform: (state: DeckStateBranch) => {
            return {
                ...state,
                draft: undefined,
            };
        },
    },
};

export default makeReducer<DeckStateBranch>(actionToConfigMap, initialState);
