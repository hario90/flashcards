import { LOGIN, SET_USER } from "./constants";
import { LoginAction, User } from "./types";

export function login(email: string, password: string): LoginAction {
    return {
        payload: {email, password},
        type: LOGIN,
    };
}

export function setUser(user: User) {
    return {
        payload: user,
        type: SET_USER,
    };
}
