import { AxiosError, AxiosResponse } from "axios";
import * as jwt from "jsonwebtoken";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";

import { clearDeck, clearDraft } from "../deck/actions";
import { addRequestToInProgress, removeRequestFromInProgress, setAlert } from "../feedback/actions";
import { AlertType, HttpRequestType } from "../feedback/types";
import { setPage } from "../page/actions";
import { Page } from "../page/types";
import { resetSelections } from "../selection/actions";
import { ReduxLogicDeps, ReduxLogicDoneCb, ReduxLogicNextCb } from "../types";
import { batchActions, getActionFromBatch, getDecksProcessLogic } from "../util";

import { setUser } from "./actions";
import { LOGIN, SIGN_OUT, SIGNUP, UPDATE_USER } from "./constants";
import { getUserId } from "./selectors";
import { User } from "./types";

const loginLogic = createLogic({
    process: async ({getState, action, httpClient, baseApiUrl}: ReduxLogicDeps,
                    next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        const loginAction = action.payload.find((a: AnyAction) => a.type === LOGIN);
        if (!loginAction) {
            done();
        }

        const actions: AnyAction[] = [];

        try {
            const loginUrl = `${baseApiUrl}/users/login`;
            const { data: token }: AxiosResponse<string> = await httpClient.post(loginUrl, loginAction.payload);
            localStorage.setItem("jwt", token);
            const jwtBody = jwt.decode(token, {complete: true}) as { payload: { user: User, expires: Date} };

            if (jwtBody && jwtBody.payload && jwtBody.payload.user) {
                const user = jwtBody.payload.user;
                actions.push(
                    setUser(user),
                    removeRequestFromInProgress(HttpRequestType.LOGIN),
                    setPage(Page.Home)
                );

                await getDecksProcessLogic(
                    getState,
                    httpClient,
                    baseApiUrl,
                    next,
                    done,
                    actions,
                    user.id,
                    undefined);
            } else {
                actions.push(setAlert({
                    message: "Could not get user information",
                    type: AlertType.ERROR,
                }));
            }

            next(batchActions(actions));
            done();
        } catch (err) {
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
        }
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
        localStorage.removeItem("jwt");
        next(batchActions([
            clearDeck(),
            clearDraft(),
            resetSelections(),
            //set page?
            action,
        ]));
    },
    type: SIGN_OUT,
});

const updateUserLogic = createLogic({
    process: ({httpClient, getState, baseApiUrl, action}: ReduxLogicDeps, dispatch: ReduxLogicNextCb,
              done: ReduxLogicDoneCb) => {
        const userId = getUserId(getState());
        const updateUserAction = getActionFromBatch(action, UPDATE_USER);

        if (!updateUserAction) {
            done();
        } else {
            httpClient
                .put(`${baseApiUrl}/users/${userId}`, updateUserAction.payload)
                .then((resp: AxiosResponse) => {
                    const {
                        id,
                        email,
                        first_name: firstName,
                        last_name: lastName,
                    } = resp.data;
                    dispatch(setUser({
                        email,
                        firstName,
                        id,
                        lastName,
                    }));
                })
                .catch((err: AxiosError) => {
                    // set an error message.
                    // tslint:ignore-next-line
                    console.log(err);
                    const message = (err && err.response && err.response.data) || "No message";
                    dispatch(setAlert({
                        message,
                        type: AlertType.ERROR,
                    }));
                })
                .then(() => {
                    dispatch(removeRequestFromInProgress(HttpRequestType.UPDATE_USER));
                    done();
                });
        }
    },
    transform: (deps: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        next(batchActions([
            addRequestToInProgress(HttpRequestType.UPDATE_USER),
            deps.action,
        ]));
    },
    type: UPDATE_USER,
});

export default [
    loginLogic,
    signupLogic,
    signoutLogic,
    updateUserLogic,
];
