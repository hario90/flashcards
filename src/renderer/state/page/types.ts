export interface PageStateBranch {
    page: Page;
}

export enum Page {
    Home,
    CreateDeck,
}

export interface SetPageAction {
    payload: Page;
    type: string;
}
