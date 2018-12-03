import { message } from "antd";
import { isEmpty } from "lodash";
import { createLogic } from "redux-logic";

import { setAlert } from "../feedback/actions";
import { AlertType } from "../feedback/types";
import { setPage } from "../page/actions";
import { getNextPage } from "../page/selectors";
import { selectDeck } from "../selection/actions";
import {
    ReduxLogicDeps,
    ReduxLogicDoneCb,
    ReduxLogicNextCb,
} from "../types";
import { batchActions } from "../util";

import { setDecks } from "./actions";
import { CREATE_DECK, SAVE_DECK } from "./constants";
import { getDecks, getDraft, getErrorMessage } from "./selectors";
import { Card, Deck } from "./types";

const createDeckLogic = createLogic({
    transform: ({ getState, action }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        const decks = getDecks(getState());
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
            selectDeck(action.payload.id),
        ]));
    },
    type: CREATE_DECK,
});

const getCurrentDeck = (draft: Deck): Deck => {
    const { cards, id, name } = draft;
    const completeCards = cards.filter((card: Card) => card.front && card.back);
    return {
        cards: completeCards,
        id,
        name: name || "",
    };
};

const saveDeckLogic = createLogic({
    process: ({getState, action}: ReduxLogicDeps, dispatch: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const nextPage = getNextPage(getState());

        if (nextPage) {
            dispatch(setPage(nextPage));
        }

        done();
    },
    transform: ({getState, action}: ReduxLogicDeps, next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const actions = [];
        const decks = getDecks(getState());
        const draft = getDraft(getState());

        if (!draft) {
            next(action);
            done();
            return;
        }

        const errorMessage = getErrorMessage(getState());
        message.destroy();
        if (errorMessage) {
            next(setAlert({
                message: errorMessage,
                type: AlertType.ERROR,
            }));
            done();
        } else {
            const ids = decks.map((deck: Deck) => deck.id);
            const index = ids.indexOf(draft.id);
            const decksCopy = [
                ...decks,
            ];
            decksCopy[index] = getCurrentDeck(draft);
            actions.push(
                setDecks(decksCopy),
                setAlert({
                    message: "Deck saved!",
                    type: AlertType.SUCCESS,
                })
            );
            next(batchActions(actions));

            done();
        }
    },
    type: SAVE_DECK,
});

export default [
    createDeckLogic,
    saveDeckLogic,
];
