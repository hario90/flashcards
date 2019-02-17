export interface PageStateBranch {
    page: Page;
    previous?: Page;
    next?: Page;
}

export enum Page {
    Home = "Home",
    CreateDeck = "Create Deck",
    Flip = "Flip",
    Match = "Match",
    Test = "Test",
    Share = "Share",
    Login = "Login",
    Signup = "Signup",
    ForgotPassword = "Forgot Password",
    Profile = "Profile",
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
