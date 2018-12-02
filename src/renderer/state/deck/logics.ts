import { message } from "antd";
import { isEmpty } from "lodash";
import { createLogic } from "redux-logic";

import { clearAlert, setAlert } from "../feedback/actions";
import { AlertType } from "../feedback/types";
import { clearNextPage, setPage } from "../page/actions";
import { getNextPage } from "../page/selectors";
import { selectDeck } from "../selection/actions";
import {
    ReduxLogicDeps,
    ReduxLogicNextCb,
} from "../types";
import { batchActions } from "../util";

import { clearDraft, setDecks } from "./actions";
import { CREATE_DECK, SAVE_DECK } from "./constants";
import { getDecks, getDraft } from "./selectors";
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
            selectDeck(action.payload),
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
    transform: ({getState, action}: ReduxLogicDeps, next: ReduxLogicNextCb, done: () => void) => {
        const actions = [];
        const decks = getDecks(getState());
        const draft = getDraft(getState());

        if (!draft) {
            next(action);
            done();
            return;
        }

        const { cards, name } = draft;
        const completeCards = cards.filter((card: Card) => card.front && card.back);
        let errorMessage = "";
        if (!name) {
            errorMessage = "You deck is missing a name. ";
        }

        if (isEmpty(completeCards)) {
            errorMessage += "Your deck is empty. Please make sure you have completed both sides of each card.";
        }

        message.destroy();
        if (errorMessage) {
            next(setAlert({
                message: errorMessage,
                type: AlertType.ERROR,
            }));
            done();
        } else {
            console.log("Deck Logics: clear alert, clear draft, set decks, set alert");
            const ids = decks.map((deck: Deck) => deck.id);
            const index = ids.indexOf(draft.id);
            const decksCopy = [
                ...decks,
            ];
            decksCopy[index] = getCurrentDeck(draft);
            console.log("saved draft:", getCurrentDeck(draft));
            actions.push(
                setDecks(decksCopy),
                setAlert({
                    message: "Deck created!",
                    type: AlertType.SUCCESS,
                })
            );
            const nextPage = getNextPage(getState());

            if (nextPage) {
                console.log("Deck Logics: set page to next");
                actions.push(
                    setPage(nextPage)
                );
            }

            next(batchActions(actions));
            next(clearDraft());
            done();
        }
    },
    type: SAVE_DECK,
});

export default [
    createDeckLogic,
    saveDeckLogic,
];
