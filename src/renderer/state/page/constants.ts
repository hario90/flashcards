import { makeConstant } from "../util";

import { Page } from "./types";

export const SET_PAGE = makeConstant("page", "set");
export const GO_BACK = makeConstant("page", "go_back");

export const previousPageMap = new Map([
    [Page.Home, undefined],
    [Page.CreateDeck, Page.Home],
    [Page.Flip, Page.CreateDeck],
    [Page.Test, Page.CreateDeck],
    [Page.Share, Page.CreateDeck],
    [Page.Copy, Page.CreateDeck],
]);
