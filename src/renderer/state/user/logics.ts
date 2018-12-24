import { AxiosError, AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { setAlert } from "../feedback/actions";
import { AlertType } from "../feedback/types";
import { ReduxLogicDeps, ReduxLogicDoneCb, ReduxLogicNextCb } from "../types";

import { setUser } from "./actions";
import { LOGIN } from "./constants";
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

export default [
    loginLogic,
];
