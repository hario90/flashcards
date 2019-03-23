import { makeConstant } from "../util";
import { Deck } from "./types";

const BRANCH_NAME = "deck";

export const CREATE_DECK = makeConstant(BRANCH_NAME, "create");
export const SAVE_DECK = makeConstant(BRANCH_NAME, "save");
export const SAVE_DRAFT = makeConstant(BRANCH_NAME, "save-draft");
export const DELETE_DECK = makeConstant(BRANCH_NAME, "delete");
export const SET_DECKS = makeConstant(BRANCH_NAME, "set-decks");
export const CLEAR_DRAFT = makeConstant(BRANCH_NAME, "clear-draft");
export const CLEAR_DECKS = makeConstant(BRANCH_NAME, "clear-deck");

export const defaultDeck: Deck = {
    cards: [],
    id: 0,
    name: "",
    type: "BASIC",
};
