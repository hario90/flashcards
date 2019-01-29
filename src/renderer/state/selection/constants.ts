import { makeConstant } from "../util";

export const DESELECT_DECK = makeConstant("selection", "deselect-deck");
export const SELECT_DECK = makeConstant("selection", "select-deck");
export const SELECT_METADATA = makeConstant("selection", "select_metadata");
export const RESET_DECK = makeConstant("selection", "reset-deck");
export const GET_NEXT_CARD = makeConstant("selection", "get-next-card");
export const GET_PREVIOUS_CARD = makeConstant("selection", "get-previous-card");
export const SET_CURRENT_CARD = makeConstant("selection", "set-current-card");
export const SET_SEEN_CARDS = makeConstant("selection", "set-seen-cards");
export const SET_UNSEEN_CARDS = makeConstant("selection", "set-unseen-cards");
export const SHUFFLE_DECK = makeConstant("selection", "shuffle-deck");
export const RESET_SELECTIONS = makeConstant("selection", "reset-selections");
