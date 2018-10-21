import {
    CREATE_DECK, SAVE_DECK,
} from "./constants";
import {
    CreateDeckAction,
    Deck, SaveDeckAction,
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
