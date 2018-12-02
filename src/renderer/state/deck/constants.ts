import { makeConstant } from "../util";

const BRANCH_NAME = "deck";

export const CREATE_DECK = makeConstant(BRANCH_NAME, "create");
export const SAVE_DECK = makeConstant(BRANCH_NAME, "save");
export const SAVE_DRAFT = makeConstant(BRANCH_NAME, "save-draft");
export const DELETE_DECK = makeConstant(BRANCH_NAME, "delete");
export const SET_DECKS = makeConstant(BRANCH_NAME, "set-decks");
export const CLEAR_DRAFT = makeConstant(BRANCH_NAME, "clear-draft");
