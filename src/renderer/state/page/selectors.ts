import { State } from "../types";

export const getPage = (state: State) => state.page.page;
export const getPreviousPage = (state: State) => state.page.previous;
