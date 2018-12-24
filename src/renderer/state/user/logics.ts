import { AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { ReduxLogicDeps, ReduxLogicNextCb } from "../types";

import { setUser } from "./actions";
import { LOGIN } from "./constants";
import { User } from "./types";

const loginLogic = createLogic({
    transform: ({getState, action, httpClient, baseApiUrl}: ReduxLogicDeps, next: ReduxLogicNextCb) => {
        httpClient.post(`${baseApiUrl}/users/login`, action.payload)
            .then((result: AxiosResponse<User>) => {
                console.log("result", result);
                next(setUser(result.data));
            })
            .catch((err: string) => console.log("err", err));
    },
    type: LOGIN,
});

export default [
    loginLogic,
];
