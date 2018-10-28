import { makeConstant } from "../util";

export const DESELECT_DECK = makeConstant("selection", "deselect-file");
export const SELECT_DECK = makeConstant("selection", "select-file");
export const SELECT_METADATA = makeConstant("selection", "select_metadata");
export const RESET_DECK = makeConstant("selection", "reset-deck");
export const GET_NEXT_CARD = makeConstant("selection", "get-next-card");
export const SET_CURRENT_CARD = makeConstant("selection", "set-current-card");
export const SET_SEEN_CARDS = makeConstant("selection", "set-seen-cards");
export const SET_UNSEEN_CARDS = makeConstant("selection", "set-unseen-cards");
