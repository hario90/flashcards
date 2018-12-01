import { State } from "../types";

export const getDecks = (state: State) => state.deck.decks;
export const getDraft = (state: State) => state.deck.draft;
