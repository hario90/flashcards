import { State } from "../types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedDeckId = (state: State) => state.selection.deck;
export const getCurrentCard = (state: State) => state.selection.currentCard;
export const getSeenCards = (state: State) => state.selection.seenCards;
export const getUnseenCards = (state: State) => state.selection.unseenCards;
