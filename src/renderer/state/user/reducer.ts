import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { SET_USER } from "./constants";

import { SetUserAction, UserStateBranch } from "./types";

export const initialState: UserStateBranch = {
    // avatarSrc: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
};

const actionToConfigMap: TypeToDescriptionMap = {
    [SET_USER]: {
        accepts: (action: AnyAction): action is SetUserAction => action.type === SET_USER,
        perform: (state: UserStateBranch, action: SetUserAction) => ({
            ...state,
            ...action.payload,
        }),
    },
};

export default makeReducer<UserStateBranch>(actionToConfigMap, initialState);
