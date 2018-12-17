import { State } from "../types";

export const getFirstName = (state: State) => state.user.firstName;
export const getLastName = (state: State) => state.user.lastName;
export const getAvatarSrc = (state: State) => state.user.avatarSrc;
