import { Event, ipcRenderer } from "electron";
import { isEmpty, shuffle } from "lodash";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { events } from "../../../shared";
import { clearDraft, saveDeck, saveDraft } from "../deck/actions";
import { getSelectedDeck, unsavedChanges } from "../deck/selectors";
import { Deck } from "../deck/types";
import { setCurrentCard, setSeenCards, setUnseenCards } from "../selection/actions";
import {
    ReduxLogicDeps, ReduxLogicDoneCb,
    ReduxLogicNextCb,
} from "../types";
import { getUser } from "../user/selectors";
import { UserStateBranch } from "../user/types";
import { batchActions, getActionFromBatch, getDecksProcessLogic } from "../util";

import { clearNextPage, setNextPage, setPage } from "./actions";
import { GO_BACK, previousPageMap, SET_PAGE } from "./constants";
import { getNextPage, getSelectedPage } from "./selectors";
import { Page } from "./types";
const EMPTY_CARD = {
    back: "",
    front: "",
};

const setPageLogic = createLogic({
    process: async ({ getState, action: possiblyBatchedAction, httpClient, baseApiUrl }: ReduxLogicDeps,
                    dispatch: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const action = getActionFromBatch(possiblyBatchedAction, SET_PAGE) || {payload: undefined};
        const actions: AnyAction[] = [];
        const selectedDeck: Deck | undefined = getSelectedDeck(getState());
        const unsavedChangesExist: boolean = unsavedChanges(getState());
        let nextPage = getNextPage(getState());

        if (!action && !nextPage) {
            return done();
        }

        if (nextPage && unsavedChangesExist) {
            dispatch(saveDeck());
            actions.push(setPage(nextPage), clearNextPage());
        }

        nextPage = nextPage || action.payload;

        if (nextPage === Page.Flip && selectedDeck) {
            actions.push(
                clearNextPage(),
                setCurrentCard(undefined),
                setSeenCards([]),
                setUnseenCards(shuffle(selectedDeck.cards))
            );
            dispatch(batchActions(actions));
            done();
        } else if (nextPage === Page.CreateDeck && selectedDeck) {
            actions.push(
                clearNextPage(),
                saveDraft({
                    ...selectedDeck,
                    cards: !isEmpty(selectedDeck.cards) ? [...selectedDeck.cards]
                        : [EMPTY_CARD, EMPTY_CARD, EMPTY_CARD],
                }));
            dispatch(batchActions(actions));
            done();
        } else if (nextPage === Page.Home) {
            const currentUser: UserStateBranch = getUser(getState());
            if (currentUser.id) {
                await getDecksProcessLogic(
                    getState,
                    httpClient,
                    baseApiUrl,
                    dispatch,
                    done,
                    actions,
                    currentUser.id,
                    selectedDeck
                );
            }

        } else {
            dispatch(batchActions(actions));
            done();
        }
    },
    type: SET_PAGE,
    validate: ({ getState, action, httpClient, baseApiUrl }: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        const currentPage: Page = getSelectedPage(getState());
        const unsavedChangesExist: boolean = unsavedChanges(getState());
        action = {...action, prev: currentPage};
        if (currentPage === Page.CreateDeck && unsavedChangesExist) {
            ipcRenderer.on(events.SAVE_DECK, (event: Event, saveClicked: boolean) => {
                if (saveClicked) {
                    next(setNextPage(action.payload));
                    // if saving, don't go anywhere yet, just save where we want to go if success
                } else {
                    next(batchActions([action, clearDraft()]));
                }
            });
            ipcRenderer.send(events.SHOW_SAVE_DECK_MESSAGE);

        } else {
            next(action);
        }
    },
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
