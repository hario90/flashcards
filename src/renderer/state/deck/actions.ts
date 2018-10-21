import {
    CREATE_DECK
} from "./constants";
import {
    CreateDeckAction,
    Deck,
} from "./types";

export function createDeck(payload: string): CreateDeckAction {
    return {
        payload,
        type: CREATE_DECK,
    };
}
