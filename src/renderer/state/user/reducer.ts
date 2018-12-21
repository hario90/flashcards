import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { UserStateBranch } from "./types";

export const initialState: UserStateBranch = {
    // avatarSrc: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    // email: "",
    // firstName: "Lisa",
    // lastName: "Harrylock",
};

const actionToConfigMap: TypeToDescriptionMap = {

};

export default makeReducer<UserStateBranch>(actionToConfigMap, initialState);
