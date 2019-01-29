import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    DESELECT_DECK,
    GET_NEXT_CARD,
    GET_PREVIOUS_CARD,
    RESET_DECK,
    RESET_SELECTIONS,
    SELECT_DECK,
    SELECT_METADATA, SET_CURRENT_CARD, SET_SEEN_CARDS, SET_UNSEEN_CARDS,
} from "./constants";
import {
    DeselectDeckAction,
    GetNextCardAction,
    GetPreviousCardAction,
    ResetDeckAction,
    ResetSelectionsAction,
    SelectDeckAction,
    SelectionStateBranch,
    SelectMetadataAction, SetCurrentCardAction, SetSeenCardsAction, SetUnseenCardsAction,
} from "./types";

export const initialState: SelectionStateBranch = {
    currentCard: undefined,
    deck: undefined,
    seenCards: [],
    unseenCards: [],
};

const actionToConfigMap: TypeToDescriptionMap = {
    [DESELECT_DECK]: {
        accepts: (action: AnyAction): action is DeselectDeckAction => action.type === DESELECT_DECK,
        perform: (state: SelectionStateBranch) => ({
            ...state,
            deck: undefined,
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
    [RESET_DECK]: {
        accepts: (action: AnyAction): action is ResetDeckAction => action.type === RESET_DECK,
        perform: (state: SelectionStateBranch, action: ResetDeckAction) => ({
            ...state,
            currentCard: undefined,
            seenCards: [],
            unseenCards: [...action.payload],
        }),
    },
    [GET_NEXT_CARD]: {
        accepts: (action: AnyAction): action is GetNextCardAction => action.type === GET_NEXT_CARD,
        perform: (state: SelectionStateBranch) => ({
            ...state,
            showFront: true,
        }),
    },
    [GET_PREVIOUS_CARD]: {
        accepts: (action: AnyAction): action is GetPreviousCardAction => action.type === GET_PREVIOUS_CARD,
        perform: (state: SelectionStateBranch) => ({
            ...state,
            showFront: true, // todo why is this stored here
        }),
    },
    [SET_CURRENT_CARD]: {
        accepts: (action: AnyAction): action is SetCurrentCardAction => action.type === SET_CURRENT_CARD,
        perform: (state: SelectionStateBranch, action: SetCurrentCardAction) => ({
            ...state,
            currentCard: action.payload,
        }),
    },
    [SET_SEEN_CARDS]: {
        accepts: (action: AnyAction): action is SetSeenCardsAction => action.type === SET_SEEN_CARDS,
        perform: (state: SelectionStateBranch, action: SetSeenCardsAction) => ({
            ...state,
            seenCards: action.payload,
        }),
    },
    [SET_UNSEEN_CARDS]: {
        accepts: (action: AnyAction): action is SetUnseenCardsAction => action.type === SET_UNSEEN_CARDS,
        perform: (state: SelectionStateBranch, action: SetUnseenCardsAction) => ({
            ...state,
            unseenCards: action.payload,
        }),
    },
    [RESET_SELECTIONS]: {
        accepts: (action: AnyAction): action is ResetSelectionsAction => action.type === RESET_SELECTIONS,
        perform: () => ({
            ...initialState,
        }),
    },
};

export default makeReducer<SelectionStateBranch>(actionToConfigMap, initialState);
