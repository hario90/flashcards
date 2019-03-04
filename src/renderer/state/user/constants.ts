import { makeConstant } from "../util";

const BRANCH_NAME = "user";

export const LOGIN = makeConstant(BRANCH_NAME, "login");
export const SET_USER = makeConstant(BRANCH_NAME, "set_user");
export const SIGNUP = makeConstant(BRANCH_NAME, "signup");
export const SIGN_OUT = makeConstant(BRANCH_NAME, "sign_out");
export const UPDATE_USER = makeConstant(BRANCH_NAME, "update_user");
