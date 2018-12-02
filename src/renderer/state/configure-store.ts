import axios from "axios";
import {
    applyMiddleware,
    combineReducers,
    createStore,
} from "redux";
import { createLogicMiddleware } from "redux-logic";

import { BASE_API_URL } from "../constants";

import {
    deck,
    enableBatching,
    feedback,
    metadata,
    page,
    selection,
    State,
} from "./";

const reducers = {
    deck: deck.reducer,
    feedback: feedback.reducer,
    metadata: metadata.reducer,
    page: page.reducer,
    selection: selection.reducer,
};

const logics = [
    ...deck.logics,
    ...metadata.logics,
    ...page.logics,
    ...selection.logics,
];

const reduxLogicDependencies = {
    baseApiUrl: BASE_API_URL,
    httpClient: axios,
};

export default function createReduxStore(initialState?: State) {
    const logicMiddleware = createLogicMiddleware(logics, reduxLogicDependencies);
    const middleware = applyMiddleware(logicMiddleware);
    const rootReducer = enableBatching<State>(combineReducers(reducers));

    if (initialState) {
        return createStore(rootReducer, initialState, middleware);
    }

    return createStore(rootReducer, middleware);
}
