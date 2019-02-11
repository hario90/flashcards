import { createSelector } from "reselect";

import { State } from "../types";

// BASIC SELECTORS
export const getSelectedDeckId = (state: State) => state.selection.deck;
export const getCurrentCard = (state: State) => state.selection.currentCard;
export const getSeenCards = (state: State) => state.selection.seenCards;
export const getUnseenCards = (state: State) => state.selection.unseenCards;

export const getDeckActionsHidden = createSelector([
    getSelectedDeckId,
], (deckId?: number) => !deckId || deckId < 1);
