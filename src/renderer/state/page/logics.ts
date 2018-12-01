import { isEmpty, shuffle } from "lodash";
import { createLogic } from "redux-logic";

import { saveDraft } from "../deck/actions";

import { Deck } from "../deck/types";
import { setCurrentCard, setSeenCards, setUnseenCards } from "../selection/actions";
import { getRandomCardFromDeck } from "../selection/logics";
import { getSelectedDeck } from "../selection/selectors";

import {
    ReduxLogicDeps,
    ReduxLogicNextCb,
} from "../types";
import { batchActions } from "../util";

import { setPage } from "./actions";
import { GO_BACK, previousPageMap, SET_PAGE } from "./constants";
import { Page } from "./types";
const EMPTY_CARD = {
    back: "",
    front: "",
};
const setPageLogic = createLogic({
    transform: ({ getState, action }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        const actions = [action];
        const selectedDeck: Deck | null | undefined = getSelectedDeck(getState());

        if (action.payload === Page.Flip && selectedDeck) {
            const { currentCard, unseenCards } = getRandomCardFromDeck({
                currentCard: undefined,
                seenCards: [],
                unseenCards: shuffle(selectedDeck.cards),
            });
            actions.push(
                setCurrentCard(currentCard),
                setSeenCards([]),
                setUnseenCards(unseenCards)
            );
        } else if (action.payload === Page.CreateDeck && selectedDeck) {
            actions.push(saveDraft({
                ...selectedDeck,
                cards: !isEmpty(selectedDeck.cards) ? [...selectedDeck.cards] : [EMPTY_CARD, EMPTY_CARD, EMPTY_CARD],
            }));
        }

        next(batchActions(actions));
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
