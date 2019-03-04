import { LOGIN, SET_USER, SIGN_OUT, SIGNUP, UPDATE_USER } from "./constants";
import { LoginAction, UpdateUserRequest, User } from "./types";

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

export function updateUser(payload: UpdateUserRequest) {
    return {
        payload,
        type: UPDATE_USER,
    };
}

export function signup(email: string, password: string, firstName: string, lastName: string) {
    return {
        payload: {
            email,
            firstName,
            lastName,
            password,
        },
        type: SIGNUP,
    };
}

export function signOut() {
    return {
        type: SIGN_OUT,
    };
}
