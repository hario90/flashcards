import { isEmpty, shuffle } from "lodash";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { clearDraft, saveDraft, setDecks } from "../deck/actions";
import { SAVE_DECK } from "../deck/constants";
import { getSelectedDeck, unsavedChanges } from "../deck/selectors";

import { CardResponse, Deck, RawDeck } from "../deck/types";
import { clearAlert, setAlert } from "../feedback/actions";
import { AlertType } from "../feedback/types";
import { deselectDeck, setCurrentCard, setSeenCards, setUnseenCards } from "../selection/actions";

import {
    ReduxLogicDeps,
    ReduxLogicNextCb,
} from "../types";
import { getUser } from "../user/selectors";
import { UserStateBranch } from "../user/types";
import { batchActions } from "../util";

import { clearNextPage, setNextPage, setPage } from "./actions";
import { GO_BACK, previousPageMap, SET_PAGE } from "./constants";
import { getSelectedPage } from "./selectors";
import { Page } from "./types";
const EMPTY_CARD = {
    back: "",
    front: "",
};
const setPageLogic = createLogic({
    transform: ({ getState, action, httpClient, baseApiUrl }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        const actions: AnyAction[] = [];
        const selectedDeck: Deck | undefined = getSelectedDeck(getState());
        const currentPage: Page = getSelectedPage(getState());
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
            next(batchActions(actions));
        } else if (action.payload === Page.Flip && selectedDeck) {
            actions.push(
                action,
                clearNextPage(),
                setCurrentCard(undefined),
                setSeenCards([]),
                setUnseenCards(shuffle(selectedDeck.cards))
            );
            next(batchActions(actions));
        } else if (action.payload === Page.CreateDeck && selectedDeck) {
            actions.push(
                action,
                clearNextPage(),
                saveDraft({
                    ...selectedDeck,
                    cards: !isEmpty(selectedDeck.cards) ? [...selectedDeck.cards]
                        : [EMPTY_CARD, EMPTY_CARD, EMPTY_CARD],
                }));
            next(batchActions(actions));
        } else if (action.payload === Page.Home) {
            actions.push(action);
            if (selectedDeck) {
                actions.push(deselectDeck());
            }

            const currentUser: UserStateBranch = getUser(getState());
            Promise.all([
                httpClient.get(`${baseApiUrl}/decks/users/${currentUser.id}`),
                httpClient.get(`${baseApiUrl}/cards/users/${currentUser.id}`),
            ]).then(([{ data: decks }, { data: cards }]) => {
                const decksWithCards = decks.map((d: RawDeck) => {
                    return {
                        ...d,
                        cards: cards.filter((c: CardResponse) => c.deckId === d.id),
                    };
                });
                actions.push(setDecks(decksWithCards));
                next(batchActions(actions));
            });
        } else {
            actions.push(action);
            next(batchActions(actions));
        }
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
