import { createLogic } from "redux-logic";

import { selectDeck } from "../selection/actions";
import {
    ReduxLogicDeps,
    ReduxLogicNextCb,
} from "../types";
import { batchActions } from "../util";

import { CREATE_DECK } from "./constants";

const createDeckLogic = createLogic({
    transform: ({ getState, action }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        next(batchActions([
            action,
            selectDeck(action.payload),
        ]));
    },
    type: CREATE_DECK,
});

export default [
    createDeckLogic,
];
