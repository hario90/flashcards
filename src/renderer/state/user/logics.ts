import { AxiosError, AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { setAlert } from "../feedback/actions";
import { AlertType } from "../feedback/types";
import { setPage } from "../page/actions";
import { Page } from "../page/types";
import { ReduxLogicDeps, ReduxLogicDoneCb, ReduxLogicNextCb } from "../types";
import { batchActions } from "../util";

import { setUser } from "./actions";
import { LOGIN, SIGNUP } from "./constants";
import { User } from "./types";

const loginLogic = createLogic({
    transform: ({getState, action, httpClient, baseApiUrl}: ReduxLogicDeps,
                next: ReduxLogicNextCb, done: ReduxLogicDoneCb) => {
        httpClient.post(`${baseApiUrl}/users/login`, action.payload)
            .then((result: AxiosResponse<User>) => {
                console.log("result", result);
                next(setUser(result.data));
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
