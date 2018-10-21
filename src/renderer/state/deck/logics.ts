import { isEmpty } from "lodash";
import { createLogic } from "redux-logic";

import { selectDeck } from "../selection/actions";
import {
    ReduxLogicDeps,
    ReduxLogicNextCb,
} from "../types";
import { batchActions } from "../util";

import { CREATE_DECK } from "./constants";
import { Deck } from "./types";

const createDeckLogic = createLogic({
    transform: ({ getState, action }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        const { decks } = getState().deck;
        let id: number = 1;
        if (!isEmpty(decks)) {
            const ids = decks.map((deck: Deck) => deck.id);
            id = Math.max(...ids) + 1;
        }

        action.payload = {
            ...action.payload,
            id,
        };

        next(batchActions([
            action,
            selectDeck(id),
        ]));
    },
    type: CREATE_DECK,
});

export default [
    createDeckLogic,
];
