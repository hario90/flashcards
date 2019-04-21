import { decode } from "jsonwebtoken";
import { createSelector } from "reselect";

import { State } from "../types";

import { User, UserStateBranch } from "./types";

export const getJWT = () => localStorage.getItem("jwt");
export const getUserFromMemory = (state: State) => state.user;

export const getUser = createSelector([
    getUserFromMemory,
    getJWT,
], (user: UserStateBranch, jwt: string | null): UserStateBranch => {
    if (jwt) {
        const jwtBody = decode(jwt, {complete: true}) as { payload: { user: User, expires: Date} };

        if (jwtBody) {
            return jwtBody.payload.user;
        }
    }

    return user;
});

export const getUserIsLoggedIn = createSelector(
    [getUser],
    (user: UserStateBranch): boolean => {
    return !!user.id;
});

export const getUserId = createSelector(
    [getUser],
    (user: UserStateBranch): number | undefined => {
    return user.id;
});

export const getFirstName = createSelector(
    [getUser],
    (user: UserStateBranch): string | undefined => {
        return user.firstName;
    }
);

export const getLastName = createSelector(
    [getUser],
    (user: UserStateBranch): string | undefined => {
        return user.lastName;
    }
);

export const getEmail = createSelector(
    [getUser],
    (user: UserStateBranch): string | undefined => {
        return user.email;
    }
);

export const getAvatarSrc = createSelector(
    [getUser],
    (user: UserStateBranch): string | undefined => {
        return user.avatarSrc;
    }
);
