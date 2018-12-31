import { message } from "antd";
import { AxiosError, AxiosResponse } from "axios";
import { isEmpty, shuffle } from "lodash";
import { AnyAction } from "redux";
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
import { getUser } from "../user/selectors";
import { batchActions } from "../util";

import { clearDraft, setDecks } from "./actions";
import { CREATE_DECK, DELETE_DECK, SAVE_DECK } from "./constants";
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
    transform: ({getState, action, baseApiUrl, httpClient}: ReduxLogicDeps,
                next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const actions: AnyAction[] = [];
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
            const currentDeck = getCurrentDeck(draft);
            decksCopy[index] = currentDeck;
            actions.push(
                setDecks(decksCopy),
                setAlert({
                    message: "Deck saved!",
                    type: AlertType.SUCCESS,
                })
            );

            const requestBody = {
                ...currentDeck,
                userId: getUser(getState()).id,
            };

            httpClient.put(`${baseApiUrl}/decks`, requestBody)
                .then(() => {
                    next(batchActions(actions));
                    done();
                })
                .catch((err: AxiosError) => {
                    next(setAlert({
                        message: err.message,
                        type: AlertType.ERROR,
                    }));
                    done();
                });
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

const deleteDeckLogics = createLogic({
    transform: ({action, baseApiUrl, httpClient, getState}: ReduxLogicDeps,
                next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        httpClient.delete(`${baseApiUrl}/decks/${action.payload}`)
            .then(() => {
                next(action);
                done();
            })
            .catch(done);
    },
    type: DELETE_DECK,
});

export default [
    createDeckLogic,
    deleteDeckLogics,
    saveDeckLogic,
    shuffleDeckLogic,
];
