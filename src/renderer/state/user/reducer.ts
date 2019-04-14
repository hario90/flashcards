import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { SET_USER, SIGN_OUT } from "./constants";
import { SetUserAction, SignOutAction, UserStateBranch } from "./types";

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
    [SIGN_OUT]: {
        accepts: (action: AnyAction): action is SignOutAction => action.type === SIGN_OUT,
        perform: () => ({
            ...initialState,
        }),
    },
};

export default makeReducer<UserStateBranch>(actionToConfigMap, initialState);
