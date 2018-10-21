import {
    DESELECT_DECK,
    SELECT_DECK,
    SELECT_METADATA,
} from "./constants";
import {
    DeselectDeckAction,
    SelectDeckAction,
    SelectMetadataAction,
} from "./types";

export function selectDeck(deckId: string | string[]): SelectDeckAction {
    return {
        payload: deckId,
        type: SELECT_DECK,
    };
}

export function deselectFile(deckId: string | string[]): DeselectDeckAction {
    return {
        payload: deckId,
        type: DESELECT_DECK,
    };
}

export function selectMetadata(key: string, payload: string | number): SelectMetadataAction  {
    return {
        key,
        payload,
        type: SELECT_METADATA,
    };
}
