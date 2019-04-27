import { AxiosInstance } from "axios";
import {
    AnyAction,
    Reducer,
} from "redux";

import { APP_ID } from "../constants";

import { setDecks } from "./deck/actions";
import { CardResponse, Deck, RawDeck } from "./deck/types";
import { addRequestToInProgress, removeRequestFromInProgress, setAlert } from "./feedback/actions";
import { AlertType, HttpRequestType } from "./feedback/types";
import { deselectDeck } from "./selection/actions";
import {
    BatchedAction, ReduxLogicDoneCb, ReduxLogicNextCb, State,
    TypeToDescriptionMap,
} from "./types";

export function makeConstant(associatedReducer: string, actionType: string) {
    return `${APP_ID}/${associatedReducer.toUpperCase()}/${actionType.toUpperCase()}`;
}

export function makeReducer<S>(typeToDescriptionMap: TypeToDescriptionMap, initialState: S): Reducer<S> {
    return (state: S = initialState, action: AnyAction) => {
        const description = typeToDescriptionMap[action.type];
        if (!description) {
            return state;
        }

        if (description.accepts(action)) {
            console.log(action.type);
            return description.perform(state, action);
        }

        return state;
    };
}

export const BATCH_ACTIONS = makeConstant("batch", "batch-actions");

export function batchActions(actions: AnyAction[], type: string = BATCH_ACTIONS): BatchedAction {
    return { type, batch: true, payload: actions };
}

function actionIsBatched(action: AnyAction): action is BatchedAction {
    return action && action.batch && Array.isArray(action.payload);
}

export function enableBatching<S>(reducer: Reducer<S>): Reducer<S> {
    return function batchingReducer(state: S | undefined , action: AnyAction): S {
        if (actionIsBatched(action) && state) {
            return action.payload.reduce(batchingReducer, state);
        }
        return reducer(state, action);
    };
}

export function getActionFromBatch(batchAction: AnyAction, type: string): AnyAction | undefined {
    if (actionIsBatched(batchAction) && type) {
        const actions = batchAction.payload;
        return actions.find((a) => a.type === type);
    } else if (batchAction.type === type) {
        return batchAction;
    }

    return undefined;
}

// this gets used in logics more than once: when logging in and when setting page to home.
// due to redux-logics weirdness, setting page in batched action doesn't trigger this logic.
export async function getDecksProcessLogic(
    getState: () => State,
    httpClient: AxiosInstance,
    baseApiUrl: string,
    dispatch: ReduxLogicNextCb,
    done: ReduxLogicDoneCb,
    actions: AnyAction[] = [],
    currentUserId: number,
    selectedDeck?: Deck) {

    dispatch(addRequestToInProgress(HttpRequestType.GET_DECKS));

    if (selectedDeck) {
        actions.push(deselectDeck());
    }

    const responses: void | [{data: any}, {data: any}] = await Promise.all([
        httpClient.get(`${baseApiUrl}/decks/users/${currentUserId}`),
        httpClient.get(`${baseApiUrl}/cards/users/${currentUserId}`),
    ]).catch((err) => {
        if (err.response.status !== 404) {
            actions.push(
                setAlert({
                    message: err.message || "Could not retrieve your decks.",
                    type: AlertType.ERROR,
                }),
                removeRequestFromInProgress(HttpRequestType.GET_DECKS)
            );
            dispatch(batchActions(actions));
            console.log(err);
            done();
        }
    });

    if (responses) {
        const decks = responses[0].data as Deck[];
        const cards = responses[1].data as CardResponse[];
        const decksWithCards = decks.map((d: RawDeck) => {
            return {
                ...d,
                cards: cards.filter((c: CardResponse) => c.deckId === d.id),
            };
        });
        actions.push(setDecks(decksWithCards));
    }

    actions.push(removeRequestFromInProgress(HttpRequestType.GET_DECKS));
    dispatch(batchActions(actions));
    done();
}
