import { makeConstant } from "../util";

import { Page } from "./types";

const BRANCH_NAME = "page";

export const SET_PAGE = makeConstant(BRANCH_NAME, "set");
export const SET_NEXT_PAGE = makeConstant(BRANCH_NAME, "set-next");
export const GO_BACK = makeConstant(BRANCH_NAME, "go-back");
export const CLEAR_NEXT_PAGE = makeConstant(BRANCH_NAME, "clear-next-page");

export const previousPageMap = new Map([
    [Page.Home, undefined],
    [Page.CreateDeck, Page.Home],
    [Page.Flip, Page.CreateDeck],
    [Page.Test, Page.CreateDeck],
    [Page.Share, Page.CreateDeck],
    [Page.Copy, Page.CreateDeck],
]);

export const pagesForAllUsers = [
    Page.Login,
    Page.SignUp,
    Page.ForgotPassword,
];
