// import { createSelector } from "reselect";
//
// import { getDecks } from "../deck/selectors";
// import { Deck } from "../deck/types";
import { State } from "../types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedDeck = (state: State) => state.selection.deck;
export const getCurrentCard = (state: State) => state.selection.currentCard;
export const getSeenCards = (state: State) => state.selection.seenCards;
export const getUnseenCards = (state: State) => state.selection.unseenCards;

// // COMPLEX
// export const getSelectedDeck = createSelector([
//     getSelectedDeckId,
//     getDecks,
// ], (deckId: number | undefined, decks: Deck[]) => {
//     if (!deckId) {
//         return undefined;
//     }
//
//     return decks.find((deck: Deck) => deck.id === deckId);
// });
