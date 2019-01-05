import { AxiosError, AxiosResponse } from "axios";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { setDecks } from "../deck/actions";
import { CardResponse, RawDeck } from "../deck/types";

import { addRequestToInProgress, removeRequestFromInProgress, setAlert } from "../feedback/actions";
import { AlertType, HttpRequestType } from "../feedback/types";
import { setPage } from "../page/actions";
import { Page } from "../page/types";
import { ReduxLogicDeps, ReduxLogicDoneCb, ReduxLogicNextCb } from "../types";
import { batchActions } from "../util";

import { setUser } from "./actions";
import { LOGIN, SIGNUP } from "./constants";
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
                    actions.push(setDecks(decksWithCards), removeRequestFromInProgress(HttpRequestType.LOGIN));
                    next(batchActions(actions));
                    done();
                }).catch((err: AxiosError) => {
                    if (err.response) {
                        console.log("err", err.response.data);
                        next(setAlert({
                            message: err.response.data,
                            type: AlertType.ERROR,
                        }));
                    }
                    done();
                });
            })
            .catch((err: AxiosError) => {
                if (err.response) {
                    console.log("err", err.response.data);
                    next(setAlert({
                        message: err.response.data,
                        type: AlertType.ERROR,
                    }));
                }
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
    transform: ({getState, action, httpClient, baseApiUrl}: ReduxLogicDeps,
                next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        httpClient.post(`${baseApiUrl}/users/`, action.payload)
            .then((result: AxiosResponse<User>) => {
                console.log("result", result);
                next(batchActions([
                    setAlert({
                        message: "Success!",
                        type: AlertType.SUCCESS,
                    }),
                    setPage(Page.Login),
                ]));
            })
            .catch((err: AxiosError) => {
                if (err.response) {
                    console.log("err", err.response.data);
                    next(setAlert({
                        message: err.response.data,
                        type: AlertType.ERROR,
                    }));
                }
            })
            .then(done);
    },
    type: SIGNUP,
});

export default [
    loginLogic,
    signupLogic,
];
