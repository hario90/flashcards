import { State } from "../types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedDeck = (state: State) => state.selection.deck;
