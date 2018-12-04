import { isEmpty, shuffle } from "lodash";
import { createLogic } from "redux-logic";

import { clearDraft, saveDraft } from "../deck/actions";
import { SAVE_DECK } from "../deck/constants";
import { getSelectedDeck, unsavedChanges } from "../deck/selectors";

import { Deck } from "../deck/types";
import { clearAlert, setAlert } from "../feedback/actions";
import { AlertType } from "../feedback/types";
import { setCurrentCard, setSeenCards, setUnseenCards } from "../selection/actions";
import { getRandomCardFromDeck } from "../selection/logics";

import {
    ReduxLogicDeps,
    ReduxLogicNextCb,
} from "../types";
import { batchActions } from "../util";

import { clearNextPage, setNextPage, setPage } from "./actions";
import { GO_BACK, previousPageMap, SET_PAGE } from "./constants";
import { getPage } from "./selectors";
import { Page } from "./types";
const EMPTY_CARD = {
    back: "",
    front: "",
};
const setPageLogic = createLogic({
    transform: ({ getState, action }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        const actions = [];
        const selectedDeck: Deck | undefined = getSelectedDeck(getState());
        const currentPage: Page = getPage(getState());
        const unsavedChangesExist: boolean = unsavedChanges(getState());

        if (currentPage === Page.CreateDeck && unsavedChangesExist) {
            actions.push(
                setAlert({
                    message: "Save Deck?",
                    onNo: batchActions([action, clearDraft(), clearAlert()]),
                    onYes: { type: SAVE_DECK },
                    type: AlertType.WARN,
                }),
                setNextPage(action.payload)
            );
        } else if (action.payload === Page.Flip && selectedDeck) {
            const { currentCard, unseenCards } = getRandomCardFromDeck({
                currentCard: undefined,
                seenCards: [],
                unseenCards: shuffle(selectedDeck.cards),
            });
            actions.push(
                action,
                clearNextPage(),
                setCurrentCard(currentCard),
                setSeenCards([]),
                setUnseenCards(unseenCards)
            );
        } else if (action.payload === Page.CreateDeck && selectedDeck) {
            actions.push(
                action,
                clearNextPage(),
                saveDraft({
                    ...selectedDeck,
                    cards: !isEmpty(selectedDeck.cards) ? [...selectedDeck.cards]
                        : [EMPTY_CARD, EMPTY_CARD, EMPTY_CARD],
                }));
        } else {
            actions.push(action);
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
