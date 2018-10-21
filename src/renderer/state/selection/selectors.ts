import { createSelector } from "reselect";

import { getDecks } from "../deck/selectors";
import { Deck } from "../deck/types";
import { State } from "../types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedDeckId = (state: State) => state.selection.deck;

// COMPLEX
export const getSelectedDeck = createSelector([
    getSelectedDeckId,
    getDecks,
], (deckId: string | undefined, decks: Deck[]) => {
    console.log(deckId)
    console.log(decks)
    if (!deckId) {
        return null;
    }

    return decks.find((deck: Deck) => deck.name === deckId);
});
