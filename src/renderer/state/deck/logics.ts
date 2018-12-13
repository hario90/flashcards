import { message } from "antd";
import { isEmpty, shuffle } from "lodash";
import { createLogic } from "redux-logic";

import { setAlert } from "../feedback/actions";
import { getAlert } from "../feedback/selectors";
import { AlertType } from "../feedback/types";
import { clearNextPage, setPage } from "../page/actions";
import { getNextPage } from "../page/selectors";
import { selectDeck, setCurrentCard, setSeenCards, setUnseenCards } from "../selection/actions";
import { SHUFFLE_DECK } from "../selection/constants";
import {
    ReduxLogicDeps,
    ReduxLogicDoneCb,
    ReduxLogicNextCb,
} from "../types";
import { batchActions } from "../util";

import { clearDraft, setDecks } from "./actions";
import { CREATE_DECK, SAVE_DECK } from "./constants";
import { getDecks, getDraft, getErrorMessage, getSelectedDeck } from "./selectors";
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
        const selectedDeck = getSelectedDeck(getState());
        const alert = getAlert(getState());

        if (nextPage && selectedDeck && (!alert || (alert.type !== AlertType.ERROR))) {
            dispatch(batchActions([
                setPage(nextPage),
                clearNextPage(),
                clearDraft(),
                setCurrentCard(undefined),
                setSeenCards([]),
                setUnseenCards(shuffle(selectedDeck.cards)),
            ]));
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

const shuffleDeckLogic = createLogic({
    transform: ({getState, action}: ReduxLogicDeps, next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const selectedDeck = getSelectedDeck(getState());
        if (selectedDeck) {
            next(
                batchActions([
                    setCurrentCard(undefined),
                    setSeenCards([]),
                    setUnseenCards(shuffle(selectedDeck.cards)),
                ])
            );
        }

        done();
    },
    type: SHUFFLE_DECK,
});

export default [
    createDeckLogic,
    saveDeckLogic,
    shuffleDeckLogic,
];
