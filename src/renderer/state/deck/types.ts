export interface DeckStateBranch {
    decks: Deck[];
    draft?: Deck;
}

export interface Card {
    front: string;
    back: string;
}

export interface Deck {
    id: number;
    name: string;
    cards: Card[];
}

export interface CreateDeckAction {
    payload: Deck;
    type: string;
}

export interface SaveDeckAction {
    payload: Deck;
    type: string;
}

export interface SaveDraftAction {
    payload: Deck;
    type: string;
}

export interface DeleteDeckAction {
    payload: number;
    type: string;
}
