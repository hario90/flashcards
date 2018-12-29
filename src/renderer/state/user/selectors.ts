import { createSelector } from "reselect";

import { State } from "../types";

export const getUser = (state: State) => state.user;
export const getEmail = (state: State) => state.user.email;
export const getFirstName = (state: State) => state.user.firstName;
export const getLastName = (state: State) => state.user.lastName;
export const getAvatarSrc = (state: State) => state.user.avatarSrc;

export const getUserIsLoggedIn = createSelector([getEmail], (email?: string) => {
    return !!email;
});
