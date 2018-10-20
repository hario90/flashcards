export interface DeckStateBranch {
    decks: Deck[];
}

export interface Card {
    front: string;
    back: string;
}

export interface Deck {
    name: string;
    cards: Card[];
}

export interface CreateDeckAction {
    payload: Deck;
    type: string;
}
