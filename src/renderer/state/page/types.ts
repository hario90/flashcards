export interface PageStateBranch {
    page: Page;
    previous?: Page;
    next?: Page;
}

export enum Page {
    Home,
    CreateDeck,
    Flip,
    Match,
    Test,
    Share,
    Login,
    Signup,
    ForgotPassword,
    Profile,
}

export interface SetPageAction {
    payload: Page;
    type: string;
}

export interface SetNextPageAction {
    payload: Page;
    type: string;
}

export interface GoBackAction {
    type: string;
}

export interface SetPreviousPageAction {
    payload: Page;
    type: string;
}

export interface ClearNextPageAction {
    type: string;
}
