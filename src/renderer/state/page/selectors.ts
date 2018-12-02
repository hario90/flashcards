import { createSelector } from "reselect";

import { Deck } from "../deck/types";
import { getSelectedDeck } from "../selection/selectors";
import { State } from "../types";

import { previousPageMap } from "./constants";

import { Page } from "./types";

export const getPage = (state: State) => state.page.page;
export const getNextPage = (state: State) => state.page.next;
export const getPreviousPage = createSelector([
    getPage,
], (page: Page) => {
    if (page !== undefined && previousPageMap.has(page)) {
        return previousPageMap.get(page);
    }

    return undefined;
});

export const PAGE_TO_TITLE_MAP = new Map([
    [Page.Home, "Your Decks"],
    [Page.Flip, "Flip"],
    [Page.Test, "Test"],
    [Page.CreateDeck, "Create New Study Set"],
    [Page.Copy, "Copy"],
    [Page.Share, "Share"],
]);
export const getTitle = createSelector([
    getPage,
    getSelectedDeck,
], (page: Page, deck: Deck | undefined) => {
    if (PAGE_TO_TITLE_MAP.has(page)) {
        // todo handle create vs edit
        return PAGE_TO_TITLE_MAP.get(page);
    }
    return "";
});

export const getPreviousTitle = createSelector([
    getPreviousPage,
], (page?: Page) => {
    if (page !== undefined && PAGE_TO_TITLE_MAP.has(page)) {
        // todo handle create vs edit
        return PAGE_TO_TITLE_MAP.get(page);
    }
    return "";
});
