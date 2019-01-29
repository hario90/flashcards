import { AxiosError, AxiosResponse } from "axios";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { clearDeck, clearDraft, setDecks } from "../deck/actions";
import { CardResponse, RawDeck } from "../deck/types";

import { addRequestToInProgress, removeRequestFromInProgress, setAlert } from "../feedback/actions";
import { AlertType, HttpRequestType } from "../feedback/types";
import { setPage } from "../page/actions";
import { Page } from "../page/types";
import { resetSelections } from "../selection/actions";
import { ReduxLogicDeps, ReduxLogicDoneCb, ReduxLogicNextCb } from "../types";
import { batchActions } from "../util";

import { setUser } from "./actions";
import { LOGIN, SIGN_OUT, SIGNUP } from "./constants";
import { User } from "./types";

const loginLogic = createLogic({
    process: ({getState, action, httpClient, baseApiUrl}: ReduxLogicDeps,
              next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const loginAction = action.payload.find((a: AnyAction) => a.type === LOGIN);
        if (!loginAction) {
            done();
        }

        const actions: AnyAction[] = [];
        httpClient.post(`${baseApiUrl}/users/login`, loginAction.payload)
            .then(({ data }: AxiosResponse<User>) => {
                actions.push(setUser(data));
                Promise.all([
                    httpClient.get(`${baseApiUrl}/decks/users/${data.id}`),
                    httpClient.get(`${baseApiUrl}/cards/users/${data.id}`),
                ]).then(([{ data: decks }, { data: cards }]) => {
                    const decksWithCards = decks.map((d: RawDeck) => {
                        return {
                            ...d,
                            cards: cards.filter((c: CardResponse) => c.deckId === d.id),
                        };
                    });
                    actions.push(
                        setDecks(decksWithCards),
                        removeRequestFromInProgress(HttpRequestType.LOGIN),
                        setPage(Page.Home)
                        );
                    next(batchActions(actions));
                    done();
                }).catch((err: AxiosError) => {
                    actions.push(removeRequestFromInProgress(HttpRequestType.LOGIN));
                    if (err.response && err.response.status === 404) {
                        actions.push(
                            setPage(Page.Home)
                        );
                    } else if (err.response && err.response.data) {
                        console.log("err", err.response.data);
                        actions.push(setAlert({
                            message: err.response.data,
                            type: AlertType.ERROR,
                        }));
                    }
                    next(batchActions(actions));
                    done();
                });
            })
            .catch((err: AxiosError) => {
                actions.push(removeRequestFromInProgress(HttpRequestType.LOGIN));
                let message = "Unknown Error";
                if (err.response && err.response.data) {
                    message = err.response.data;
                } else if (err.message) {
                    message = err.message;
                }

                actions.push(setAlert({
                    message,
                    type: AlertType.ERROR,
                }));
                next(batchActions(actions));
                done();
            });
    },
    transform: ({getState, action, httpClient, baseApiUrl}: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        next(batchActions([
            addRequestToInProgress(HttpRequestType.LOGIN),
            action,
        ]));
    },
    type: LOGIN,
});

const signupLogic = createLogic({
    process: ({getState, action, httpClient, baseApiUrl}: ReduxLogicDeps,
              next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const signupAction = action.payload.find((a: AnyAction) => a.type === SIGNUP);
        if (!signupAction) {
            done();
        }
        httpClient.post(`${baseApiUrl}/users/`, signupAction.payload)
            .then((result: AxiosResponse<User>) => {
                console.log("result", result);
                next(batchActions([
                    setAlert({
                        message: "Success!",
                        type: AlertType.SUCCESS,
                    }),
                    setPage(Page.Login),
                    removeRequestFromInProgress(HttpRequestType.LOGIN),
                ]));
            })
            .catch((err: AxiosError) => {
                if (err.response) {
                    console.log("err", err.response.data);
                    next(batchActions([
                        setAlert({
                            message: err.response.data,
                            type: AlertType.ERROR,
                        }),
                        removeRequestFromInProgress(HttpRequestType.LOGIN),
                    ]));
                }
            })
            .then(done);
    },
    transform: ({getState, action, httpClient, baseApiUrl}: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        next(batchActions([
            addRequestToInProgress(HttpRequestType.SIGNUP),
            action,
        ]));
    },
    type: SIGNUP,
});

const signoutLogic = createLogic({
    transform: ({getState, action, httpClient, baseApiUrl}: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        next(batchActions([
            clearDeck(),
            clearDraft(),
            resetSelections(),
            action,
        ]));
    },
    type: SIGN_OUT,
});

export default [
    loginLogic,
    signupLogic,
    signoutLogic,
];
