import {
    CLEAR_DECKS,
    CLEAR_DRAFT,
    CREATE_DECK, DELETE_DECK, SAVE_DECK, SAVE_DRAFT, SET_DECKS,
} from "./constants";
import {
    ClearDecksAction,
    ClearDraftAction,
    CreateDeckAction,
    Deck, DeleteDeckAction, SaveDeckAction, SaveDraftAction, SetDecksAction,
} from "./types";

export function createDeck(payload: Deck): CreateDeckAction {
    return {
        payload,
        type: CREATE_DECK,
    };
}

export function saveDeck(): SaveDeckAction {
    return {
        type: SAVE_DECK,
    };
}

export function saveDraft(payload: Deck): SaveDraftAction {
    return {
        payload,
        type: SAVE_DRAFT,
    };
}

export function deleteDeck(payload: number): DeleteDeckAction {
    return {
        payload,
        type: DELETE_DECK,
    };
}

export function setDecks(payload: Deck[]): SetDecksAction {
    return {
        payload,
        type: SET_DECKS,
    };
}

export function clearDraft(): ClearDraftAction {
    return {
        type: CLEAR_DRAFT,
    };
}

export function clearDeck(): ClearDecksAction {
    return {
        type: CLEAR_DECKS,
    };
}
