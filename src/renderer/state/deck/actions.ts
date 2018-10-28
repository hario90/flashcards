import {
    CREATE_DECK, DELETE_DECK, SAVE_DECK,
} from "./constants";
import {
    CreateDeckAction,
    Deck, DeleteDeckAction, SaveDeckAction,
} from "./types";

export function createDeck(payload: Deck): CreateDeckAction {
    return {
        payload,
        type: CREATE_DECK,
    };
}

export function saveDeck(payload: Deck): SaveDeckAction {
    return {
        payload,
        type: SAVE_DECK,
    };
}

export function deleteDeck(payload: number): DeleteDeckAction {
    return {
        payload,
        type: DELETE_DECK,
    };
}
