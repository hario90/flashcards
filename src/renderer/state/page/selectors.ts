import { isEmpty } from "lodash";
import { createSelector } from "reselect";

import { Deck } from "../deck/types";
import { getSelectedDeck } from "../selection/selectors";

import { State } from "../types";

import { Page } from "./types";

export const getPage = (state: State) => state.page.page;
export const getPreviousPage = (state: State) => state.page.previous;

export const getTitle = createSelector([
    getPage,
    getSelectedDeck,
], (page: Page, deck: Deck | undefined) => {
    switch(page) {
        case Page.Home:
            return "Your decks";
        case Page.Learn:
            return "Learn";
        case Page.Test:
            return "Test";
        case Page.CreateDeck:
            if (!deck || isEmpty(deck.cards)) {
                return "Create a new study set";
            }
            return deck.name;
        default:
            return "";
    }
});
