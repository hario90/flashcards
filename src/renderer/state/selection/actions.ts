import { Card, Deck } from "../deck/types";

import {
    DESELECT_DECK,
    GET_NEXT_CARD,
    GET_PREVIOUS_CARD,
    SELECT_DECK,
    SELECT_METADATA,
    SET_CURRENT_CARD,
    SET_SEEN_CARDS,
    SET_UNSEEN_CARDS,
} from "./constants";
import {
    DeselectDeckAction,
    GetNextCardAction,
    GetPreviousCardAction,
    SelectDeckAction,
    SelectMetadataAction,
} from "./types";

export function selectDeck(deckId: number): SelectDeckAction {
    return {
        payload: deckId,
        type: SELECT_DECK,
    };
}

export function deselectDeck(deckId: number | number[]): DeselectDeckAction {
    return {
        payload: deckId,
        type: DESELECT_DECK,
    };
}

export function getNextCard(): GetNextCardAction {
    return {
        type: GET_NEXT_CARD,
    };
}

export function getPreviousCard(): GetPreviousCardAction {
    return {
        type: GET_PREVIOUS_CARD,
    };
}

export function selectMetadata(key: string, payload: string | number): SelectMetadataAction  {
    return {
        key,
        payload,
        type: SELECT_METADATA,
    };
}

export function setCurrentCard(card?: Card) {
    return {
        payload: card,
        type: SET_CURRENT_CARD,
    };
}

export function setSeenCards(seenCards: Card[]) {
    return {
        payload: seenCards,
        type: SET_SEEN_CARDS,
    };
}

export function setUnseenCards(unseenCards: Card[]) {
    return {
        payload: unseenCards,
        type: SET_UNSEEN_CARDS,
    };
}
