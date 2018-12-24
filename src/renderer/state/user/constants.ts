import { makeConstant } from "../util";

const BRANCH_NAME = "user";

export const LOGIN = makeConstant(BRANCH_NAME, "login");
export const SET_USER = makeConstant(BRANCH_NAME, "set_user");
