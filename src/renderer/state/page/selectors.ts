import { includes } from "lodash";
import { createSelector } from "reselect";

import { getSelectedDeck } from "../deck/selectors";
import { Deck } from "../deck/types";
import { State } from "../types";
import { getUserIsLoggedIn } from "../user/selectors";

import { pagesForAllUsers, previousPageMap } from "./constants";
import { Page } from "./types";

export const getSelectedPage = (state: State) => state.page.page;
export const getNextPage = (state: State) => state.page.next;
export const getPreviousPage = createSelector([
    getSelectedPage,
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
    [Page.Login, "Flashcards"],
    [Page.SignUp, "Signup"],
    [Page.ForgotPassword, "Retrieve Password"],
]);

export const getPreviousTitle = createSelector([
    getPreviousPage,
], (page?: Page) => {
    if (page !== undefined && PAGE_TO_TITLE_MAP.has(page)) {
        // todo handle create vs edit
        return PAGE_TO_TITLE_MAP.get(page);
    }
    return "";
});

export const getPage = createSelector([
    getSelectedPage,
    getUserIsLoggedIn,
], (page: Page, isLoggedIn: boolean) => {
    if (includes(pagesForAllUsers, page)) {
        return page;
    }

    return isLoggedIn ? page : Page.Login;
});

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
