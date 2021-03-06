import {
    applyMiddleware,
    combineReducers,
    createStore,
} from "redux";
import { createLogicMiddleware } from "redux-logic";
import { SinonStub } from "sinon";

import {
    deck,
    enableBatching,
    feedback,
    metadata,
    page,
    selection,
    State,
    user,
} from "../";

export interface ReduxLogicDependencies {
    baseApiUrl: string;
    httpClient: {
        get: SinonStub
    };
}

const reducers = {
    deck: deck.reducer,
    feedback: feedback.reducer,
    metadata: metadata.reducer,
    page: page.reducer,
    selection: selection.reducer,
    user: user.reducer,
};

const logics = [
    ...metadata.logics,
    ...selection.logics,
];

export function createReduxStore(initialState: State, reduxLogicDependencies: ReduxLogicDependencies) {
    const logicMiddleware = createLogicMiddleware(logics, reduxLogicDependencies);
    const middleware = applyMiddleware(logicMiddleware);
    const rootReducer = enableBatching<State>(combineReducers(reducers));

    if (initialState) {
        return createStore(rootReducer, initialState, middleware);
    }
    return createStore(rootReducer, middleware);
}
