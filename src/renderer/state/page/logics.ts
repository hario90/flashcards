import { createLogic } from "redux-logic";

import {
    ReduxLogicDeps,
    ReduxLogicNextCb,
} from "../types";
import { batchActions } from "../util";

import { setPage } from "./actions";
import { GO_BACK, previousPageMap, SET_PAGE } from "./constants";

const setPageLogic = createLogic({
    transform: ({ getState, action }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        next(batchActions([
            action,
        ]));
    },
    type: SET_PAGE,
});

const goBackLogic = createLogic({
    transform: ({ getState, action }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        const previous = previousPageMap.get(getState().page.page);
        if (previous !== undefined) {
            next(setPage(previous));
        }
        next(action);
    },
    type: GO_BACK,
});

export default [
    goBackLogic,
    setPageLogic,
];
